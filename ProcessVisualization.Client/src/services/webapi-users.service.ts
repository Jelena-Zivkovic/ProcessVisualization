import { Injectable, Injector } from '@angular/core';
import { RoomDetailsViewDto } from 'src/dtos/rooms/room-details-view.dto';
import { RoomViewDto } from 'src/dtos/rooms/room-view.dto';
import { SignUpDto } from 'src/dtos/sign-up/sign-up.dto';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  Observable,
  of,
  zip,
} from 'rxjs';
import { Constants } from 'src/app/app.constants';
import { BaseApiService } from './base-api.service';

@Injectable()
export class WebapiUsersService extends BaseApiService {
  controllerName = 'Users';
  baseUrl = Constants.BASE_URL + this.controllerName;
  constructor(injector: Injector) {
    super(injector);
  }

  signUp(user: SignUpDto, showLoader = true) {
    return this.http.post<any>(
      this.baseUrl,
      user,
      this.getHttpParams(showLoader, null, user)
    );
  }
}
