import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttTask } from '../interfaces';
import { GanttService } from './gantt.service';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttComponent {
  constructor(private service: GanttService) {}
  
  @Input() public tasks: GanttTask[] = [];
}
