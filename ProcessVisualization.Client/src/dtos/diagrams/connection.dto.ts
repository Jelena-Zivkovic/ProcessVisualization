import { ElementDto } from "./element.dto";
import { PointDto } from "./point.dto";

export class ConnectionDto extends ElementDto {
  waypoints: PointDto[] = [];
  source?: string = "";
  target?: string = "";

  constructor() {
    super();
  }
}
