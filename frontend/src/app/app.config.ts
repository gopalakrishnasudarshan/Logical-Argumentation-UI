import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

// Services: real HTTP-backed service vs. mock (JSON + localStorage)
import { ArgumentService } from './core/argument.service';
import { MockArgumentService } from './core/mock-argument.service';

// ─────────────────────────────────────────────────────────────
// appConfig
// ─────────────────────────────────────────────────────────────
// This file centralizes dependency wiring for the application.
// To run the UI without a live backend, provide ArgumentService
// using MockArgumentService. To use the real backend, provide
// ArgumentService with its default HTTP-based implementation.
// See the two documented options below.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),

    // ---------------------------------------------------------
    // OPTION A: Manual swap (simple and explicit)
    // ---------------------------------------------------------
    // Use the MOCK API (reads JSON from assets and writes to localStorage):
    { provide: ArgumentService, useClass: MockArgumentService },

    // To switch to the LIVE BACKEND (Spring Boot), replace the line above with:
    // { provide: ArgumentService, useClass: ArgumentService },
    //
    // Note: If your real ArgumentService is already decorated with @Injectable
    // and uses HttpClient to call /api/* endpoints, no further changes are needed.
    // Ensure your Angular proxy or server config routes /api/* to the backend.

    // ---------------------------------------------------------
    // OPTION B: Environment-based switch (recommended for teams)
    // ---------------------------------------------------------
    // If you prefer controlling this via environment flags, use:
    //
    // ...(environment.useMock
    //   ? [{ provide: ArgumentService, useClass: MockArgumentService }]
    //   : [{ provide: ArgumentService, useClass: ArgumentService }]),
    //
    // Steps:
    // 1) Add `useMock: true | false` to your environment files:
    //    - src/environments/environment.ts         → useMock: true   (dev)
    //    - src/environments/environment.prod.ts    → useMock: false  (prod)
    // 2) Import the environment here:
    //    import { environment } from '../environments/environment';
    // 3) Replace the manual provider above with the conditional block.
  ],
};
