import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GanttService } from 'src/app/shared/services/gantt.service';
import { GanttScrollSyncEvent, GanttTask, GanttTaskRow } from '../../../interfaces';

@Component({
  selector: 'gantt-tasks',
  templateUrl: './gantt-tasks.component.html',
  styleUrls: ['./gantt-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTasksComponent implements AfterViewInit {
  constructor(private service: GanttService) {}

  @ViewChild('table') private table: ElementRef<any>;

  @Input() public tasksRows: GanttTaskRow[] = [];
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
  @Output() public openCloseClicked = new EventEmitter<GanttTaskRow | null>();

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
    this.activeRow = this.service.searchRow(needRow, this.tasksRows);
    this.rowChanged.emit(this.activeRow);
  }

  private rowHasChilds(row: GanttTaskRow): boolean {
    return !!row.childs && row.childs.length > 0;
  }

  public rowOpenCloseClicked(event: MouseEvent, row: GanttTaskRow): void {
    event.stopImmediatePropagation();
    
    if (this.rowHasChilds(row)) {
      row.opened = !row.opened
    }

    this.openCloseClicked.emit(row);
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