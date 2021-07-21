import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter, NgZone } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { GanttDependenciesData, GanttPeriod, GanttScrollSyncEvent, GanttTask, GanttTaskDependency, GanttTaskRow, PeriodPart, TaskProgressInput, TaskTimelineData } from '../../../interfaces';
import { GanttService } from '../../../services/gantt.service';

@Component({
  selector: 'gantt-timeline',
  templateUrl: './gantt-timeline.component.html',
  styleUrls: ['./gantt-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTimelineComponent implements AfterViewInit, OnDestroy {
  public periodParts: PeriodPart[];

  private selectedPeriod: GanttPeriod = 'Week';

  private tasksRowsList: GanttTaskRow[] = [];
  private tasksList: GanttTask[] = [];

  private scrollSubscription: Subscription;

  public tasksTimelineData: TaskTimelineData[] = [];
  public showDependencies = false;

  @ViewChild('header') header: ElementRef<HTMLElement>;
  @ViewChild('mainTable') mainTable: ElementRef<HTMLElement>;
  @ViewChild('tasksProgressTable') tasksProgressTable: ElementRef<HTMLElement>;

  constructor(public service: GanttService, private ngZone: NgZone) { }

  @Input() public contentHeight = 500;
  @Input() public activeRow: GanttTaskRow | null = null;

  @Input() public set tasksRows(tasksRows: GanttTaskRow[]) {
    this.tasksRowsList = tasksRows;
    this.tasks = tasksRows.map(taskRow => taskRow.task);
  }

  public get tasksRows() {
    return this.tasksRowsList;
  }

  public set tasks(tasks: GanttTask[]) {
    this.tasksList = tasks;
    this.recalculatePeriodParts();
  }

  @Input() public set period(period: GanttPeriod) {
    this.selectedPeriod = period;
    this.recalculatePeriodParts();
  }

  private currentWidth = 0;

  @Input() public set width(width: number) {
    this.currentWidth = width;
  }

  private scrollTopValue = 0;

  @Input() public set scrollTop(scrollValue: number) {
    this.scrollTopValue = scrollValue;
    this.updateScrollPosition();
  }

  private _selectedDate: Date;

  @Input() public set selectedDate(date: Date) {
    this._selectedDate = date;

    if (!this.selectedDate || !this.mainTable) {
      return;
    }

    this.clearScrollSubscription();

    const offset = this.service.computeDateOffset(date, this.selectedPeriod, this.periodParts[0].main) - 75;
    const diff = this.mainTable.nativeElement.scrollLeft - offset;

    const animationTime = 400;
    const intervalTime = 10;
    const takeCount = animationTime / intervalTime;

    let step = Math.abs(diff) / takeCount;

    this.scrollSubscription = interval(intervalTime)
      .pipe(take(takeCount))
      .subscribe(() => {
        this.mainTable.nativeElement.scrollLeft += diff > 0 ? -step : step;
        this.header.nativeElement.scrollLeft = this.mainTable.nativeElement.scrollLeft;
      });
  }

  public get selectedDate() {
    return this._selectedDate;
  }

  @Input() public dependencies: GanttTaskDependency[] = [];
  
  @Output() public onScroll = new EventEmitter<GanttScrollSyncEvent>()
  @Output() public rowChanged = new EventEmitter<GanttTaskRow | null>();

  public ngAfterViewInit(): void {
    this.showDependencies = true;
    this.ngZone.runOutsideAngular(() => this.initScrollCallbacks());
    this.updateScrollPosition();
  }

  public ngOnDestroy(): void {
    this.clearScrollSubscription();
  }

  public get width() {
    return this.currentWidth;
  }

  public get tasks() {
    return this.tasksList;
  }

  public get period() {
    return this.selectedPeriod;
  }

  private recalculatePeriodParts(): void {
    console.log('recalculatePeriodParts');
    this.periodParts = this.service.calculatePeriodParts(this.selectedPeriod, this.tasks);
  }

  private initScrollCallbacks(): void {
    const mainTable = this.mainTable.nativeElement;
    const header = this.header.nativeElement;

    header.onwheel = (event: WheelEvent) => event.preventDefault();

    mainTable.onwheel = (event: WheelEvent) => {
      if (event.shiftKey) {
        header.scrollLeft = this.header.nativeElement.scrollLeft + event.deltaY;
        return;
      }

      const scrollEvent: GanttScrollSyncEvent = {
        scrollValue: this.mainTable.nativeElement.scrollTop + event.deltaY
      };

      this.onScroll.emit(scrollEvent);
    }

    mainTable.onmousedown = (event: MouseEvent) => {
      this.clearScrollSubscription();
      
      this.scrollSubscription = interval(5).subscribe(() => {
        header.scrollLeft = this.mainTable.nativeElement.scrollLeft;

        const scrollEvent: GanttScrollSyncEvent = {
          scrollValue: this.mainTable.nativeElement.scrollTop
        };

        this.onScroll.emit(scrollEvent);
      });
    }

    mainTable.onmouseup = (event: MouseEvent) => this.clearScrollSubscription();
  }

  private updateScrollPosition(): void {
    if (this.mainTable) {
      this.mainTable.nativeElement.scrollTop = this.scrollTopValue;
    }
  }

  public getDependenciesData(): GanttDependenciesData {
    console.log('getDependenciesData:', this.tasksTimelineData);
    
    return {
      tasksInfo: this.tasksTimelineData,
      dependencies: this.dependencies,
      period: this.period
    };
  }

  public getMainTableWidth(): number {
    return this.tasksProgressTable.nativeElement.clientWidth;
  }

  public getMainTableHeight(): number {
    return this.tasksProgressTable.nativeElement.clientHeight;
  }

  public taskParentOpened(taskRow: GanttTaskRow): boolean {
    return this.service.taskParentOpened(taskRow, this.tasksRows);
  }

  public getTaskProgressData(taskRow: GanttTaskRow, wrapper: HTMLElement): TaskProgressInput {
    console.log('getTaskProgressData:', wrapper.parentElement!.offsetTop + wrapper.offsetTop + wrapper.clientHeight);
    return {
      taskInfo: { task: taskRow.task },
      period: this.period,
      minDate: this.periodParts[0].detail[0],
      offsetY: wrapper.parentElement!.offsetTop + wrapper.offsetTop + wrapper.clientHeight * 2.5
    };
  }

  public selectRow(rows: GanttTaskRow | null): void {
    this.activeRow = rows;
    this.rowChanged.emit(this.activeRow);
  }

  private clearScrollSubscription(): void {
    if (this.scrollSubscription && !this.scrollSubscription.closed) {
      this.scrollSubscription.unsubscribe()
    }
  }

  public taskProgressDataChanged(data: TaskTimelineData): void {
    console.log('taskProgressDataChanged:', data);
    
    const idx = this.tasksTimelineData.findIndex(task => data.taskID === task.taskID);

    if (idx !== -1) {
      this.tasksTimelineData.splice(idx, 1);
    }

    this.tasksTimelineData.push(data);
  }
}