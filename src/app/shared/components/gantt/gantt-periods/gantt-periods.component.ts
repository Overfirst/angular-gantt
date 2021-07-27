import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { GanttPeriod } from '../../../interfaces';

@Component({
  selector: 'gantt-periods',
  templateUrl: './gantt-periods.component.html',
  styleUrls: ['./gantt-periods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttPeriodsComponent implements OnInit {
  private selectedPeriod: GanttPeriod;
  public readonly periods: GanttPeriod[] = ['Day', 'Week', 'Month'];

  public get period(): GanttPeriod {
    return this.selectedPeriod;
  }

  public set period(period: GanttPeriod) {
    this.selectedPeriod = period;
    this.periodChange.emit(this.selectedPeriod);
  }

  @Input() public disabled = false;
  @Output() public periodChange = new EventEmitter<GanttPeriod>();

  public ngOnInit(): void {
    this.period = 'Week';
  }
}