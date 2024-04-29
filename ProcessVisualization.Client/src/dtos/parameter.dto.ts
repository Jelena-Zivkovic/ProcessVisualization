export class ParameterDto {
  Type: "number" | "string" | "boolean" | `"number" | "boolean"` | `"number" | "string" | "boolean"` | `"number" | "string"` | `"string" | "boolean"` = "number";
  Name: string = "";
  Value?: string | number | boolean;
  constructor() {
  }
}
