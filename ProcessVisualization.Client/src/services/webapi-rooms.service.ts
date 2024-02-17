import { Injectable, Injector } from '@angular/core';
import { RoomDetailsViewDto } from 'src/dtos/rooms/room-details-view.dto';
import { RoomViewDto } from 'src/dtos/rooms/room-view.dto';
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
import { ResponseTemplateDto } from 'src/dtos/response-template.dto';
import { RoomJoinDto } from 'src/dtos/rooms/room-join.dto';
import { LeaveRoomDto } from 'src/dtos/rooms/leave-room.dto';

@Injectable()
export class WebapiRoomsService extends BaseApiService {
  controllerName = 'Room';
  baseUrl = Constants.BASE_URL + this.controllerName;
  constructor(injector: Injector) {
    super(injector);
  }

  getRoom(roomId: number, showLoader = true) {
    return this.http.get<RoomDetailsViewDto>(
      this.baseUrl + '/' + roomId,
      this.getHttpParams(showLoader)
    );
  }

  getAllRoom(showLoader = true) {
    return this.http.get<RoomViewDto[]>(
      this.baseUrl,
      this.getHttpParams(showLoader)
    );
  }

  createRoom(room: any, showLoader = true) {
    return this.http.post<ResponseTemplateDto<RoomViewDto>>(
      this.baseUrl,
      room,
      this.getHttpParams(showLoader, null, room)
    );
  }

  joinRoom(data: RoomJoinDto, showLoader = true) {
    return this.http.post<ResponseTemplateDto<RoomViewDto>>(
      this.baseUrl + "/JoinRoom",
      data,
      this.getHttpParams(showLoader, null, data)
    );
  }


  leaveRoom(data: LeaveRoomDto, showLoader = true) {
    return this.http.post<ResponseTemplateDto<number>>(
      this.baseUrl + "/LeaveRoom",
      data,
      this.getHttpParams(showLoader, null, data)
    );
  }
}
