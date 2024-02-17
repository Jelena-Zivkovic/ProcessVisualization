import { ConnectionDto } from "./connection.dto";
import { ShapeDto } from "./shape.dto";

export class DiagramCreateDto {
  Id?: number;
  Name: string;
  RoomId?: number | null;
  Shapes: ShapeDto[] = [];
  Connections: ConnectionDto[] = [];

  constructor(roomId: number | null = null) {
    this.Name = "New diagram";
    this.RoomId = roomId;
  }

}
