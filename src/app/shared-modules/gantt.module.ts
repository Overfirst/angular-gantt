import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { GanttComponent } from '../shared/components/gantt/gantt.component';
import { GanttTasksComponent } from '../shared/components/gantt/gantt-tasks/gantt-tasks.component';
import { GanttPeriodsComponent } from '../shared/components/gantt/gantt-periods/gantt-periods.component';
import { GanttTimelineComponent } from '../shared/components/gantt/gantt-timeline/gantt-timeline.component';

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
