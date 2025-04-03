import {Component, inject, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-pricing-container',
  standalone: false,
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss','../account.component.scss']
})
export class PricingContainerComponent implements OnInit {
  router = inject(Router)
  isLoading = signal(false);
  ngOnInit(): void {

  }
  async onPlanChange(){
    await this.router.navigate(['/account'])
  }
}
