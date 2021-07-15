import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { GanttScrollSyncEvent, GanttTask } from '../../../interfaces';

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
  @Input() public activeRowID = -1;

  private scrollTopValue = 0;

  @Input() public set scrollTop(scrollValue: number) {
    this.scrollTopValue = scrollValue;
    this.updateScrollPosition();
  }

  public ngAfterViewInit(): void {
    this.initScrollCallbacks();
    this.updateScrollPosition();
  }

  @Output() public onScroll = new EventEmitter<GanttScrollSyncEvent>();
  @Output() public rowChanged = new EventEmitter<number>();

  private updateScrollPosition(): void {
    if (this.table) {
      this.table.nativeElement.scrollTop = this.scrollTopValue;
    }
  }

  private initScrollCallbacks(): void {
    const table = this.table.nativeElement;

    table.onwheel = (event: WheelEvent) => {
      if (!event.shiftKey) {
        this.onScroll.emit({ scrollValue: table.scrollTop + event.deltaY });
      }
    }
  }

  public selectRow(rowID: number): void {
    this.activeRowID = this.activeRowID !== rowID ? rowID: -1;
    this.rowChanged.emit(this.activeRowID);
  }
}