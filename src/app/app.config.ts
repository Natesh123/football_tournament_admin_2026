import { ApplicationConfig, provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import localeEnGb from '@angular/common/locales/en-GB';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

// Use UK English so the whole app formats dates day-first (dd/MM/yyyy) by default.
registerLocaleData(localeEnGb);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // Day-first dates everywhere: en-GB locale + a dd/MM/yyyy default for the
    // `date` pipe when no explicit format is passed.
    { provide: LOCALE_ID, useValue: 'en-GB' },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'dd/MM/yyyy' } },
    // Preload all lazy routes in the background after the initial view renders,
    // so subsequent navigations are instant instead of waiting on a chunk fetch.
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // authInterceptor runs first (owns 401 + token); errorInterceptor surfaces
    // toasts for all other transport/server errors.
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideTranslateService({
      defaultLanguage: 'en',
      fallbackLang: 'en'
    }),
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json'
    })
  ]
};
