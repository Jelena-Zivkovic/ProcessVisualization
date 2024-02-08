// Angular
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { share, filter } from 'rxjs/operators';
// Dtos
import { SharedDo } from 'src/dos/shared/shared.do';
//Services
import { LoggerService } from './logger.service';
//import { EventCreateDto } from '@dtos/events/event-create.dto';

@Injectable()
export class SharedService {
  observable: Observable<SharedDo>;
  observer!: Observer<SharedDo>;

  cloneEventId?: number;

  constructor(private loggerService: LoggerService) {
    var temp = new Observable((observer: Observer<SharedDo>) => {
      this.observer = observer;
    });
    this.observable = temp.pipe(share());
  }

  broadcast(name: string, data: any = null) {
    let sharedDo = new SharedDo();
    sharedDo.Name = name;
    sharedDo.Data = data;
    if (this.observer != null && this.observer != undefined) {
      this.observer.next(sharedDo);
    }
    else {
      this.loggerService.error("Observer object is NULL or undefined", "Shared Service");
    }
  }

  on(eventName: string, callback?: any): Subscription {
    return this.observable.pipe(filter(event => event.Name === eventName)).subscribe(callback);
  }
}
