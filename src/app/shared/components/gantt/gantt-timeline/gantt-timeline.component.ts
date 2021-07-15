import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { GanttPeriod, GanttScrollSyncEvent, GanttTask, PeriodPart } from '../../../interfaces';
import { GanttService } from '../gantt.service';

@Component({
  selector: 'gantt-timeline',
  templateUrl: './gantt-timeline.component.html',
  styleUrls: ['./gantt-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTimelineComponent implements AfterViewInit, OnDestroy {
  public periodParts: PeriodPart[];

  private selectedPeriod: GanttPeriod = 'Week';
  private tasksList: GanttTask[] = [];
  private scrollSubscription: Subscription;

  @ViewChild('header') header: ElementRef<HTMLElement>;
  @ViewChild('mainTable') mainTable: ElementRef<HTMLElement>;

  constructor(public service: GanttService) {}

  @Input() public contentHeight = 500;
  @Input() public activeRowID = -1;

  @Input() public set tasks(tasks: GanttTask[]) {
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

    console.log('select date', this.selectedDate);
  }

  public get selectedDate() {
    return this._selectedDate;
  }

  @Output() public onScroll = new EventEmitter<GanttScrollSyncEvent>()
  @Output() public rowChanged = new EventEmitter<number>();

  public ngAfterViewInit(): void {
    this.initScrollCallbacks();
    this.updateScrollPosition();
  }

  public ngOnDestroy(): void {
    if (!this.scrollSubscription?.closed) {
      this.scrollSubscription.unsubscribe()
    }
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
    this.periodParts = this.service.calculatePeriodParts(this.selectedPeriod, this.tasks);
  }

  private initScrollCallbacks(): void {
    const mainTable = this.mainTable.nativeElement;

    mainTable.onwheel = (event: WheelEvent) => {
      if (event.shiftKey) {
        this.header.nativeElement.scrollLeft = this.header.nativeElement.scrollLeft + event.deltaY;
        return;
      }

      const scrollEvent: GanttScrollSyncEvent = {
        scrollValue: this.mainTable.nativeElement.scrollTop + event.deltaY
      };
  
      this.onScroll.emit(scrollEvent);
    }

    mainTable.onmousedown = (event: MouseEvent) => {
      this.scrollSubscription = interval(5).subscribe(() => {
        this.header.nativeElement.scrollLeft = this.mainTable.nativeElement.scrollLeft;
        
        const scrollEvent: GanttScrollSyncEvent = {
          scrollValue: this.mainTable.nativeElement.scrollTop
        };
    
        this.onScroll.emit(scrollEvent);
      });
    }

    mainTable.onmouseup = (event: MouseEvent) => {
      if (!this.scrollSubscription?.closed) {
        this.scrollSubscription.unsubscribe()
      }
    }
  }

  private updateScrollPosition(): void {
    if (this.mainTable) {
      this.mainTable.nativeElement.scrollTop = this.scrollTopValue;
    }
  }

  public selectRow(rowID: number): void {
    this.activeRowID = this.activeRowID !== rowID ? rowID: -1;
    this.rowChanged.emit(this.activeRowID);
  }
}