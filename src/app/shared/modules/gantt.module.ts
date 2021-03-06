import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared.module';

import { GanttComponent } from '../components/gantt/gantt.component';
import { GanttTasksComponent } from '../components/gantt/gantt-tasks/gantt-tasks.component';
import { GanttPeriodsComponent } from '../components/gantt/gantt-periods/gantt-periods.component';
import { GanttTimelineComponent } from '../components/gantt/gantt-timeline/gantt-timeline.component';
import { GanttTaskProgressComponent } from '../components/gantt/gantt-task-progress/gantt-task-progress.component';
import { GanttDependenciesComponent } from '../components/gantt/gantt-dependencies/gantt-dependencies.component';
import { GanttTaskModalComponent } from '../components/gantt/gantt-task-modal/gantt-task-modal.component';
import { GanttConfirmModalComponent } from '../components/gantt/gantt-task-modal/gantt-confirm-modal/gantt-confirm-modal.component';

import { RowHeightDirective } from '../directives/row-height.directive';

@NgModule({
  imports: [SharedModule],
  declarations: [
      GanttComponent,
      GanttTasksComponent,
      GanttPeriodsComponent,
      GanttTimelineComponent,
      GanttTaskProgressComponent,
      GanttDependenciesComponent,
      GanttTaskModalComponent,
      GanttConfirmModalComponent,
      RowHeightDirective
  ],
  exports: [
      GanttComponent,
      GanttTasksComponent,
      GanttPeriodsComponent,
      GanttTimelineComponent,
      GanttTaskProgressComponent,
      GanttDependenciesComponent,
      GanttTaskModalComponent,
      GanttConfirmModalComponent
  ],
  providers: [DatePipe]
})
export class GanttModule {}
