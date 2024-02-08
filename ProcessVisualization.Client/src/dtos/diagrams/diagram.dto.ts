import { ConnectionDto } from "./connection.dto";
import { ShapeDto } from "./shape.dto";

export class DiagramDto {
  Shapes: ShapeDto[] = [];
  Connections: ConnectionDto[] = [];

  constructor() { }
}
