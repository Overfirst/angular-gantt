import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { GanttPeriod } from '../../interfaces';

@Component({
  selector: 'gantt-periods',
  templateUrl: './gantt-periods.component.html',
  styleUrls: ['./gantt-periods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttPeriodsComponent {
  private selectedPeriod: GanttPeriod = 'week';
  
  public get period(): GanttPeriod {
    return this.selectedPeriod;
  }

  public set period(period: GanttPeriod) {
    this.selectedPeriod = period;
    this.periodChange.emit(this.selectedPeriod);
  }

  @Output() public periodChange = new EventEmitter<GanttPeriod>();
}
