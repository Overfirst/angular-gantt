import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { GanttPeriod, GanttScrollSyncEvent, GanttTask } from '../../interfaces';

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

  constructor(private cdr: ChangeDetectorRef) {}

  @Input() public tasks: GanttTask[] = [];
  @Input() public contentHeight = 500;

  public selectedDate: Date;

  public tasksScrollTop = 0;
  public timelineScrollTop = 0;

  public period: GanttPeriod;
  public timelineWidth = 0;

  public activeRowID = -1;

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

  public changeRow(rowID: number): void {
    this.activeRowID = rowID;
  }

  public tasksDateClick(date: Date): void {
    this.selectedDate = new Date(date);
  }
}