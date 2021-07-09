import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GanttComponent } from '../shared/gantt/gantt.component';
import { GanttTasksComponent } from '../shared/gantt/gantt-tasks/gantt-tasks.component';
import { GanttPeriodsComponent } from '../shared/gantt/gantt-periods/gantt-periods.component';
import { GanttTimelineComponent } from '../shared/gantt/gantt-timeline/gantt-timeline.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
      GanttComponent,
      GanttTasksComponent,
      GanttPeriodsComponent,
      GanttTimelineComponent
    ],
  exports: [
      GanttComponent,
      GanttTasksComponent,
      GanttPeriodsComponent,
      GanttTimelineComponent
    ]
})
export class GanttModule {}
