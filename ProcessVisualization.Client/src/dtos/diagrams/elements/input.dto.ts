import { ShapeDto } from "../shape.dto";

export class InputDto extends ShapeDto {
  ValueType: "string" | "number" | "boolean" | "date" | "time" | "datetime" = "number";

  constructor() {
    super();
  }
}
