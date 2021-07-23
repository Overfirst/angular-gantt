import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GanttTask, TimePoint } from 'src/app/shared/interfaces';
import { GanttEditService } from 'src/app/shared/services/gantt-edit.service';

@Component({
  selector: 'gantt-edit-modal',
  templateUrl: './gantt-edit-modal.component.html',
  styleUrls: ['./gantt-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttEditModalComponent implements AfterViewInit {
  constructor(private service: GanttEditService, private cdr: ChangeDetectorRef) {}

  @Output() public closeClicked = new EventEmitter<MouseEvent>();
  @Output() public deleteClicked = new EventEmitter<MouseEvent>();
  @Output() public saveClicked = new EventEmitter<GanttTask>();
  @Output() public cancelClicked = new EventEmitter<MouseEvent>();

  public form: FormGroup;
  private editableTask: GanttTask;

  public timePoints: TimePoint[] = this.service.createTimePoints();

  public startTime = '00:00';
  public endTime = '00:00';

  @Input() public set task(task: GanttTask) {
    this.editableTask = task;

    this.form = new FormGroup({
      name: new FormControl(task.name, Validators.required),
      startDate: new FormControl(this.service.convertDateToInput(task.startDate), Validators.required),
      endDate: new FormControl(this.service.convertDateToInput(task.endDate), Validators.required),
      readyPercent: new FormControl(task.readyPercent, [Validators.required, Validators.min(0), Validators.max(100)]),
      startDateTimePoint: new FormControl(this.startTime),
      endDateTimePoint: new FormControl(this.endTime)
    });
  }

  public ngAfterViewInit(): void {
    this.startTime = this.service.getStringTimePointFromDate(this.editableTask.startDate);
    this.endTime = this.service.getStringTimePointFromDate(this.editableTask.endDate);

    this.form.controls.startDateTimePoint.setValue(this.startTime);
    this.form.controls.endDateTimePoint.setValue(this.endTime);

    this.cdr.detectChanges();
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
    this.saveClicked.emit(this.service.getEditedTaskFromFormData(this.form.value, this.editableTask));
  }

  public cancelClick(event: MouseEvent): void {
    this.cancelClicked.emit(event);
  }
}
