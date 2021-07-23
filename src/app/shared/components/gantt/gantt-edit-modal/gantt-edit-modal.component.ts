import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GanttEditModalData, GanttTask } from 'src/app/shared/interfaces';
import { GanttService } from 'src/app/shared/services/gantt.service';
import { GanttValidators } from 'src/app/shared/utils/gantt-validators';

@Component({
  selector: 'gantt-edit-modal',
  templateUrl: './gantt-edit-modal.component.html',
  styleUrls: ['./gantt-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttEditModalComponent {
  constructor(private service: GanttService, private cdr: ChangeDetectorRef) {}

  @Output() public closeClicked = new EventEmitter<MouseEvent>();
  @Output() public deleteClicked = new EventEmitter<MouseEvent>();
  @Output() public saveClicked = new EventEmitter<GanttTask>();
  @Output() public cancelClicked = new EventEmitter<MouseEvent>();

  public form: FormGroup;
  
  private editableTask: GanttTask;

  @Input() public set data(data: GanttEditModalData) {
    this.parentTask = data.parentTask;
    this.task = data.task;
  }

  private set task(task: GanttTask) {
    this.editableTask = task;

    const endControl = new FormControl(this.service.convertDateToInput(this.editableTask.endDate), GanttValidators.dateOutsideParentTask(this.parentTask));
    
    const startControl = new FormControl(this.service.convertDateToInput(this.editableTask.startDate), [
      GanttValidators.startDateLaterValidator(endControl),
      GanttValidators.dateOutsideParentTask(this.parentTask)
    ]);

    this.form = new FormGroup({
      name: new FormControl(task.name, Validators.required),
      startDate: startControl,
      endDate: endControl,
      readyPercent: new FormControl(task.readyPercent, [Validators.required, Validators.min(0), Validators.max(100)]),
    });
  }

  private parentTask: GanttTask | null = null;

  private get task() {
    return this.editableTask;
  }

  public closeClick(event: MouseEvent): void {
    this.closeClicked.emit(event);
  }

  public deleteClick(event: MouseEvent): void {
    this.deleteClicked.emit(event);
  }

  public saveClick(event: MouseEvent): void {
    const data = this.form.value;
    const task = {...this.editableTask};

    task.name = data.name;
    task.readyPercent = data.readyPercent;

    task.startDate = new Date(data.startDate);
    task.endDate = new Date(data.endDate);

    this.saveClicked.emit(task);
  }

  public cancelClick(event: MouseEvent): void {
    this.cancelClicked.emit(event);
  }

  public checkStartDateValidation(): void {
    this.form.controls.startDate.updateValueAndValidity();
  }
}
