import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gantt-confirm-modal',
  templateUrl: './gantt-confirm-modal.component.html',
  styleUrls: [
    '../gantt-edit-modal.component.scss',
    './gantt-confirm-modal.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttConfirmModalComponent {
  @Input() public canDelete = true;

  @Output() noClicked = new EventEmitter<MouseEvent>();
  @Output() yesClicked = new EventEmitter<MouseEvent>();
  @Output() okClicked = new EventEmitter<MouseEvent>();

  public noClick(event: MouseEvent): void {
    this.noClicked.emit(event);
  }

  public yesClick(event: MouseEvent): void {
    this.yesClicked.emit(event);
  }

  public okClick(event: MouseEvent): void {
    this.okClicked.emit(event);
  }
}