import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttDependenciesData, GanttTask, GanttTaskDependency } from 'src/app/shared/interfaces';

@Component({
  selector: 'gantt-dependencies',
  templateUrl: './gantt-dependencies.component.html',
  styleUrls: ['./gantt-dependencies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttDependenciesComponent {
  @Input() public height = 0;
  
  private _data: GanttDependenciesData;

  @Input() public set data(data: GanttDependenciesData) {
    if (this.data && data.tasksInfo === this.data.tasksInfo && data.dependencies === this.data.dependencies && data.period === this.data.period) {
      return;
    }

    this._data = data;
    console.log('dependencies data set:', data);
    this.computeDependencies();
  }

  public get data() {
    return this._data;
  }

  private computeDependencies(): void {

  }
}