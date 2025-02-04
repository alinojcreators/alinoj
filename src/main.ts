import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { routes } from './app/app.routes'; // Your routes file
import { HttpLoaderFactory } from './app/i18n-config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule, // Add this to enable animations
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
