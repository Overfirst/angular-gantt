import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GanttEditModalData, GanttModalSaveData, GanttTask, GanttTaskWrapper } from 'src/app/shared/interfaces';
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
  @Output() public saveClicked = new EventEmitter<GanttModalSaveData>();
  @Output() public createClicked = new EventEmitter<GanttModalSaveData>();
  @Output() public cancelClicked = new EventEmitter<MouseEvent>();
  @Output() public taskDelete = new EventEmitter<void>();

  public form: FormGroup;
  public confirmOpened = false;
  @Input() public createMode = false;

  public editModalData: GanttEditModalData;
  public createModalData: GanttTask[];

  public selectedParentWrapper: GanttTaskWrapper = { task: null };
  private selectedParentTask: GanttTask | null;

  public set selectedParent(task: GanttTask | null) {
    this.selectedParentTask = task;
    this.selectedParentWrapper.task = task;
  }

  public get selectedParent() {
    return this.selectedParentTask;
  }

  public selectedSuccessor: GanttTask | null;

  @Input() public set editData(data: GanttEditModalData) {
    if (this.createMode) {
      return;
    }

    this.editModalData = data;
    this.selectedParent = data.parentTask;
    this.selectedSuccessor = data.currentSuccessor;

    const endControl = new FormControl(this.service.convertDateToInput(data.task.endDate), [
      Validators.required,
      GanttValidators.dateOutsideParentTask(this.selectedParentWrapper),
      GanttValidators.dateOutsideChildTask(this.editModalData.childs)
    ]);
    
    const startControl = new FormControl(this.service.convertDateToInput(data.task.startDate), [
      Validators.required,
      GanttValidators.startDateLaterValidator(endControl),
      GanttValidators.dateOutsideParentTask(this.selectedParentWrapper),
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
      possibleParents: new FormControl(null),
      successor: new FormControl(null)
    });
  }

  @Input() public set createData(data: GanttTask[]) {
    if (!this.createMode) {
      return;
    }

    this.createModalData = data;
    this.selectedParent = null;
    this.selectedSuccessor = null;

    const endControl = new FormControl(null, [
      Validators.required,
      GanttValidators.dateOutsideParentTask(this.selectedParentWrapper),
    ]);
    
    const startControl = new FormControl(null, [
      Validators.required,
      GanttValidators.startDateLaterValidator(endControl),
      GanttValidators.dateOutsideParentTask(this.selectedParentWrapper),
    ]);

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      startDate: startControl,
      endDate: endControl,
      readyPercent: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),
      possibleParents: new FormControl(null),
      successor: new FormControl(null)
    });
  }

  public get createData() {
    return this.createModalData;
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

  private getTaskFromForm(): GanttTask {
    const data = this.form.value;
    
    const generalData = {
      parentID: this.selectedParent?.ID || null,
      name: data.name,
      readyPercent: data.readyPercent,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };

    if (!this.createMode) {
      return {
        ...this.editData.task,
        ...generalData
      };
    }

    return {
      ID: new Date().getTime(),
      ...generalData
    };
  }

  public saveClick(event: MouseEvent): void {
    this.saveClicked.emit({
      task: this.getTaskFromForm(),
      successor: this.selectedSuccessor
    });
  }

  public createClick(event: MouseEvent): void {
    this.createClicked.emit({
      task: this.getTaskFromForm(),
      successor: this.selectedSuccessor
    });
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

  public parentChanged(): void {
    this.form.controls.startDate.updateValueAndValidity();
    this.form.controls.endDate.updateValueAndValidity();
  }
}
