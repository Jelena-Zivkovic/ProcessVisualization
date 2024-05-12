import { Injectable, Injector } from '@angular/core';
import { FunctionInfo } from 'src/dos/function-info';
import { BasicMathFunctions } from 'src/functions/basic-math';
import { FunctionsGroup } from 'src/functions/functions';
import Modeler from 'bpmn-js/lib/Modeler';
import Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import { ElementFactory } from 'bpmn-js/lib/features/palette/PaletteProvider';
import { Parent } from 'bpmn-js/lib/model/Types';
import { ShapeDto } from 'src/dtos/diagrams/shape.dto';
import { CommonService } from './common.service';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import { ElementLike } from 'diagram-js/lib/model/Types';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';

@Injectable()
export class EditorService {
  commonService: CommonService;
  _enabledModelar?: any;
  constructor(private basicFunctions: FunctionsGroup,
    private injector: Injector) {
    this.commonService = injector.get(CommonService);

  }

  getAllFunctionGroups(): string[] {
    const functionGroups: string[] = [];

    // Iterate over all properties of the basicFunctions object
    return Object.keys(this.basicFunctions);
    // for (const key in this.basicFunctions) {
    //   if (this.basicFunctions.hasOwnProperty(key)) {
    //     const functionGroup: any = this.basicFunctions[key]; // Change the type to 'any'
    //     functionGroups.push(functionGroup);
    //   }
    // }

    // return functionGroups;
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


  disableDiagram1(bpmnJS: Modeler) {
    // Disable editing features
    let eventBus: any = bpmnJS.get('eventBus');
    console.log(eventBus)
    // Disable modeling
    let modeling: any = bpmnJS.get('modeling');
    eventBus.on('element.dblclick', (e: Event) => {
      //e.stopPropagation();
      // e.preventDefault();
    });

    // Disable editing labels
    let directEditing: any = bpmnJS.get('directEditing');
    directEditing.cancel();
    directEditing.activate = function () { };

    // Disable context pad
    let contextPad: any = bpmnJS.get('contextPad');
    contextPad.registerProvider({
      getContextPadEntries: function () {
        return function () { };
      }
    });

    // Disable palette
    let palette: any = bpmnJS.get('palette');
    palette.registerProvider({
      getPaletteEntries: function () {
        return function () { };
      }
    });
  }

  disableDiagram(bpmnJS: Modeler) {
    // Disable editing features
    let eventBus: any = bpmnJS.get('eventBus');
    console.log(eventBus)

    // Disable context pad
    let contextPad: any = bpmnJS.get('contextPad');
    contextPad.registerProvider({
      getContextPadEntries: function () {
        return function () { };
      }
    });

    // Disable palette
    let palette: any = bpmnJS.get('palette');
    palette.registerProvider({
      getPaletteEntries: function () {
        return function () { };
      }
    });

    setTimeout(() => {
      eventBus.on('drag.start', (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      });

      // Disable editing labels
      let directEditing: any = bpmnJS.get('directEditing');
      directEditing.cancel();
      directEditing.activate = function () { };
    }, 500);
  }

  enableEditingFeatures(bpmnJS: Modeler) {
    // Enable editing features
    let eventBus: any = bpmnJS.get('eventBus');
    eventBus.on('element.dblclick', (e: Event) => {
      // Handle double click event
    });

    // Enable editing labels
    let directEditing: any = bpmnJS.get('directEditing');
    directEditing.activate = function () { };

    // Enable context pad
    let contextPad: any = bpmnJS.get('contextPad');
    contextPad.registerProvider({
      getContextPadEntries: function () {

        // Return context pad entries
      }
    });

    // Enable palette
    let palette: any = bpmnJS.get('palette');
    palette.registerProvider({
      getPaletteEntries: function () {
        // Return palette entries
      }
    });
  }

  disableModelar(bpmnJS: Modeler) {
    this._enabledModelar = JSON.parse(JSON.stringify(bpmnJS));
    console.log(this._enabledModelar, bpmnJS)
    this.disableDiagram(bpmnJS);
  }

  enableModelar(bpmnJS: Modeler, xml: string) {
    bpmnJS = this._enabledModelar;
    console.log(bpmnJS)
    //bpmnJS.importXML(xml);
  }

  copyShape(shape: ShapeDto, elementFactory: ElementFactory, modeling: Modeling, elementRegistry: ElementRegistry) {
    const process: ElementLike | undefined = elementRegistry.get('Process');
    const diagram = this.commonService.getDocument();

    const copiedShape = elementFactory.createShape({
      type: shape.Type,
      id: Math.random().toString(36).substring(7),
    });

    modeling.createShape(copiedShape, { x: shape.X + 10, y: shape.Y + 10 }, <Parent>process);

    var copiedShapeDto: ShapeDto = {
      ElementId: copiedShape.id,
      Type: shape.Type,
      X: copiedShape.x,
      Y: copiedShape.y,
      Width: copiedShape.width,
      Height: copiedShape.height,
      Label: shape.Label,
      /*Bounds: {
        X: copiedShape.di.bounds.x,
        Y: copiedShape.di.bounds.y,
        Width: copiedShape.di.bounds.width,
        Height: copiedShape.di.bounds.height
      },*/

      InputParameters: shape.InputParameters ?? [],
      FunctionName: shape.FunctionName ?? "",
      OutputParameters: shape.OutputParameters ?? []
    };
    diagram.Shapes.push(copiedShapeDto);

    return copiedShape;
  }

}
