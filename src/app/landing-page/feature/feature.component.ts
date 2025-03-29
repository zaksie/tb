import {Component, Input} from '@angular/core';
import {FeatureModel} from "./feature.model";

declare var window: any;

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss',
  standalone: false
})
export class FeatureComponent {
  @Input() feature!: FeatureModel;
  @Input() compact = false

  get featureStyle() {
    return {
      width: '100%',
      background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.85)), url(' + this.feature.image + ')',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    }
  }

  scrollToTop() {
    if (window)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }
}
