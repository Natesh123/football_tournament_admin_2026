import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { startWith } from 'rxjs';
import { resolveValidationMessage } from '../../constants/validation-messages';

/**
 * Reusable validation message display.
 *
 * Renders the first validation error for the bound control, but only after the
 * user has interacted with it (touched or dirty). Messages are resolved from the
 * central `VALIDATION_MESSAGES` registry — no message strings live in templates.
 *
 * Usage:
 *   <app-validation [control]="form.controls.email" />
 *   <app-validation [control]="form.controls.name" label="Name" />
 *
 * Works in the zoneless app by subscribing to the control's `events` stream,
 * which (unlike `statusChanges`) also emits when the touched state changes — so
 * messages appear on blur and after `markAllAsTouched()` on submit.
 */
@Component({
  selector: 'app-validation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <p class="app-validation text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1.5"
         role="alert" aria-live="polite">
        {{ message() }}
      </p>
    }
  `,
})
export class ValidationComponent {
  /** The reactive form control to validate. */
  readonly control = input.required<AbstractControl>();
  /** Optional human-friendly field label used inside messages (e.g. "Email is required."). */
  readonly label = input<string>();

  /** The currently displayed message, or null when the field is valid/untouched. */
  protected readonly message = signal<string | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private subscribedTo: AbstractControl | null = null;

  constructor() {
    // (Re)subscribe whenever the bound control instance changes.
    effect(() => {
      const ctrl = this.control();
      if (ctrl === this.subscribedTo) {
        this.recompute();
        return;
      }
      this.subscribedTo = ctrl;
      ctrl.events
        .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.recompute());
    });
  }

  private recompute(): void {
    const ctrl = this.control();
    const show = ctrl.invalid && (ctrl.touched || ctrl.dirty);
    this.message.set(show ? resolveValidationMessage(ctrl.errors, this.label()) : null);
  }
}
