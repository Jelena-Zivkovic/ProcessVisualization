import { Injectable } from "@angular/core";

@Injectable()
export class BasicFunctions {
  functionInfo = {
    "add": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] + args[1];
      }
    },
    "subtract": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] - args[1];
      }
    },
    "multiply": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] * args[1];
      }
    },
    "divide": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] / args[1];
      }
    },
    "increment": {
      "parameters": [
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number]) => {
        return args[0] + 1;
      }
    },
    "sum": {
      "parameters": [
        "number",
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] + 1;
      }
    },
  };
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

