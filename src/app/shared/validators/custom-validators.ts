import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Reusable custom validators for the application.
 *
 * Every error key returned here MUST have a matching entry in
 * `validation-messages.ts` so `<app-validation>` can render it.
 */
export class CustomValidators {
  /** 10-digit mobile number. Empty value passes (combine with `required`). */
  static mobile(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return /^[0-9]{10}$/.test(String(value)) ? null : { mobile: true };
  }

  /** Numeric value only. Empty value passes. */
  static number(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return isNaN(Number(value)) ? null : { number: true };
  }

  /** Rejects values that are only whitespace. */
  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return String(value).trim().length === 0 ? { whitespace: true } : null;
  }

  /**
   * Password strength: min 6 chars, at least one uppercase letter and one digit.
   * Empty value passes (combine with `required`).
   */
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value ?? '';
    if (value === '') return null;
    const strong = value.length >= 6 && /[A-Z]/.test(value) && /[0-9]/.test(value);
    return strong ? null : { passwordStrength: true };
  }

  /** Basic URL validation. Empty value passes. */
  static url(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    try {
      new URL(String(value));
      return null;
    } catch {
      return { url: true };
    }
  }

  /**
   * Group-level validator that ensures two controls match.
   * Sets a `passwordMismatch` error on the `confirmField` control (so the
   * message renders next to the confirm input) and clears it when they match.
   *
   * Usage:
   *   this.fb.group({...}, { validators: CustomValidators.matchFields('password', 'confirmPassword') })
   */
  static matchFields(sourceField: string, confirmField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const source = group.get(sourceField);
      const confirm = group.get(confirmField);
      if (!source || !confirm) return null;

      if (confirm.value === '' || confirm.value === null) return null;

      if (source.value !== confirm.value) {
        // Preserve any other errors already on the confirm control.
        confirm.setErrors({ ...(confirm.errors ?? {}), passwordMismatch: true });
      } else if (confirm.hasError('passwordMismatch')) {
        const errors = { ...(confirm.errors ?? {}) };
        delete errors['passwordMismatch'];
        confirm.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    };
  }

  /**
   * Validate the file type of a control whose value is a `File`.
   * `allowedExtensions` is matched against the file extension, case-insensitively.
   */
  static fileType(allowedExtensions: string[]): ValidatorFn {
    const allowed = allowedExtensions.map((e) => e.toLowerCase().replace(/^\./, ''));
    return (control: AbstractControl): ValidationErrors | null => {
      const file: File | null = control.value;
      if (!file || !(file instanceof File)) return null;
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      return allowed.includes(ext) ? null : { fileType: { allowed } };
    };
  }

  /** Validate that a `File` control's size does not exceed `maxSizeMb` megabytes. */
  static fileSize(maxSizeMb: number): ValidatorFn {
    const maxBytes = maxSizeMb * 1024 * 1024;
    return (control: AbstractControl): ValidationErrors | null => {
      const file: File | null = control.value;
      if (!file || !(file instanceof File)) return null;
      return file.size > maxBytes ? { fileSize: { maxSizeMb } } : null;
    };
  }
}
