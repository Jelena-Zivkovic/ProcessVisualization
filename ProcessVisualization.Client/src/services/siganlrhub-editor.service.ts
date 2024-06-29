import { Injectable, Injector } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Constants } from 'src/app/app.constants';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';
import { SharedService } from './shared.service';
import { ControleEditorState } from 'src/enum/controle-editor-state.enum';

@Injectable({
  providedIn: 'root'
})
export class SignalREditorService {
  private hubConnection!: signalR.HubConnection;
  private hubPath: string = "editorhub";
  private closeConnection: boolean = false;
  sharedService: SharedService;
  constructor(injector: Injector) {
    this.sharedService = injector.get(SharedService);
  }

  startConnection = (groupName: string, sharedService: SharedService = this.sharedService) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(Constants.BASE_URL + this.hubPath)
      .build();

    this.hubConnection.onclose((callback) => {
      console.log('Connection closed', callback);
      if (this.closeConnection) {
        this.closeConnection = false;
        return;
      }
      this.start().then(() => {
        console.log('Connection started');
        this.registerOnServerEvents(groupName);
      });

      console.log('Connection closed');
      this.sharedService.broadcast("SignalRConnected", false);
    });

    this.start().then(() => {
      console.log('Connection started', groupName);
      this.registerOnServerEvents(groupName);
    });
  }

  async start() {
    try {
      await this.hubConnection.start();
    } catch (err) {
      console.log(err);
      // setTimeout(() => this.start(), 5000);
    }
  }

  registerOnServerEvents = (groupName: string) => {
    this.addReceiveMessageListener(this.sharedService);
    this.addChangeContoleEditorStateListener(this.sharedService);
    this.addToGroup(groupName);
    this.sharedService.broadcast("SignalRConnected", true);
  }

  addReceiveMessageListener = (sharedService: SharedService) => {
    this.hubConnection.on("ReceiveMessage", function (user, message) {
      console.log(`SignalR: ${user} says: `, message);
      sharedService.broadcast("ReceiveMessage123", message);
    });
  }

  addChangeContoleEditorStateListener = (sharedService: SharedService) => {
    this.hubConnection.on("ReceiveContoleEditorState", function (user, message) {
      console.log(`ChangeContoleEditorState - SignalR: ${user} says: `, message);
      sharedService.broadcast("ChangeContoleEditorState123", message);
    });
  }

  addToGroup = (groupName: string) => {
    this.hubConnection.invoke('AddToGroup', groupName)
      .catch(err => console.error(err));
  }

  removeFromGroup = (groupName: string) => {
    this.hubConnection.invoke('RemoveFromGroup', groupName)
      .then((res) => console.log("RemoveFromGroup", res))
      .catch(err => console.error(err));
  }

  stopConnection = () => {
    console.log('Stopping connection...', this.hubConnection.state);
    if (this.hubConnection) {
      this.closeConnection = true;
      this.hubConnection.stop()
        .then(() => console.log('Connection stopped successfully.'))
        .catch(err => console.error('Error while stopping connection: ', err));
    }
  }

  sendMessageToGroup = (groupName: string, user: string, message: DiagramCreateDto) => {
    if (this.hubConnection.state != signalR.HubConnectionState.Connected) {
      console.log('Connection is not started. Please start the connection first.');
      return;
    }
    this.hubConnection.invoke('SendMessageToGroup', groupName, user, message)
      .catch(err => console.log(err));
  }

  ChangeContoleEditorState = (groupName: string, user: string, message: ControleEditorState) => {
    if (this.hubConnection.state != signalR.HubConnectionState.Connected) {
      console.log('Connection is not started. Please start the connection first.');
      return;
    }

    console.log("ChangeContoleEditorState", groupName, user, message);
    this.hubConnection.invoke('ChangeContoleEditorState', groupName, user, message)
      .catch(err => console.error(err));
  }

}
