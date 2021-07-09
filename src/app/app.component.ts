import { Component } from '@angular/core';
import { GanttTask } from './shared/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tasks: GanttTask[] = [
    {
      name: 'Create gantt component',
      startDate: new Date(2021, 6, 8),
      endDate: new Date(2021, 9, 25),
      readyPercent: 3
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 6, 7),
      endDate: new Date(2021, 7, 14),
      readyPercent: 77
    },
    {
      name: 'Survive at work',
      startDate: new Date(2021, 5, 21),
      endDate: new Date(2021, 8, 21),
      readyPercent: 1
    }
  ];
}
