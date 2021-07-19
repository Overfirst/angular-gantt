import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttDependenciesData, GanttLine, GanttTask, GanttTaskDependency } from 'src/app/shared/interfaces';
import { GanttService } from '../gantt.service';

@Component({
  selector: 'gantt-dependencies',
  templateUrl: './gantt-dependencies.component.html',
  styleUrls: ['./gantt-dependencies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttDependenciesComponent {
  constructor(private service: GanttService) {}

  @Input() public width = 0;
  @Input() public height = 0;

  public lines: GanttLine[] = [];

  @Input() public set data(data: GanttDependenciesData) {
    if (this.data && data.tasksInfo === this.data.tasksInfo && data.dependencies === this.data.dependencies && data.period === this.data.period) {
      return;
    }
    
    console.log('dependencies data set:', data);
    this.lines = this.service.computeDependencies(this.data);
  }
}