import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttPeriod, GanttTask, PeriodPart } from '../../../interfaces';
import { GanttService } from '../gantt.service';

@Component({
  selector: 'gantt-timeline',
  templateUrl: './gantt-timeline.component.html',
  styleUrls: ['./gantt-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTimelineComponent {
  public periodParts: PeriodPart[];
  private selectedPeriod: GanttPeriod = 'Week';
  private tasksList: GanttTask[] = [];

  constructor(public service: GanttService) {}

  @Input() public set tasks(tasks: GanttTask[]) {
    this.tasksList = tasks;
    this.recalculatePeriodParts();
  }

  @Input() public set period(period: GanttPeriod) {
    this.selectedPeriod = period;
    this.recalculatePeriodParts();
  }

  public get tasks() {
    return this.tasksList;
  }

  public get period() {
    return this.selectedPeriod;
  }

  private recalculatePeriodParts(): void {
    this.periodParts = this.service.calculatePeriodParts(this.selectedPeriod, this.tasks);
  }
}