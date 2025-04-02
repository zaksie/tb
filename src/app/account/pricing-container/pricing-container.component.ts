import {AfterViewInit, Component, EventEmitter, inject, OnInit, Output, signal} from '@angular/core';
import {Plan} from "../account.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-pricing-container',
  standalone: false,
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss','../account.component.scss']
})
export class PricingContainerComponent implements OnInit {
  route = inject(ActivatedRoute)
  router = inject(Router)
  isLoading = signal(false);
  plan: Plan = Plan.None;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.plan = params['plan'];
    })
  }
  async onPlanChange(){
    await this.router.navigate(['/account'])
  }
}
