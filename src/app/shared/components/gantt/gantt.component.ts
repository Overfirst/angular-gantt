import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { GanttEditModalData, GanttModalSaveData, GanttPeriod, GanttScrollSyncEvent, GanttTask, GanttTaskDependency, GanttTaskRow } from '../../interfaces';
import { GanttService } from '../../services/gantt.service';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttComponent implements AfterViewInit {
  public modalOpened = false;
  public createMode = false;

  public tasksRows: GanttTaskRow[] = [];
  public visibleRows: GanttTaskRow[] = [];

  public selectedDate: Date;

  public tasksScrollTop = 0;
  public timelineScrollTop = 0;

  public period: GanttPeriod;
  public timelineWidth = 0;

  public activeRow: GanttTaskRow | null = null;

  public editModalData: GanttEditModalData;

  @ViewChild('mainRef') public mainRef: ElementRef<HTMLElement>;
  @ViewChild('tasksRef') public tasksRef: ElementRef<HTMLElement>;
  @ViewChild('timelineRef') public timelineRef: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef, private service: GanttService) {}

  private _contentHeight = 500;
  private _tasks: GanttTask[];

  @Input() public set tasks(tasks: GanttTask[]) {
    this._tasks = tasks;
    this.tasksRows = this.service.getTasksRows(tasks, this.tasksRows);
    this.visibleRows = this.service.getVisibleRows(this.tasksRows);
  }

  @Input() public dependencies: GanttTaskDependency[] = [];
  
  @Input() public set contentHeight(height: number) {
    this._contentHeight = height < 500 ? 500 : height
  };

  public get contentHeight() {
    return this._contentHeight;
  }

  public get tasks() {
    return this._tasks;
  }

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

  public createTaskClicked(event: MouseEvent): void {
    this.createMode = true;
    this.modalOpened = true;    
  }

  public editTaskClicked(task: GanttTask): void {
    const childs: GanttTask[] = [];

    this.tasks.forEach(currentTask => {
      if (currentTask.parentID === task.ID) {
        childs.push(currentTask);
      }
    });

    const needDependency = this.dependencies.find(dependency => dependency.fromID === task.ID) || null;

    this.editModalData = {
      task,
      parentTask: this.tasks.find(currentTask => currentTask.ID === task.parentID) || null,
      childs,
      possibleParents: this.service.getTaskPossibleParents(task, this.tasks),
      possibleSuccessors: this.tasks.filter(currentTask => currentTask.ID !== task.ID),
      currentSuccessor: needDependency ? this.tasks.find(task => task.ID === needDependency.toID)! : null
    };

    this.createMode = false;
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

  public modalSaveClicked(data: GanttModalSaveData): void {
    const { task } = this.editModalData;

    task.parentID = data.task.parentID;
    task.name = data.task.name;
    task.readyPercent = data.task.readyPercent;
    task.startDate = data.task.startDate;
    task.endDate = data.task.endDate;
    task.color = data.task.color;

    this.tasks = [...this.tasks];
    
    this.dependencies = this.dependencies.filter(dependency => dependency.fromID !== data.task.ID);

    if (data.successor) {
      this.dependencies.push({ fromID: task.ID, toID: data.successor.ID })
    }

    this.modalOpened = false;
  }

  public modalCreateClicked(data: GanttModalSaveData): void {
    this.dependencies = this.dependencies.filter(dependency => dependency.fromID !== data.task.ID);

    if (data.successor) {
      this.dependencies.push({ fromID: data.task.ID, toID: data.successor.ID })
    }

    this.tasks = [...this.tasks, data.task];
    this.modalOpened = false;
  }

  public modalCancelClicked(event: MouseEvent): void {
    this.modalOpened = false;
  }

  public modalDeleteTask(): void {
    this.modalOpened = false;

    const removeData = this.service.removeTask(this.editModalData.task, this.tasks, this.dependencies);
    
    this.dependencies = removeData.newDependencies;
    this.tasks = removeData.newTasks;
  }
}