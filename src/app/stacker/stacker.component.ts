import {Component, inject, NgZone, OnInit, signal, ViewChild} from '@angular/core';
import {BonusesObject, Squad} from "../models/troop.model";
import {intersection, isNumber} from "lodash";
import {mercenaries, TroopColors, troops} from '../troops.data';
import {calculateStack, SetupType} from "./stacker";
import YAML from 'yaml'
import {bonusConfigDefaults, DEFAULT_TROOP_CONFIG, setupTypes, TroopConfig} from "./stacker-data";
import {debounceTime, filter, firstValueFrom, Observable, Subject, switchMap, tap} from "rxjs";
import {flying, guardsman, melee, mounted, ranged, specialist} from "../models/troop-type";
import {MatStepper} from "@angular/material/stepper";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {BackendService} from "../services/backend.service";
import {AuthService} from "@auth0/auth0-angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AppGenericDialog} from "../common/app-generic-dialog/app-generic-dialog";
import {catchError} from "rxjs/operators";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material/icon";
import {PlatformService} from "../services/platform.service";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {titles} from "../../environments/texts";

const RESET_SETTINGS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                 fill="#e3e3e3">
              <path
                d="M520-330v-60h160v60H520Zm60 210v-50h-60v-60h60v-50h60v160h-60Zm100-50v-60h160v60H680Zm40-110v-160h60v50h60v60h-60v50h-60Zm111-280h-83q-26-88-99-144t-169-56q-117 0-198.5 81.5T200-480q0 72 32.5 132t87.5 98v-110h80v240H160v-80h94q-62-50-98-122.5T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q129 0 226.5 79.5T831-560Z"/>
            </svg>`

@Component({
  selector: 'app-stacker',
  templateUrl: './stacker.component.html',
  styleUrls: ['./stacker.component.scss'],
  standalone: false,
})
export class StackerComponent implements OnInit {
  protected readonly troops: Squad[] = troops.map(t => new Squad(t, true));
  editorOptions = {
    theme: 'vs-dark',
    language: 'YAML',
    lineNumbers: false,
    fontSize: 18,
    scrollBeyondLastLine: false
  };
  valuesChange$ = new Subject<void>()
  troopList: Squad[] = []

  errors$ = new Subject<string>()
  protected readonly TroopColors = TroopColors;
  protected readonly troopLevelGuardsmen = ['G5', 'G6', 'G7', 'G8', 'G9']
  protected readonly troopLevelSpecialists = ['S5', 'S6', 'S7', 'S8', 'S9']
  protected readonly troopLevelMonsters = ['M5', 'M6', 'M7', 'M8', 'M9']
  public readonly mercenaryList = mercenaries
  readonly troopConfig = signal<TroopConfig>(DEFAULT_TROOP_CONFIG())
  readonly SetupType = SetupType
  public monacoLoaded = signal(false)
  @ViewChild(MatStepper) matStepperView!: MatStepper

  private _snackBar = inject(MatSnackBar);
  private router = inject(Router)
  private backend = inject(BackendService)
  private auth = inject(AuthService)
  readonly dialog = inject(MatDialog);
  readonly platform = inject(PlatformService);
  readonly ngZone = inject(NgZone)

  protected readonly setupTypes = setupTypes;
  readonly ERROR_MSG_01 = `⚠️ Either use 'army' or the 'guardsman/specialist' or the 'ranged/melee/mounted/flying' fields but don't mix them`
  readonly ERROR_MSG_02 = `⚠️ Must include health and strength, and must be a number`
  readonly ERROR_MSG_03 = `⚠️ Must include 'epic' field as well as one of the following 'army', 'guardsman/specialist',  'ranged/melee/mounted/flying'`
  readonly ERROR_MSG_04 = `⚠️ Setup structure is invalid`
  readonly ERROR_MSG_05 = `⚠️ Missing types `
  savedConfigs: TroopConfig[] = []
  fg: FormGroup = new FormGroup({
    leadership: new FormControl(this.troopConfig().leadership, [Validators.required, Validators.min(1)]),
    tiers: new FormControl(this.troopConfig().tiers, [Validators.required, Validators.minLength(1)])
  });

  constructor() {
    const titleService = inject(Title)
    titleService.setTitle(titles.stacker);
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIconLiteral('reset_settings', sanitizer.bypassSecurityTrustHtml(RESET_SETTINGS_SVG));

    // this.ngZone.runOutsideAngular(() => {
      this.auth.isAuthenticated$.pipe(
        filter(x => x),
        switchMap(() => this.fetch())
      ).subscribe()
    // })

    let snackBarRef: MatSnackBarRef<any>
    this.errors$.pipe(
      tap(error => {
        const duration = 1000 * 10
        if (snackBarRef)
          snackBarRef.dismiss()
        snackBarRef = this._snackBar.open(error, 'OK', {duration});
      })
    ).subscribe()

    this.valuesChange$.pipe(
      debounceTime(1000),
      tap(() => console.log('Recalculating...'))
    ).subscribe(() => this.calculateStacks())
  }

  fetch(id: number | undefined = undefined): Observable<any> {
    return this.backend.getSavedTroopConfigs().pipe(
      tap(configs => {
        this.savedConfigs.length = 0
        this.savedConfigs.push(...configs)
        if (id)
          this.troopConfig.set(configs.find(x => x.id === id) || DEFAULT_TROOP_CONFIG())
      })
    )
  }

  ngOnInit(): void {

      const isFirstTime = this.platform.isBrowser ?
        localStorage?.getItem("StackerComponent.exampleClicked") !== 'true' : false;

      if (isFirstTime) {
        // const snackBarRef = this._snackBar.open('See our YouTube tutorial', 'GO', {duration: 1000 * 10});
        // snackBarRef.onAction().subscribe(() => {
        //   this.router.navigate(['youtube'])
        // });
      }
  }

  calculateStacks() {
    console.log('in calculateStacks')
    this.troopList.length = 0
    const troopConfig = this.troopConfig()
    if (troopConfig.valid.bonus && troopConfig.valid.bonus) {
      const bonusConfigObject = troopConfig.bonusConfigObject
      console.log({bonusConfigObject})
      const armyLevels = troopConfig.tiers.filter(x => x.startsWith('G') || x.startsWith('S'))
      // const monsterLevels = troopConfig.selectedLevels.filter(x => x.startsWith('M'))
      const armySquads = calculateStack(armyLevels, bonusConfigObject, troopConfig.leadership)
      // const monsterSquads: Squad[] = []//calculateStack(monsterLevels, bonusesObj, this.dominance, this.attackType, armySquads[0])
      // this.tiersDict = groupBy([...armySquads, ...monsterSquads], x => x.troop.levelId)
      this.troopList.push(...armySquads.sort((a, b) => b.troop.health - a.troop.health))
    }
  }


  radioChange($event: any) {
    if (isNumber($event.value)) { // one of the 3 main options
      const t: SetupType = $event.value
      this.troopConfig.set(DEFAULT_TROOP_CONFIG(t))
    } else { // this is a saved config
      this.troopConfig.set({...$event.value, selectedSetupType: SetupType.CUSTOM})
    }
    this.fg.setValue({leadership: this.troopConfig().leadership, tiers: this.troopConfig().tiers})
    this.validateTierConfig()
    this.validateBonusConfig()
  }


  private verifyBonuses(bonusesObj: BonusesObject) {
    const keys = Object.keys(bonusesObj)
    console.log({keys})
    const army = 'army'
    const validateField = (attributes: string[], disallowedTypes: string[]) => {
      console.log('validating using ', attributes, disallowedTypes)
      const invalid1 = intersection(keys, disallowedTypes).length > 0
      if (invalid1) {
        this.errors$.next(this.ERROR_MSG_01)
        return false
      }
      const missingTypes = attributes.filter(attr => !(attr in bonusesObj))
      if (missingTypes.length > 0) {
        this.errors$.next(this.ERROR_MSG_05 + missingTypes.join(','))
        return false
      }
      const valid3 = attributes.every(attr => isNumber(bonusesObj[attr]?.strength) && isNumber(bonusesObj[attr].health))
      if (!valid3) {
        this.errors$.next(this.ERROR_MSG_02)
        return false
      }
      return true
    }
    if (keys.includes(army)) {
      return validateField(['army'], [guardsman, specialist, flying, melee, mounted, ranged])
    } else if ([guardsman, specialist].some(x => keys.includes(x))) {
      return validateField([guardsman, specialist], [flying, melee, mounted, ranged])
    } else if ([flying, melee, mounted, ranged].some(x => keys.includes(x))) {
      return validateField([flying, melee, mounted, ranged], [])
    } else {
      this.errors$.next(this.ERROR_MSG_03);
      return false;
    }
  }

  removeSavedConfig(savedConfig: TroopConfig) {
    this.backend.deleteTroopConfig(savedConfig).pipe(
      switchMap(() => this.fetch())
    ).subscribe()
  }

  async saveConfigToServer(saveAs = false) {
    const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$)
    const obs$ = () => this.backend.saveTroopConfig(this.troopConfig()).pipe(
      switchMap((res: any) => this.fetch(res.insertId)),
      catchError(err => {
        console.error(err)
        this._snackBar.open('❌ Failed to save config', 'Dismiss');
        throw err
      }),
      tap(() => this._snackBar.open('✅ Config saved successfully', 'Dismiss'))
    )
    if (isAuthenticated) {
      if (!saveAs) obs$().subscribe()
      else {
        const data = {
          title: 'Save as',
          input: {
            type: 'text',
            icon: 'save',
            value: this.troopConfig().name
          },
          action: 'return'
        }
        const dialogRef = this.dialog.open(AppGenericDialog, {data})
        dialogRef.afterClosed().pipe(
          filter(res => !!res),
          switchMap(res => {
            console.log('dialog data', res)
            this.troopConfig().name = res.input.value
            this.troopConfig().id = -4
            return obs$()
          })
        ).subscribe()
      }
    } else {
      this.auth.loginWithPopup().pipe(
        switchMap(() => obs$())
      ).subscribe()
    }
  }

  validateBonusConfig() {
    const troopConfig = this.troopConfig()
    try {
      const bonusConfig = YAML.parse(troopConfig.bonusConfig.toLowerCase())
      if (this.verifyBonuses(bonusConfig)) {
        troopConfig.bonusConfigObject = bonusConfig
        troopConfig.valid.bonus = true
      } else troopConfig.valid.bonus = false
    } catch (e) {
      console.error(e)
      troopConfig.valid.bonus = false
      this.errors$.next(this.ERROR_MSG_04);
    }
    return troopConfig.valid.bonus
  }

  validateTierConfig() {
    const troopConfig = this.troopConfig()
    troopConfig.valid.tier = troopConfig.leadership > 0 && troopConfig.tiers.length > 0;
    this.valuesChange$.next()
    return troopConfig.valid.tier
  }

  resetTo(setupType: SetupType) {
    this.troopConfig().bonusConfig = bonusConfigDefaults.find(x => x.setupType === setupType)?.bonusConfig || this.troopConfig().bonusConfig
  }

  openExample() {
    // @ts-ignore
    window.open(location.origin + '/assets/stacker-values-example.jpg', '_blank').focus();
  }

  leaderhshipChange() {
    this.troopConfig().leadership = this.fg.get('leadership')?.value
    this.validateTierConfig()
  }

  tiersChange() {
    this.troopConfig().tiers = this.fg.get('tiers')?.value
    this.validateTierConfig()
  }


  onStepChange($event: StepperSelectionEvent) {
    if($event.selectedIndex===1){
      console.log('resizing editor')
      // this.ngZone.runOutsideAngular(() => {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 200)
      // });
    }else if($event.selectedIndex===0) {
      console.log(this.troopConfig(), this.setupTypes, this.savedConfigs)
    }
  }
}
