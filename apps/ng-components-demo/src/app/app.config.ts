import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    provideBrowserGlobalErrorListeners(),
    // anchorScrolling makes the "On this page" fragment links scroll; scroll
    // position restoration resets the viewport on prev/next pager navigation.
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
  ],
};
