import { Component } from '@angular/core';
import { GanttTask, GanttTaskDependency } from './shared/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tasks: GanttTask[] = [
    {
      ID: 1,
      name: 'Create gantt component',
      startDate: new Date(2021, 5, 1, 2, 0),
      endDate: new Date(2021, 5, 25, 12, 0),
      readyPercent: 66,
      color: '#ff6e6e'
    },
    {
      ID: 2,
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 5, 1, 12),
      endDate: new Date(2021, 6, 9, 13),
      readyPercent: 71,
      color: '#5a63cf'
    },
    {
      ID: 3,
      name: 'Survive at work',
      startDate: new Date(2021, 5, 2, 3, 20),
      endDate: new Date(2021, 6, 25),
      readyPercent: 60,
      color: '#39e30f'
    },
    {
      ID: 4,
      name: 'Complete the internship',
      startDate: new Date(2021, 4, 31, 6, 33),
      endDate: new Date(2021, 5, 13, 12, 30),
      readyPercent: 75,
      color: '#8c22f6'
    },
    {
      ID: 6,
      parentID: 1,
      name: 'Create tasks table',
      startDate: new Date(2021, 5, 1, 12, 0),
      endDate: new Date(2021, 5, 6, 4, 35),
      readyPercent: 44,
      color: '#ff1ec7'
    },
    {
      ID: 7,
      parentID: 1,
      name: 'Create timeline table',
      startDate: new Date(2021, 5, 2, 5, 44),
      endDate: new Date(2021, 5, 9, 4, 35),
      readyPercent: 68,
      color: '#2c2628'
    },
    {
      ID: 8,
      parentID: 1,
      name: 'Create dependencies',
      startDate: new Date(2021, 5, 5, 16, 0),
      endDate: new Date(2021, 5, 18, 4, 35),
      readyPercent: 51,
      color: '#5096a2'
    },
    {
      ID: 9,
      parentID: 2,
      name: 'Fix template with start',
      startDate: new Date(2021, 5, 5, 16, 0),
      endDate: new Date(2021, 5, 18, 4, 35),
      readyPercent: 51,
      color: '#c70f5c'
    },
    {
      ID: 10,
      parentID: 7,
      name: 'Add horizontal scroll',
      startDate: new Date(2021, 5, 4, 5, 44),
      endDate: new Date(2021, 5, 8, 4, 35),
      readyPercent: 68,
      color: '#ff7615'
    },
  ];

  public dependencies: GanttTaskDependency[] = [
    { fromID: 1, toID: 4 },
    { fromID: 4, toID: 5 },
    { fromID: 2, toID: 1 },
    { fromID: 3, toID: 2 },
    { fromID: 6, toID: 7 },
    { fromID: 7, toID: 8 },
    { fromID: 9, toID: 3 },
  ];
}