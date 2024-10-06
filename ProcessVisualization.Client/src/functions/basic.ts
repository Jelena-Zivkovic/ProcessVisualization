import { Injectable } from "@angular/core";

@Injectable()
export class BasicFunctions {
  functionInfo = {
    "return": {
      "parameters": [
        "number | string | boolean"
      ],
      "returnType": "number | string | boolean",
      execute: (...args: [a: number | string | boolean]) => {
        return args[0] as number | string | boolean;
      }
    },
    "returnWithRandomDelay": {
      "parameters": [
        "number | string | boolean"
      ],
      "returnType": "number | string | boolean",
      execute: (...args: [a: number | string | boolean]) => {
        setTimeout(() => {
          return args[0] as number | string | boolean;
        }, Math.random() * 1000);
      }
    }
  };
};


