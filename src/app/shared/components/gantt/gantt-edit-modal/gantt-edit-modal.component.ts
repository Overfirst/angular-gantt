import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GanttTask } from 'src/app/shared/interfaces';

@Component({
  selector: 'gantt-edit-modal',
  templateUrl: './gantt-edit-modal.component.html',
  styleUrls: ['./gantt-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttEditModalComponent {
  @Output() public closeClicked = new EventEmitter<MouseEvent>();
  @Output() public deleteClicked = new EventEmitter<MouseEvent>();
  @Output() public saveClicked = new EventEmitter<GanttTask>();
  @Output() public cancelClicked = new EventEmitter<MouseEvent>();

  public form: FormGroup;
  private editableTask: GanttTask;

  @Input() public set task(task: GanttTask) {
    this.editableTask = task;

    this.form = new FormGroup({
      name: new FormControl(task.name, Validators.required),
      startDate: new FormControl(this.convertDateToInput(task.startDate), Validators.required),
      endDate: new FormControl(this.convertDateToInput(task.endDate), Validators.required),
      readyPercent: new FormControl(task.readyPercent, [Validators.required, Validators.min(0), Validators.max(100)])
    });
  }

  public get task() {
    return this.editableTask;
  }

  public closeClick(event: MouseEvent): void {
    this.closeClicked.emit(event);
  }

  public deleteClick(event: MouseEvent): void {
    this.deleteClicked.emit(event);
  }

  public saveClick(event: MouseEvent): void {
    const editedTask = this.form.value;
    const task = {...this.editableTask};

    task.name = editedTask.name;
    task.readyPercent = editedTask.readyPercent;
    task.startDate = new Date(editedTask.startDate);
    task.endDate = new Date(editedTask.endDate);

    this.saveClicked.emit(task);
  }

  public cancelClick(event: MouseEvent): void {
    this.cancelClicked.emit(event);
  }

  private convertDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  }
}
