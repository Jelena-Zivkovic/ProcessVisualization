import { Injectable } from "@angular/core";
import { BasicMathFunctions } from "./basic-math";
import { ConditionalFunctions } from "./conditional";
import { BasicFunctions } from "./basic";

@Injectable()
export class FunctionsGroup {
  "BasicMath": BasicMathFunctions = new BasicMathFunctions();
  "Conditional": ConditionalFunctions = new ConditionalFunctions();
  "BasicFunctions": BasicFunctions = new BasicFunctions();
};
