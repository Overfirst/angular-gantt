import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { GanttPeriod, GanttTask, PeriodPart } from '../../../interfaces';
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

  @ViewChild('header') header: ElementRef<any>;
  @ViewChild('mainTable') mainTable: ElementRef<any>;

  constructor(public service: GanttService) { }

  @Input() public contentHeight = 500;

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

  public ngAfterViewInit(): void {
    this.initScrollCallbacks();
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
      }
    }

    mainTable.onmousedown = (event: MouseEvent) => {
      this.scrollSubscription = interval(10).subscribe(() =>
        this.header.nativeElement.scrollLeft = this.mainTable.nativeElement.scrollLeft
      );
    }

    mainTable.onmouseup = (event: MouseEvent) => {
      if (!this.scrollSubscription?.closed) {
        this.scrollSubscription.unsubscribe()
      }
    }
  }
}