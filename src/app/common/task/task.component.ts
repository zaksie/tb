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
  readonly MIN = 0.7
  readonly MAX = 1
  get isOpenGoal(): boolean {
    return this.task.goal <= 0
  }

  fitTitle(title: string) {
    const res = Math.max(this.MIN, Math.min(this.MAX, 1 - (title.length - 10) * 0.111))
    return res + 'rem'
  }
}
