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

  override copy(parameter: any) {
    super.copy(parameter);
    this.WayPoints = parameter.WayPoints.map((point: any) => {
      const pointDto = new PointDto();
      pointDto.x = point.x;
      pointDto.y = point.y;
      return pointDto;
    });
    this.Source = parameter.Source;
    this.Target = parameter.Target;
    this.Value = parameter.Value;
  }

  mapConnection(connection: any) {
    //this.Id = connection.id;
    this.Source = connection.source?.id;
    this.Target = connection.target?.id;
    this.WayPoints = connection.waypoints?.map((point: any) => {
      const pointDto = new PointDto();
      pointDto.x = point.x;
      pointDto.y = point.y;
      return pointDto;
    });
  }
}
