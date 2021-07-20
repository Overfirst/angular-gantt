import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { GanttComponent } from '../shared/components/gantt/gantt.component';
import { GanttTasksComponent } from '../shared/components/gantt/gantt-tasks/gantt-tasks.component';
import { GanttPeriodsComponent } from '../shared/components/gantt/gantt-periods/gantt-periods.component';
import { GanttTimelineComponent } from '../shared/components/gantt/gantt-timeline/gantt-timeline.component';
import { GanttTaskProgressComponent } from '../shared/components/gantt/gantt-task-progress/gantt-task-progress.component';
import { GanttDependenciesComponent } from '../shared/components/gantt/gantt-dependencies/gantt-dependencies.component';

import { RowHeightDirective } from '../shared/directives/row-height.directive';

@NgModule({
  imports: [SharedModule],
  declarations: [
      GanttComponent,
      GanttTasksComponent,
      GanttPeriodsComponent,
      GanttTimelineComponent,
      GanttTaskProgressComponent,
      GanttDependenciesComponent,
      RowHeightDirective
  ],
  exports: [
      GanttComponent,
      GanttTasksComponent,
      GanttPeriodsComponent,
      GanttTimelineComponent,
      GanttTaskProgressComponent,
      GanttDependenciesComponent
  ],
  providers: [DatePipe]
})
export class GanttModule {}
