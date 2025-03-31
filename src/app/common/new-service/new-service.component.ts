import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChestCounter} from "../../models/clan-data.model";
import {BackendService} from "../../services/backend.service";
import {PlatformService} from "../../services/platform.service";
import {TaskSetupComponent} from "../../chest-counter/manage-chest-counter/task-setup/task-setup.component";
import {catchError} from "rxjs/operators";
import {of, tap} from "rxjs";
import {ChestCounterForm} from "./chest-counter.struct";
import {ServiceName} from "../../services/service-interface";
import {CryptsForm} from "./crypts.struct";
import {CryptConfig} from "../../crypts/crypts.model";

type DialogData = (ChestCounter | CryptConfig) & { serviceName: string }

@Component({
  selector: 'app-new-service',
  standalone: false,
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.scss',
  // host: {ngSkipHydration: 'true'},
})
export class NewServiceComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<NewServiceComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  hide = signal(true);
  readonly backend = inject(BackendService)
  readonly platform = inject(PlatformService)
  @ViewChild(TaskSetupComponent) taskSetup!: TaskSetupComponent;
  cc: ChestCounterForm = new ChestCounterForm(this.data as ChestCounter, this.backend)
  crypts: CryptsForm = new CryptsForm(this.data as CryptConfig, this.backend)

  get serviceName() {
    return this.data.serviceName
  }

  get service() {
    switch (this.serviceName) {
      case 'chest-counter':
        return this.cc
      case 'crypts':
        return this.crypts
      default:
        throw new Error(`Unknown service ${this.serviceName}`)
    }
  }

  isLoading: boolean = false
  errorMsg: string|undefined
  CHEST_COUNTER: ServiceName = 'chest-counter';
  CRYPTS: ServiceName = 'crypts';

  ngOnInit(): void {
    this.service.onInit()
  }


  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    this.isLoading = true
    this.errorMsg = undefined
    this.service.submit({taskSetup: this.taskSetup}).pipe(
      tap((res: any) => this.errorMsg = res.error),
      catchError(e => {
        console.error(e)
        this.isLoading = false
        this.errorMsg = e.toString()
        return of(false)
      })
    )
      .subscribe(res => {
        if (res)
          this.dialogRef.close(res)
      })
  }

  protected readonly ChestCounterForm = ChestCounterForm;
  get title(): string{
    if (this.serviceName == "chest-counter") {
      return "Chest Counter Setup"
    } else if (this.serviceName == "crypts") {
      return "Auto-Crypt Setup"
    }else {
      return "Setup"
    }
  }

  get step3(): string {
    if (this.serviceName == "chest-counter") {
      return "Points"
    } else {
      return 'Done'
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then()
  }
}
