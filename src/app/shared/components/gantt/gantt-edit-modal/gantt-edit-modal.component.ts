import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gantt-edit-modal',
  templateUrl: './gantt-edit-modal.component.html',
  styleUrls: ['./gantt-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttEditModalComponent {
  @Output() public closeClicked = new EventEmitter<MouseEvent>();
  @Output() public deleteClicked = new EventEmitter<MouseEvent>();
  @Output() public saveClicked = new EventEmitter<MouseEvent>();
  @Output() public cancelClicked = new EventEmitter<MouseEvent>();

  public closeClick(event: MouseEvent): void {
    this.closeClicked.emit(event);
  }

  public deleteClick(event: MouseEvent): void {
    this.deleteClicked.emit(event);
  }

  public saveClick(event: MouseEvent): void {
    this.saveClicked.emit(event);
  }

  public cancelClick(event: MouseEvent): void {
    this.cancelClicked.emit(event);
  }
}
