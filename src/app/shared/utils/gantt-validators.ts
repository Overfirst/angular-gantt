import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

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
}