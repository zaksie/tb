import {AfterViewInit, Component, Input} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GenericTask} from "../../../models/clan-data.model";

@Component({
  selector: 'app-task-setup',
  standalone: false,
  templateUrl: './task-setup.component.html',
  styleUrl: './task-setup.component.scss'
})
export class TaskSetupComponent implements AfterViewInit {
  readonly SOURCES = ['Arachne', 'Doomsday', 'Armageddon', 'Hellforge', 'Shadow City']
  @Input() tasks: GenericTask[] = [];

  readonly fg = this.fb.group({
    rows: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {
  }

  ngAfterViewInit(): void {
    this.tasks.forEach(t => this.addRow(t))
  }

  createFormGroup(task: GenericTask | undefined = undefined): FormGroup {
    return this.fb.group({
      source: [task?.source || '', Validators.required],
      goal: [task?.goal || undefined, Validators.required]
    })
  }

  get rows() {
    return this.fg.get('rows') as FormArray;
  }

  addRow(task: GenericTask | undefined = undefined) {
    this.rows.push(this.createFormGroup(task));
  }

  // Remove a person by index
  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  // For debugging or submission
}
