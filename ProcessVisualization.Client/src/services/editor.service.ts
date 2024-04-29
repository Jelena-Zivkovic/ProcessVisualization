import { Injectable } from '@angular/core';
import { FunctionInfo } from 'src/dos/function-info';
import { BasicMathFunctions } from 'src/functions/basic-math';
import { FunctionsGroup } from 'src/functions/functions';

@Injectable()
export class EditorService {
  constructor(private basicFunctions: FunctionsGroup) {

  }

  async getFunctionInfo(modulePath: string): Promise<FunctionInfo | undefined | any> {
    try {
      const module = this.basicFunctions[modulePath as keyof FunctionsGroup];

      if (module["functionInfo"]) {
        console.log(module["functionInfo"]);
        return module["functionInfo"];
      }
      else {
        console.error('No functionInfo found in the module:', modulePath);
      }
    } catch (error) {
      console.error('An error occurred while getting inforamtion for function:', error);
    }

    return undefined;
  }

  async executeFunction(modulePath: string, functionName: string, ...args: any[]) {
    try {
      const module = this.basicFunctions[modulePath as keyof typeof this.basicFunctions];// await import(modulePath);
      console.log(module);
      if (module.functionInfo && Object.keys(module.functionInfo).includes(functionName)) {
        if (module["functionInfo"]) {
          const functionInfo = module.functionInfo[functionName as keyof typeof module.functionInfo]; // Add type assertion here
          console.log(args, functionInfo)

          const func: (...args: ("string" | "number" | "boolean")[]) => any = functionInfo['execute']; // Explicitly define the type of func
          return func(...args);
        }
      } else {
        console.error(`Function ${functionName} does not exist in the module ${modulePath}`);
      }
    } catch (error) {
      console.error('An error occurred while executing the function:', error);
    }
    return undefined;
  }

}
