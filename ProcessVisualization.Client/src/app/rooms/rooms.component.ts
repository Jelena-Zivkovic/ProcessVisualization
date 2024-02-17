import { Component, Injector, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { HeaderComponent } from '../header/header.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { Menu, MenuModule } from 'primeng/menu';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppModule } from '../app.module';
import { AppComponent } from '../app.component';
import { BaseImports } from 'src/libs/base-imports';
import { RouterModule } from '@angular/router';
import { RoomViewDto } from 'src/dtos/rooms/room-view.dto';
import { RoomDetailsViewDto } from 'src/dtos/rooms/room-details-view.dto';
import { RoomDialogComponent } from '../room-dialog/room-dialog.component';
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

  cols: any[] = [];
  roomCode: string = "";

  constructor(injector: Injector, private messageService: MessageService) {
    super(injector);
  }

  ngOnInit() {
    this.loadAllRooms();

    this.cols = [
      { field: 'Name', header: 'Name' },
      { field: 'UpdatedAt', header: 'Modifed At' }
    ];

    this.items1 = [
      {
        items: [
          {
            label: 'Manage members',
            icon: 'pi pi-refresh',
            command: () => {
              alert("dd");
            }
          },
          {
            label: 'Room settings',
            icon: 'pi pi-times',
            command: () => {
              alert("dd");
            }
          }
        ]
      },
      {
        items: [
          {
            label: 'Leave',
            icon: 'pi pi-external-link',
            command: () => {
              this.leaveRoom()
            }
          },
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
    console.log(this.roomCode)
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

  private loadAllRooms(): void {
    this.webapiRoomsService.getAllRoom().subscribe(res => {
      this.rooms = res;
      if (res.length > 0) {
        this.showRoomDetails(res[0].Id);
      }
    });
  }
}
