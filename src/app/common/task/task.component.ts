import {Component, Input} from '@angular/core';
import {GenericTask} from "../../models/clan-data.model";

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: GenericTask
}
