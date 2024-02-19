import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Constants } from 'src/app/app.constants';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private hubPath: string = "editorhub";
  constructor() { }
  /*
    startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl(Constants.BASE_URL + "chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();
      console.log(this.hubConnection)

      this.hubConnection.on("ReceiveMessage", function (user, message) {
        console.log(`SignalR: ${user} says ${message}`);
      });

      this.hubConnection.start().then(function () {
        console.log(`Start SignalR`);
      }).catch(function (err) {
        return console.error(err.toString());
      });
    };

    sendMess = () => {
      this.hubConnection.invoke("SendMessage", "user1", "dkkdkdk").catch(function (err) {
        return console.error(err.toString());
      });
    }
  */


  startConnection = (groupName: string) => {
    console.log(Constants.BASE_URL + this.hubPath)
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(Constants.BASE_URL + this.hubPath, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();


    this.hubConnection.on("ReceiveMessage", function (user, message) {
      console.log(`SignalR: ${user} says: `, message);
    });

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        //this.addReceiveMessageListener();

        this.addToGroup(groupName);
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  addReceiveMessageListener = () => {
    this.hubConnection.on('DocumentUpdatedInGroup', (groupName: string, message: string) => {
      console.log(`Received message from ${groupName}: ${JSON.stringify(message)}`);
    });
  }

  addToGroup = (groupName: string) => {
    this.hubConnection.invoke('AddToGroup', groupName).then(res => console.log(res, this.hubConnection))
      .catch(err => console.error(err));
  }

  removeFromGroup = (groupName: string) => {
    this.hubConnection.invoke('RemoveFromGroup', groupName)
      .catch(err => console.error(err));
  }

  sendMessageToGroup = (groupName: string, user: string, message: DiagramCreateDto) => {
    this.hubConnection.invoke('SendMessageToGroup', groupName, user, message).then(suc => console.log(suc))
      .catch(err => console.error(err));
  }
}
