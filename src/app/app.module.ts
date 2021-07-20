import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { GanttModule } from './shared/modules/gantt.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SharedModule, GanttModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
