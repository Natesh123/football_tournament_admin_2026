import { HttpInterceptorFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UiService } from '../../services/ui.service';

/**
 * Per-request opt-out: set this on a request's HttpContext to suppress the global
 * error toast (the caller handles the error itself / it's a best-effort call).
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

/**
 * Global HTTP error interceptor.
 *
 * Surfaces a user-facing toast for transport/server errors using the existing
 * `UiService`. It deliberately does NOT handle 401 — authentication/session
 * expiry is owned by `authInterceptor`, which clears storage and redirects to
 * /login. This interceptor must be registered AFTER `authInterceptor`.
 *
 * The original error is always re-thrown so component-level `error` handlers
 * (custom messages, redirects, form state) keep working.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const ui = inject(UiService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip translation files, let auth own 401, and honour per-request opt-out.
      const isAssetRequest = req.url.includes('/assets/i18n/');
      const skip = req.context.get(SKIP_ERROR_TOAST);

      if (!isAssetRequest && error.status !== 401 && !skip) {
        ui.showToast(messageFor(error), 'error');
      }

      return throwError(() => error);
    }),
  );
};

function messageFor(error: HttpErrorResponse): string {
  // Prefer a server-provided message when present and meaningful.
  const serverMessage = error.error?.message || error.error?.error;

  switch (error.status) {
    case 0:
      return 'Network error. Please check your connection and try again.';
    case 403:
      return serverMessage || 'You do not have permission to perform this action.';
    case 404:
      return serverMessage || 'The requested resource was not found.';
    case 422:
      return serverMessage || 'Some of the submitted data is invalid.';
    default:
      if (error.status >= 500) {
        return 'Something went wrong on our end. Please try again later.';
      }
      return serverMessage || 'An unexpected error occurred. Please try again.';
  }
}
