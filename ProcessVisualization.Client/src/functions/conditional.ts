import { Injectable } from "@angular/core";

@Injectable()
export class ConditionalFunctions {
  functionInfo = {
    "greaterThan": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] > args[1];
      }
    },
    "lessThan": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] < args[1];
      }
    },
    "Equal": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] == args[1];
      }
    },
    "notEqual": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] !== args[1];
      }
    },
    "lessThanOrEqual": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] <= args[1];
      }
    },
    "greaterThanOrEqual": {
      "parameters": [
        "number",
        "number"
      ],
      "returnType": "number",
      execute: (...args: [a: number, b: number]) => {
        return args[0] >= args[1];
      }
    }
  };
}
