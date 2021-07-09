import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttPeriod, GanttTask } from '../../../interfaces';
import { GanttService } from '../gantt.service';

@Component({
  selector: 'gantt-timeline',
  templateUrl: './gantt-timeline.component.html',
  styleUrls: ['./gantt-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTimelineComponent {
  public periodParts: any[] = [];
  private selectedPeriod: GanttPeriod;

  constructor(private service: GanttService) {}

  @Input() public tasks: GanttTask[] = [];

  @Input() public set period(period: GanttPeriod) {
    this.selectedPeriod = period;
    this.periodParts = this.service.calculatePeriodParts(this.selectedPeriod);
  }

  public get period() {
    return this.selectedPeriod;
  }
}
