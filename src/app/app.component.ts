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
      startDate: new Date(),
      endDate: new Date(),
      readyPercent: 3
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(),
      endDate: new Date(),
      readyPercent: 77
    },
    {
      name: 'Survive at work',
      startDate: new Date(),
      endDate: new Date(),
      readyPercent: 1
    }
  ];
}
