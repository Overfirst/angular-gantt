import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GanttEditModalData, GanttTask } from 'src/app/shared/interfaces';
import { GanttService } from 'src/app/shared/services/gantt.service';
import { GanttValidators } from 'src/app/shared/utils/gantt-validators';

@Component({
  selector: 'gantt-task-modal',
  templateUrl: './gantt-task-modal.component.html',
  styleUrls: [
    './gantt-task-modal.component.scss',
    '../gantt.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTaskModalComponent {
  constructor(private service: GanttService) {}

  @Output() public closeClicked = new EventEmitter<MouseEvent>();
  @Output() public deleteClicked = new EventEmitter<MouseEvent>();
  @Output() public saveClicked = new EventEmitter<GanttTask>();
  @Output() public cancelClicked = new EventEmitter<MouseEvent>();
  @Output() public taskDelete = new EventEmitter<void>();

  public form: FormGroup;
  public confirmOpened = false;

  public editModalData: GanttEditModalData;
  public selectedParent: GanttTask | null;

  @Input() public set editData(data: GanttEditModalData) {
    this.editModalData = data;
    this.selectedParent = this.editModalData.parentTask;

    const endControl = new FormControl(this.service.convertDateToInput(data.task.endDate), [
      Validators.required,
      GanttValidators.dateOutsideParentTask(this.editModalData.parentTask),
      GanttValidators.dateOutsideChildTask(this.editModalData.childs)
    ]);
    
    const startControl = new FormControl(this.service.convertDateToInput(data.task.startDate), [
      Validators.required,
      GanttValidators.startDateLaterValidator(endControl),
      GanttValidators.dateOutsideParentTask(this.editModalData.parentTask),
      GanttValidators.dateOutsideChildTask(this.editModalData.childs)
    ]);

    this.form = new FormGroup({
      name: new FormControl(data.task.name, Validators.required),
      startDate: startControl,
      endDate: endControl,
      readyPercent: new FormControl(data.task.readyPercent, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),
      possibleParents: new FormControl(null)
    });
  }

  public get editData() {
    return this.editModalData;
  }

  public closeClick(event: MouseEvent): void {
    this.closeClicked.emit(event);
  }

  public deleteClick(event: MouseEvent): void {
    this.confirmOpened = true;
    this.deleteClicked.emit(event);
  }

  public saveClick(event: MouseEvent): void {
    const data = this.form.value;
    const task = {...this.editData.task};

    task.parentID = this.selectedParent?.ID || null;
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

  public confirmModalNoClick(event: MouseEvent): void {
    this.confirmOpened = false;
  }

  public confirmModalYesClick(event: MouseEvent): void {
    this.confirmOpened = false;
    this.taskDelete.emit();
  }

  public confirmModalOkClick(event: MouseEvent): void {
    this.confirmOpened = false;
  }
}
