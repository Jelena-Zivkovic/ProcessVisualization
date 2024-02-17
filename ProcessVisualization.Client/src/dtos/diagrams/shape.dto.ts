import { ElementDto } from "./element.dto";

export class ShapeDto extends ElementDto {
  X: number;
  Y: number;
  Width: number;
  Height: number;
  isImplicit?: boolean;
  isFrame?: boolean;
  children: ElementDto[] = [];
  host?: ShapeDto;
  attachers: ShapeDto[] = [];

  constructor() {
    super();

    this.X = -1;
    this.Y = -1;
    this.Width = -1;
    this.Height = -1;
  }
}
