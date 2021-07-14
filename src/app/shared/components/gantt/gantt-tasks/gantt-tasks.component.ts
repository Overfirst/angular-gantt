import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { GanttScrollEvent, GanttTask } from '../../../interfaces';

@Component({
  selector: 'gantt-tasks',
  templateUrl: './gantt-tasks.component.html',
  styleUrls: ['./gantt-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTasksComponent implements AfterViewInit {
  @ViewChild('table') private table: ElementRef<any>;

  @Input() public tasks: GanttTask[] = [];
  @Input() public contentHeight = 500;

  private scrollTopValue = 0;

  @Input() public set scrollTop(scrollValue: number) {
    console.log('set scrollTop');
    
    this.scrollTopValue = scrollValue;
    this.updateScrollPosition();
  }

  public ngAfterViewInit(): void {
    this.initScrollCallbacks();
    this.updateScrollPosition();
  }

  @Output() public onScroll = new EventEmitter<GanttScrollEvent>();

  private updateScrollPosition(): void {
    console.log('updateScrollPosition', this.table);
    
    if (!this.table) {
      return;
    }

    this.table.nativeElement.scrollTop = this.scrollTopValue;
  }

  private initScrollCallbacks(): void {
    const table = this.table.nativeElement;

    table.onwheel = (event: WheelEvent) => {
      this.onScroll.emit({ scrollLeft: 0, scrollTop: table.scrollTop + event.deltaY });
    }
  }
}
