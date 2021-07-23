import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { GanttPeriod, GanttScrollSyncEvent, GanttTask, GanttTaskDependency, GanttTaskRow } from '../../interfaces';
import { GanttService } from '../../services/gantt.service';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttComponent implements AfterViewInit {
  @ViewChild('mainRef') public mainRef: ElementRef<HTMLElement>;
  @ViewChild('tasksRef') public tasksRef: ElementRef<HTMLElement>;
  @ViewChild('timelineRef') public timelineRef: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef, private service: GanttService) {}

  private _tasks: GanttTask[];

  @Input() public set tasks(tasks: GanttTask[]) {
    this._tasks = tasks;
    this.tasksRows = this.service.getTasksRows(tasks, this.tasksRows);
    this.visibleRows = this.service.getVisibleRows(this.tasksRows);
  }

  public get tasks() {
    return this._tasks;
  }

  @Input() public dependencies: GanttTaskDependency[] = [];
  @Input() public contentHeight = 500;

  public modalOpened = false;

  public tasksRows: GanttTaskRow[] = [];
  public visibleRows: GanttTaskRow[] = [];

  public selectedDate: Date;

  public tasksScrollTop = 0;
  public timelineScrollTop = 0;

  public period: GanttPeriod;
  public timelineWidth = 0;

  public activeRow: GanttTaskRow | null = null;

  public editableTask: GanttTask;
  public editableTaskParent: GanttTask | null = null;

  public ngAfterViewInit(): void {
    this.calculateWidth();
  }

  public periodChange(period: GanttPeriod): void {
    this.period = period;
  }

  public calculateWidth(): void {
    const mainWidth = this.mainRef.nativeElement.getBoundingClientRect().width;
    const tasksWidth = this.tasksRef.nativeElement.getBoundingClientRect().width;

    this.timelineWidth = mainWidth - tasksWidth;
    this.cdr.detectChanges();
  }

  @HostListener('window:resize') public onResize(): void {
    this.calculateWidth();
  }

  public tasksOnScroll(event: GanttScrollSyncEvent): void {
    this.timelineScrollTop = event.scrollValue;
  }

  public timelineOnScroll(event: GanttScrollSyncEvent): void {
    this.tasksScrollTop = event.scrollValue;
  }

  public changeRow(row: GanttTaskRow | null): void {
    this.activeRow = row;
  }

  public tasksDateClick(date: Date): void {
    this.selectedDate = new Date(date);
  }

  public openCloseClicked(row: GanttTaskRow | null): void {
    this.visibleRows = this.service.getVisibleRows(this.tasksRows);
  }

  public editTaskClicked(task: GanttTask): void {
    this.editableTask = task;
    this.editableTaskParent = this.tasks.find(currentTask => currentTask.ID === task.parentID) || null;
    this.modalOpened = true;
  }

  public modalClicked(event: MouseEvent): void {
    event.stopPropagation();
  }

  public modalCloseClicked(event: MouseEvent): void {
    this.modalOpened = false;
  }

  public modalDeleteClicked(event: MouseEvent): void {

  }

  public modalSaveClicked(editedTask: GanttTask): void {
    console.log(editedTask);

    this.editableTask.name = editedTask.name;
    this.editableTask.readyPercent = editedTask.readyPercent;
    this.editableTask.startDate = editedTask.startDate;
    this.editableTask.endDate = editedTask.endDate;

    this.tasks = [...this.tasks];
    this.modalOpened = false;
  }

  public modalCancelClicked(event: MouseEvent): void {
    this.modalOpened = false;
  }
}