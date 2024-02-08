import { ElementDto } from "./element.dto";

export class ShapeDto extends ElementDto {
  x: number;
  y: number;
  width: number;
  height: number;
  isImplicit?: boolean;
  isFrame?: boolean;
  children: ElementDto[] = [];
  host?: ShapeDto;
  attachers: ShapeDto[] = [];

  constructor() {
    super();

    this.x = -1;
    this.y = -1;
    this.width = -1;
    this.height = -1;
  }
}
