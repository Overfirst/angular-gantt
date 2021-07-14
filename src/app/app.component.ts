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
      startDate: new Date(2021, 5, 1, 2, 0),
      endDate: new Date(2021, 5, 25, 12, 0),
      readyPercent: 66,
      color: '#ff6e6e'
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 5, 1, 12),
      endDate: new Date(2021, 5, 9, 13),
      readyPercent: 71,
      color: '#5a63cf'
    },
    {
      name: 'Survive at work',
      startDate: new Date(2021, 5, 2, 3, 20),
      endDate: new Date(2021, 6, 25),
      readyPercent: 60,
      color: '#39e30f'
    },
    {
      name: 'Complete the internship',
      startDate: new Date(2021, 4, 31, 6, 33),
      endDate: new Date(2021, 5, 13, 12, 30),
      readyPercent: 75,
      color: '#8c22f6'
    },
    {
      name: 'Wait teamlead from the day off',
      startDate: new Date(2021, 5, 2, 16, 45),
      endDate: new Date(2021, 5, 16, 12, 30),
      readyPercent: 61,
      color: '#05e9f4'
    },


    {
      name: 'Create gantt component',
      startDate: new Date(2021, 5, 1, 2, 0),
      endDate: new Date(2021, 5, 25, 12, 0),
      readyPercent: 66,
      color: '#ff6e6e'
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 5, 1, 12),
      endDate: new Date(2021, 5, 9, 13),
      readyPercent: 71,
      color: '#5a63cf'
    },
    {
      name: 'Survive at work',
      startDate: new Date(2021, 5, 2, 3, 20),
      endDate: new Date(2021, 6, 25),
      readyPercent: 60,
      color: '#39e30f'
    },
    {
      name: 'Complete the internship',
      startDate: new Date(2021, 4, 31, 6, 33),
      endDate: new Date(2021, 5, 13, 12, 30),
      readyPercent: 75,
      color: '#8c22f6'
    },
    {
      name: 'Wait teamlead from the day off',
      startDate: new Date(2021, 5, 2, 16, 45),
      endDate: new Date(2021, 5, 16, 12, 30),
      readyPercent: 61,
      color: '#05e9f4'
    },


    {
      name: 'Create gantt component',
      startDate: new Date(2021, 5, 1, 2, 0),
      endDate: new Date(2021, 5, 25, 12, 0),
      readyPercent: 66,
      color: '#ff6e6e'
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 5, 1, 12),
      endDate: new Date(2021, 5, 9, 13),
      readyPercent: 71,
      color: '#5a63cf'
    },
    {
      name: 'Survive at work',
      startDate: new Date(2021, 5, 2, 3, 20),
      endDate: new Date(2021, 6, 25),
      readyPercent: 60,
      color: '#39e30f'
    },
    {
      name: 'Complete the internship',
      startDate: new Date(2021, 4, 31, 6, 33),
      endDate: new Date(2021, 5, 13, 12, 30),
      readyPercent: 75,
      color: '#8c22f6'
    },
    {
      name: 'Wait teamlead from the day off',
      startDate: new Date(2021, 5, 2, 16, 45),
      endDate: new Date(2021, 5, 16, 12, 30),
      readyPercent: 61,
      color: '#05e9f4'
    },


    {
      name: 'Create gantt component',
      startDate: new Date(2021, 5, 1, 2, 0),
      endDate: new Date(2021, 5, 25, 12, 0),
      readyPercent: 66,
      color: '#ff6e6e'
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 5, 1, 12),
      endDate: new Date(2021, 5, 9, 13),
      readyPercent: 71,
      color: '#5a63cf'
    },
    {
      name: 'Survive at work',
      startDate: new Date(2021, 5, 2, 3, 20),
      endDate: new Date(2021, 6, 25),
      readyPercent: 60,
      color: '#39e30f'
    },
    {
      name: 'Complete the internship',
      startDate: new Date(2021, 4, 31, 6, 33),
      endDate: new Date(2021, 5, 13, 12, 30),
      readyPercent: 75,
      color: '#8c22f6'
    },
    {
      name: 'Wait teamlead from the day off',
      startDate: new Date(2021, 5, 2, 16, 45),
      endDate: new Date(2021, 5, 16, 12, 30),
      readyPercent: 61,
      color: '#05e9f4'
    },
    {
      name: 'Create gantt component',
      startDate: new Date(2021, 5, 1, 2, 0),
      endDate: new Date(2021, 5, 25, 12, 0),
      readyPercent: 66,
      color: '#ff6e6e'
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 5, 1, 12),
      endDate: new Date(2021, 5, 9, 13),
      readyPercent: 71,
      color: '#5a63cf'
    },
    {
      name: 'Survive at work',
      startDate: new Date(2021, 5, 2, 3, 20),
      endDate: new Date(2021, 6, 25),
      readyPercent: 60,
      color: '#39e30f'
    },
    {
      name: 'Complete the internship',
      startDate: new Date(2021, 4, 31, 6, 33),
      endDate: new Date(2021, 5, 13, 12, 30),
      readyPercent: 75,
      color: '#8c22f6'
    },
    {
      name: 'Wait teamlead from the day off',
      startDate: new Date(2021, 5, 2, 16, 45),
      endDate: new Date(2021, 5, 16, 12, 30),
      readyPercent: 61,
      color: '#05e9f4'
    },
    {
      name: 'Create gantt component',
      startDate: new Date(2021, 5, 1, 2, 0),
      endDate: new Date(2021, 5, 25, 12, 0),
      readyPercent: 66,
      color: '#ff6e6e'
    },
    {
      name: 'Fix angular-grid bugs',
      startDate: new Date(2021, 5, 1, 12),
      endDate: new Date(2021, 5, 9, 13),
      readyPercent: 71,
      color: '#5a63cf'
    },
    {
      name: 'Survive at work',
      startDate: new Date(2021, 5, 2, 3, 20),
      endDate: new Date(2021, 6, 25),
      readyPercent: 60,
      color: '#39e30f'
    },
    {
      name: 'Complete the internship',
      startDate: new Date(2021, 4, 31, 6, 33),
      endDate: new Date(2021, 5, 13, 12, 30),
      readyPercent: 75,
      color: '#8c22f6'
    },
    {
      name: 'Wait teamlead from the day off',
      startDate: new Date(2021, 5, 2, 16, 45),
      endDate: new Date(2021, 5, 16, 12, 30),
      readyPercent: 61,
      color: '#05e9f4'
    },
  ];
}
