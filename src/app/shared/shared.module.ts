import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GanttComponent } from './gantt/gantt.component';

@NgModule({
  declarations: [GanttComponent],
  imports: [BrowserModule, CommonModule],
  exports: [BrowserModule, CommonModule, GanttComponent]
})
export class SharedModule {}
