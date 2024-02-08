export class RoomViewDto {
  Id!: number;
  Name: string = "";
  CreatedAt!: Date;
  LastUpdatedAt!: Date;
  Description: string= "";
  ImageUrl: string = "";
  RoomCode: string= "";

  constructor() {
  }
}
