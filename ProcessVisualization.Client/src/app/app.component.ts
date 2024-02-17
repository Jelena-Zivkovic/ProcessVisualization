import { Component, Injector } from '@angular/core';
import { BaseImports } from 'src/libs/base-imports';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseImports {
  title = 'ProcessVisualization.Client';
  constructor(injector: Injector) {
    super(injector);
  }
}
