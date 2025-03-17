import {Component, signal} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent {
  profileForm = new FormGroup({
    clanName: new FormControl(''),
    kingdom: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  });
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {

  }
}
