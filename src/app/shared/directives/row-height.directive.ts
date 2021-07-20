import { Directive, ElementRef } from '@angular/core';
import { GanttService } from '../services/gantt.service';

@Directive({
  selector: '[rowHeight]'
})
export class RowHeightDirective {
  constructor(private elementRef: ElementRef, private service: GanttService) {
    this.elementRef.nativeElement.style.height = service.rowHeight + 'px';
  }
}