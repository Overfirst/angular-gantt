import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { GanttPeriod, GanttScrollEvent, GanttTask } from '../../interfaces';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttComponent implements AfterViewInit {
  @ViewChild('mainRef') public mainRef: ElementRef<any>;
  @ViewChild('tasksRef') public tasksRef: ElementRef<any>;
  @ViewChild('timelineRef') public timelineRef: ElementRef<any>;

  constructor(private cdr: ChangeDetectorRef) {}

  @Input() public tasks: GanttTask[] = [];
  @Input() public contentHeight = 500;

  public tasksScrollTop = 0;
  public timelineScrollTop = 0;

  public period: GanttPeriod;
  public timelineWidth = 0;

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

  public tasksOnScroll(event: GanttScrollEvent): void {
    this.timelineScrollTop = event.scrollTop;
  }

  public timelineOnScroll(event: GanttScrollEvent): void {
    this.tasksScrollTop = event.scrollTop;
  }
}