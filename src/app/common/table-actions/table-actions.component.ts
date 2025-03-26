import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {ActionableRow, ServiceInterface, ServiceName} from "../../services/service-interface";

@Component({
  selector: 'app-table-actions',
  standalone: false,
  templateUrl: './table-actions.component.html',
  styleUrl: './table-actions.component.scss'
})
export class TableActionsComponent {
  protected readonly ServiceInterface = ServiceInterface;
  @Input() serviceName!: ServiceName
  @Input() row!: ActionableRow;
  @Output() change = new EventEmitter<void>();
  @Output() edit = new EventEmitter<ActionableRow>();

  constructor(private backend: BackendService) {
  }
  info(mouseEvent: MouseEvent) {
    mouseEvent.stopImmediatePropagation()
  }

  start(mouseEvent: MouseEvent, row: ActionableRow) {
    mouseEvent.stopImmediatePropagation()
    row.status = {...row.status, isDirty: true}
    this.backend.startService(this.serviceName, row.username)
      .subscribe(() => this.change.emit())
  }

  stop(mouseEvent: MouseEvent, row: ActionableRow) {
    mouseEvent.stopImmediatePropagation()
    row.status = {...row.status, isDirty: true}
    this.backend.stopService(this.serviceName, row.username)
      .subscribe(() => this.change.emit())
  }

  delete(mouseEvent: MouseEvent, row: ActionableRow) {
    mouseEvent.stopImmediatePropagation()
    if (confirm("Are you sure to delete " + row.username)) {
      row.status = {...row.status, isDirty: true}
      this.backend.deleteService(this.serviceName, row.username)
        .subscribe(() => this.change.emit())
    }
  }


  onEdit(mouseEvent: MouseEvent, row: ActionableRow) {
    console.log(row)
    mouseEvent.stopImmediatePropagation()
    this.edit.emit(row)
  }
}
