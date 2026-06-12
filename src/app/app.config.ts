import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // Preload all lazy routes in the background after the initial view renders,
    // so subsequent navigations are instant instead of waiting on a chunk fetch.
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
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
