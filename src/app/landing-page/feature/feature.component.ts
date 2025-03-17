import {Component, Input} from '@angular/core';
import {FeatureModel} from "./feature.model";

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
      height: this.compact ? '40px' : '100px',
      width: this.compact ? '40px' : '100px',
      backgroundImage: 'url(' + this.feature.image + ')'
    }
  }
}
