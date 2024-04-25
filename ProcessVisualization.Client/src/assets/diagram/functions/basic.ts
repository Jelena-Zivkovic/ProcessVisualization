
export namespace BasicFunctions {
  export const functionInfo = {
    "add": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number"
    },
    "subtract": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number"
    },
    "multiply": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number"
    },
    "divide": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number"
    }
  };
  export function add(a: number, b: number): number {
    return a + b;
  }

  export function subtract(a: number, b: number): number {
    return a - b;
  }

  export function multiply(a: number, b: number): number {
    return a * b;
  }

  export function divide(a: number, b: number): number {
    return a / b;
  }
};


// Path: src/assets/diagram/functions/basic.ts
// Compare this snippet from src/dtos/diagrams/elements/input.dto.ts:
// import { ShapeDto } from "../shape.dto";
//
// export class InputDto extends ShapeDto {
//   ValueType: "string" | "number" | "boolean" | "date" | "time" | "datetime" = "number";
//
//   constructor() {
//     super();
//   }
// }

