import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { GanttScrollSyncEvent, GanttTask, GanttTaskRow } from '../../../interfaces';

@Component({
  selector: 'gantt-tasks',
  templateUrl: './gantt-tasks.component.html',
  styleUrls: ['./gantt-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTasksComponent implements AfterViewInit {
  @ViewChild('table') private table: ElementRef<any>;

  @Input() public tasks: GanttTaskRow[] = [];
  @Input() public contentHeight = 500;
  @Input() public activeRow: GanttTaskRow | null = null;

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
  @Output() public rowChanged = new EventEmitter<GanttTaskRow | null>();
  @Output() public dateClicked = new EventEmitter<Date>();

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

  public selectRow(needRow: GanttTaskRow | null): void {
    const searchRow = (rows: GanttTaskRow[]): GanttTaskRow | null => {
      let result: GanttTaskRow | null = null;

      for (let i = 0; i < this.tasks.length; i++) {
        const row = rows[i];

        if (row === needRow) {
          result = row;
          break;
        }

        if (row?.childs) {
          result = searchRow(row.childs);
          if (result === needRow) {
            break;
          }
        }
      }
      
      return result;
    }

    this.activeRow = searchRow(this.tasks);
    this.rowChanged.emit(this.activeRow);
  }

  private rowHasChilds(row: GanttTaskRow): boolean {
    return !!row.childs && row.childs.length > 0;
  }

  public rowOpenCloseClicked(row: GanttTaskRow): void {
    if (this.rowHasChilds(row)) {
      row.opened = !row.opened
    }
  }

  public getRowOpenSymbol(row: GanttTaskRow): string {
    if (!this.rowHasChilds(row)) {
      return ' '
    }

    return row.opened ? '▾' : '▸';
  }

  public dateClick(date: Date): void {
    this.dateClicked.emit(date);
  }
}