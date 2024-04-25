import { Injectable } from '@angular/core';
import { FunctionInfo } from 'src/dos/function-info';
import { BasicFunctions } from 'src/functions/basic';

@Injectable()
export class EditorService {
  constructor(private basicFunctions: BasicFunctions) {

  }

  async getFunctionInfo(modulePath: string): Promise<FunctionInfo | undefined> {
    try {

      const module = this.basicFunctions;//await import(modulePath);

      console.log(module);
      if (module["functionInfo"]) {
        console.log(module["functionInfo"]);
        return module["functionInfo"] as FunctionInfo;
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
      const module = this.basicFunctions;// await import(modulePath);
      console.log(module);
      if (module.functionInfo && Object.keys(module.functionInfo).includes(functionName)) {
        if (module["functionInfo"]) {
          const functionInfo = module.functionInfo;
          console.log(args)
          var prams = [2, 3, 4];//args.slice(0, functionInfo[functionName as keyof typeof functionInfo].parameters.length);
          var func: Function = functionInfo[functionName as keyof typeof functionInfo].execute;
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
