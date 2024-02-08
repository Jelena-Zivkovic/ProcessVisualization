import { Component, Injector, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { HeaderComponent } from '../header/header.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { Menu, MenuModule } from 'primeng/menu';
import { MegaMenuItem, MenuItem } from 'primeng/api';
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


@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [HeaderComponent, CardModule, TableModule, ButtonModule, MegaMenuModule, MenuModule, ToastModule, CommonModule, RoomDialogComponent, FormsModule, DialogModule],//
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

  cols: any[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.webapiRoomsService.getAllRoom().subscribe(res => {
      console.log(res, Object.keys(res[0]));
      this.rooms = res;
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'lastUpdatedAt', header: 'Modifed At' }
    ];

    this.items1 = [
      {
        label: 'Options',
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
        label: 'Navigate',
        items: [
          {
            label: 'Leave',
            icon: 'pi pi-external-link',
            url: 'http://angular.io'
          },
        ]
      }
    ];
  }

  openRoomDetailsAction(ev: any) {
    this.roomDetailsAction.toggle(ev);
  }

  showRoomDetails(roomId: any) {
    console.log(roomId)
    this.webapiRoomsService.getRoom(roomId).subscribe(res => {
      console.log(res);
      this.selectedRoom = res;
    })
  }

  showRoomDialog() {
    this.isRoomDialogOpen = true;
  }
}
