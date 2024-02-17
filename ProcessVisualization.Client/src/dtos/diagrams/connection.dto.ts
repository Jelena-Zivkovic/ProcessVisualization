import { ElementDto } from "./element.dto";
import { PointDto } from "./point.dto";

export class ConnectionDto extends ElementDto {
  WayPoints: PointDto[] = [];
  Source?: string = "";
  Target?: string = "";

  constructor() {
    super();
  }
}
