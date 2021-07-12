import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit } from '@angular/core';
import { GanttPeriod } from '../../../interfaces';

@Component({
  selector: 'gantt-periods',
  templateUrl: './gantt-periods.component.html',
  styleUrls: ['./gantt-periods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttPeriodsComponent implements OnInit {
  public readonly periods: GanttPeriod[] = ['Day', 'Week', 'Month'];
  private selectedPeriod: GanttPeriod;

  public get period(): GanttPeriod {
    return this.selectedPeriod;
  }

  public set period(period: GanttPeriod) {
    this.selectedPeriod = period;
    this.periodChange.emit(this.selectedPeriod);
  }

  @Output() public periodChange = new EventEmitter<GanttPeriod>();

  public ngOnInit(): void {
    this.period = 'Day';
  }
}