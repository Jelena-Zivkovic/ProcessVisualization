import { Component, Injector, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { HeaderComponent } from '../../app/header/header.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { Menu, MenuModule } from 'primeng/menu';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppModule } from '../../app/app.module';
import { AppComponent } from '../../app/app.component';
import { BaseImports } from 'src/libs/base-imports';
import { RouterModule } from '@angular/router';
import { RoomViewDto } from 'src/dtos/rooms/room-view.dto';
import { RoomDetailsViewDto } from 'src/dtos/rooms/room-details-view.dto';
import { RoomDialogComponent } from '../../app/room-dialog/room-dialog.component';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RoomJoinDto } from 'src/dtos/rooms/room-join.dto';
import { LeaveRoomDto } from 'src/dtos/rooms/leave-room.dto';


@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [HeaderComponent, CardModule, TableModule, ButtonModule, MegaMenuModule, MenuModule, ToastModule, CommonModule, RoomDialogComponent, FormsModule, DialogModule, InputTextModule],//
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent extends BaseImports {
  @ViewChild('menu') roomDetailsAction!: Menu;
  rooms: RoomViewDto[] = [];
  products: any[] = [];
  items: MegaMenuItem[] = [];
  items1: MenuItem[] = [];
  selectedRoom!: RoomDetailsViewDto;

  isRoomDialogOpen: boolean = false;
  isJoinRoomDialogOpen: boolean = false;
  isRoomSettingsDialogOpen: boolean = false;

  roomCode: string = "";

  constructor(injector: Injector, private messageService: MessageService) {
    super(injector);
  }

  ngOnInit() {
    this.loadAllRooms();


    this.items1 = [
      {
        items: [
          {
            label: 'Room settings',
            icon: 'pi pi-cog',
            command: () => {
              alert("dd");
            }
          },
          {
            label: 'Leave',
            icon: 'pi pi-external-link',
            command: () => {
              this.leaveRoom()
            }
          }
        ]
      }
    ];
  }

  openRoomDetailsAction(ev: any) {
    this.roomDetailsAction.toggle(ev);
  }

  showRoomDetails(roomId: number) {
    this.webapiRoomsService.getRoom(roomId).subscribe(res => {
      this.selectedRoom = res;
    })
  }

  addNewDiagram() {
    this.commonService.clearDocument();
    this.commonService.setRoomId(this.selectedRoom.Id);
    this.routerService.navigate("editor");
  }

  toggleRoomDialog(refresh: boolean = false) {
    this.isRoomDialogOpen = !this.isRoomDialogOpen;
    if (refresh) {
      this.loadAllRooms();
    }
  }
  showJoinRoomDialog() {
    this.isJoinRoomDialogOpen = true;
  }

  joinRoom() {
    const loginUser = this.authenticationService.getLoginData();
    var data: RoomJoinDto = {
      RoomCode: this.roomCode,
      UserEmail: loginUser.Email
    }

    this.webapiRoomsService.joinRoom(data).subscribe(res => {
      if (res.IsSuccess) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Successfully joined the room" })
        this.isJoinRoomDialogOpen = false;
        this.loadAllRooms();
        this.roomCode = "";
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.Message ?? "" });
      }
    });
  }

  leaveRoom() {
    const loginUser = this.authenticationService.getLoginData();
    const data: LeaveRoomDto = {
      RoomId: this.selectedRoom.Id,
      UserEmail: loginUser.Email
    }

    this.webapiRoomsService.leaveRoom(data).subscribe((res: any) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: "Room " + this.selectedRoom.Name + " was successfully leaved" });
      this.loadAllRooms();
    });
  }

  removeUser(userId: number) {
    this.selectedRoom.Users = this.selectedRoom.Users.filter(x => x.Id !== userId);
  }

  saveRoomSettings() {
    this.webapiRoomsService.updateRoom(this.selectedRoom).subscribe((res: { IsSuccess: any; Message: any; }) => {
      if (res.IsSuccess) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Room " + this.selectedRoom.Name + " was successfully updated" });
        this.isRoomSettingsDialogOpen = false;
        this.loadAllRooms();
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.Message ?? "" });
      }
    });
  }

  openDocument(roomId: number) {
    this.commonService.clearDocument();
    this.commonService.setRoomId(this.selectedRoom.Id);
    this.webapiDocumentsService.getDocument(roomId).subscribe((res) => {
      if (res.IsSuccess) {
        this.commonService.setDocument(res.Data);
        this.routerService.navigate("editor");
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.Message ?? "" });
      }
    })
  }

  private loadAllRooms(): void {
    this.webapiRoomsService.getAllRoom().subscribe(res => {
      this.rooms = res;
      if (res.length > 0) {
        this.showRoomDetails(res[0].Id);
      }
    });
  }
}
