import { ParameterDto } from "../parameter.dto";
import { ElementDto } from "./element.dto";
import { PointDto } from "./point.dto";

export class ConnectionDto extends ElementDto {
  WayPoints: PointDto[] = [];
  Source?: string = "";
  Target?: string = "";
  Value: string = "true"

  constructor() {
    super();
  }
}
