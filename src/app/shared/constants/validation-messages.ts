/**
 * Central registry of validation messages for the whole application.
 *
 * Each entry maps an Angular validation error key (the key found in
 * `AbstractControl.errors`) to a factory that builds the human-readable
 * message. The factory receives:
 *   - `error`: the value stored under that error key (e.g. `{ requiredLength: 6 }`)
 *   - `label`: an optional field label so messages can read "Email is required."
 *
 * To add a new validation message anywhere in the app, add ONE entry here.
 * Never hard-code validation strings inside components.
 */
export type ValidationMessageFactory = (error: any, label?: string) => string;

/** Capitalize a label, falling back to a generic noun when none is provided. */
const field = (label?: string): string => (label?.trim() ? label.trim() : 'This field');

export const VALIDATION_MESSAGES: Record<string, ValidationMessageFactory> = {
  // --- Built-in Angular validators ---
  required: (_e, label) => `${field(label)} is required.`,
  requiredTrue: (_e, label) => `${field(label)} must be accepted.`,
  email: () => 'Please enter a valid email address.',
  min: (e) => `Value must be at least ${e?.min}.`,
  max: (e) => `Value must be at most ${e?.max}.`,
  minlength: (e) => `Must be at least ${e?.requiredLength} characters.`,
  maxlength: (e) => `Must be at most ${e?.requiredLength} characters.`,
  pattern: (_e, label) => `${field(label)} has an invalid format.`,

  // --- Custom validators (see custom-validators.ts) ---
  mobile: () => 'Mobile number must be 10 digits.',
  number: () => 'Please enter a valid number.',
  whitespace: (_e, label) => `${field(label)} cannot be empty.`,
  passwordStrength: () =>
    'Password must be at least 6 characters and contain an uppercase letter and a number.',
  passwordMismatch: () => 'Passwords do not match.',
  mismatch: () => 'Passwords do not match.',
  url: () => 'Please enter a valid URL.',
  teamRange: () => 'Maximum teams must be greater than or equal to minimum teams.',
  uniqueName: () => 'This team name is already taken. Please choose another.',
  fileType: (e) => `Unsupported file type. Allowed: ${(e?.allowed ?? []).join(', ')}.`,
  fileSize: (e) => `File is too large. Maximum size is ${e?.maxSizeMb} MB.`,
  dateRange: () => 'Please select a date within the allowed range.',
};

/**
 * Resolve the message for the first error on a control's error map.
 * Falls back to a generic message if the key is not registered.
 */
export function resolveValidationMessage(
  errors: Record<string, any> | null | undefined,
  label?: string,
): string | null {
  if (!errors) return null;
  const key = Object.keys(errors)[0];
  if (!key) return null;
  const factory = VALIDATION_MESSAGES[key];
  return factory ? factory(errors[key], label) : `${field(label)} is invalid.`;
}
