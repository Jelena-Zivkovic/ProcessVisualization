import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  // bootstrapApplication(AppComponent, {
  //   providers: [
  //     provideHttpClient(),
  //   ],
  // });
