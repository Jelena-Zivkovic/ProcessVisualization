import { ConnectionDto } from "./connection.dto";
import { LabelDto } from "./label.dto";
import { ShapeDto } from "./shape.dto";

export class DiagramCreateDto {
  Id?: number;
  Name: string;
  Description: string;
  RoomId?: number | null;
  Shapes: ShapeDto[] = [];
  Connections: ConnectionDto[] = [];
  FuncGroup: string = "BasicMath";
  Xml: string = "";

  constructor(roomId: number | null = null) {
    this.Name = "New diagram";
    this.Description = "";
    this.RoomId = roomId;
  }

}
