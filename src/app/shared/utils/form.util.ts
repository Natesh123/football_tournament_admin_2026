import { FormGroup } from '@angular/forms';

/**
 * Form helpers that standardize submit behavior across the app, so individual
 * components no longer duplicate the "mark all touched / focus first invalid"
 * boilerplate.
 */

/**
 * Mark every control in the group as touched so `<app-validation>` reveals all
 * messages, force the validation `events` stream to emit, and move focus to the
 * first invalid control for accessibility.
 *
 * Returns `true` when the form is valid, `false` otherwise — callers can use it
 * as a guard:  `if (!revealAndFocusInvalid(form)) return;`
 */
export function revealAndFocusInvalid(form: FormGroup, hostEl?: HTMLElement): boolean {
  if (form.valid) return true;

  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    if (!control) return;
    control.markAsTouched();
    // markAsTouched alone does not emit on `events`/`statusChanges`; nudge it so
    // the validation component re-renders immediately on submit.
    control.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  });

  focusFirstInvalid(form, hostEl);
  return false;
}

/** Focus the first invalid control's input element, if it can be located. */
export function focusFirstInvalid(form: FormGroup, hostEl?: HTMLElement): void {
  const firstInvalidKey = Object.keys(form.controls).find((key) => form.get(key)?.invalid);
  if (!firstInvalidKey) return;

  const root: ParentNode = hostEl ?? document;
  const el = root.querySelector<HTMLElement>(
    `[formcontrolname="${firstInvalidKey}"], [formControlName="${firstInvalidKey}"]`,
  );
  el?.focus();
}
