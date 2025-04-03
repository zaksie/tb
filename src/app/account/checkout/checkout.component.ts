import {AfterViewInit, Component, EventEmitter, inject, NgZone, OnInit, Output, signal} from '@angular/core';
import {catchError, startWith, switchMap} from "rxjs/operators";
import {combineLatest, filter, map, Observable, of, take} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatChipListboxChange} from "@angular/material/chips";
import {Currency, Order} from "../currency.model";
import {AuthService} from "@auth0/auth0-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material/icon";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {PaymentService} from "../../services/payment.service";
import {Plan, PlanPricing, pricingUSD} from "../account.model";
import {StringListValidator} from "../../services/string-list-validator.directive";

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss', '../account.component.scss', './checkmark.scss']
})
export class CheckoutComponent implements AfterViewInit, OnInit {
  currencies: Currency[] = []
  paymentData: Order | undefined;
  paymentStatus = 'pending';
  @Output() done = new EventEmitter();
  formGroup = new FormGroup({
    currency: new FormControl(null, Validators.required),
    planOption: new FormControl('1 month', Validators.required),
  })
  planOptions: PlanPricing[] = []
  selectedPlanOption = signal('')
  private _snackBar = inject(MatSnackBar)
  isLoading = signal(false);
  plan: Plan = Plan.None;
  currency: Currency | undefined;
  readonly ngZone = inject(NgZone)

  constructor(private paymentService: PaymentService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {

  }

  filteredOptions!: Observable<Currency[]>;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.plan = params['plan'];
      const planPricing = pricingUSD.find(x => x.name === this.plan)
      if (planPricing) {
        const m3Discount = Math.floor(planPricing.discount / 4)
        const m12Discount = planPricing.discount
        const planOptions = [
          {
            name: '1 month',
            price: planPricing.price,
            discount: 0,
            period_in_days: 31,
          },
          {
            name: '3 month',
            price: Math.floor(planPricing.price * 3 * (1 - m3Discount / 100)),
            discount: m3Discount,
            period_in_days: 31*3,
          },
          {
            name: '12 month',
            price: Math.floor(planPricing.price * 12 * (1 - m12Discount / 100)),
            discount: m12Discount,
            period_in_days: 31*12,
          }
        ]
        this.selectedPlanOption.set(planOptions[0].name)
        this.planOptions.push(...planOptions)
      }
    });
    this.filteredOptions = this.formGroup.get('currency')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    ) as Observable<Currency[]>;

  }

  private _filter(value: string): Currency[] {
    const filterValue = value.toLowerCase();
    return this.currencies.filter(option => option.fullname.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit(): void {
    this.isLoading.set(true)
    // this.ngZone.runOutsideAngular(() => {
      this.auth.isAuthenticated$.pipe(
        filter(x => x),
        take(1),
        switchMap(() => combineLatest([this.paymentService.getCurrencies(), this.paymentService.getPendingOrders()]))
      ).subscribe(async ([currencies, order]) => {
        currencies.forEach(c => {
          if (c.code in this.paymentService.iconCached) return;
          try {
            if (c.logo) {
              this.iconRegistry.addSvgIconLiteral(c.code, this.sanitizer.bypassSecurityTrustHtml(c.logo))
              this.paymentService.iconCached[c.code] = true
            } else
              console.warn(`${c.code} has non-svg image`)
          } catch (e) {
            console.warn(`Failed to load ${c.code}`)
          }
        })
        this.currencies = currencies
        this.formGroup.get('currency')?.addAsyncValidators(StringListValidator.create(this.currencies.map(c => c.fullname)))
        this.paymentData = order
        if (this.paymentData?.payment_id)
          this.pollPaymentStatus(this.paymentData.payment_id);
        this.isLoading.set(false)
      })
    // })
  }


  initiatePayment() {
    const data = this.formGroup.getRawValue()
    const planOption = this.planOptions.find(x => x.name === this.selectedPlanOption())
    console.log('data', data, planOption)
    if (!this.currency || !planOption) return alert('invalid values');
    this.isLoading.set(true)
    const payload = {
      price: planOption.price,
      period_in_days: planOption.period_in_days,
      discount: planOption.discount,
      currency: this.currency.code,
    }
    this.paymentService.createPayment(payload).pipe(
      catchError(error => {
        console.error(error)
        return of({error})
      })
    ).subscribe(
      (response) => {
        this.paymentData = response;
        this.isLoading.set(false)
        if (response.error) return;
        if (this.paymentData)
          this.pollPaymentStatus(this.paymentData.payment_id);
      }
    );
  }

  pollPaymentStatus(paymentId: string) {
      this.paymentService.wssGetPaymentStatus(paymentId).subscribe(
        (data) => {
          console.log({data})
          if (data.error) return;
          this.paymentStatus = data.payment_status;
          // if (status.payment_status === 'finished' || status.payment_status === 'expired') {}
        });
  }

  onPlanOptionChange($event: MatChipListboxChange) {
    this.selectedPlanOption.set($event.value);
  }

  cancelOrder() {
    if (this.paymentData?.payment_id && confirm('Are you sure you want to cancel the current order?'))
      this.paymentService.cancelPayment(this.paymentData.payment_id).subscribe(() => this.paymentData = undefined)
  }

  copy() {
    if (this.paymentData?.pay_address) {
      navigator.clipboard.writeText(this.paymentData.pay_address);
      this._snackBar.open('✅ Copied to clipboard!', 'OK', {duration: 2000})
    }
  }

  onCurrencySelected($event: MatAutocompleteSelectedEvent) {
    console.log('event fired', $event.option.value)
    this.currency = this.currencies.find(c => c.fullname === $event.option.value)
  }
}
