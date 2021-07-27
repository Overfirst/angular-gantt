import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { GanttTask, GanttTaskWrapper } from "../interfaces";

export class GanttValidators {
  static startDateLaterValidator(connectControl: AbstractControl): ValidatorFn {
    return function(control: AbstractControl): ValidationErrors | null {
      const startDate = new Date(control.value);
      const endDate = new Date(connectControl.value);

      if (startDate > endDate) {
        return { error: 'The start date is later than the end date!' };
      }

      return null;
    }
  }

  static dateOutsideParentTask(wrapper: GanttTaskWrapper): ValidatorFn {
    return function(control: AbstractControl): ValidationErrors | null {
      if (!wrapper.task) {
        return null;
      }

      const date = new Date(control.value);

      if (date < wrapper.task.startDate || date > wrapper.task.endDate) {
        return { error: 'The date goes beyond the parent!' };
      }

      return null;      
    }
  }

  static dateOutsideChildTask(childs: GanttTask[]): ValidatorFn {
    return function(control: AbstractControl): ValidationErrors | null {
      const date = new Date(control.value);

      for (let i = 0; i < childs.length; i++) {
        const task = childs[i];

        if (date > task.startDate && date < task.endDate) {
          return { error: `Going beyond the child task! [${task.ID}]` };
        }
      }      

      return null;
    }
  }
}