import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FunctionInfo } from 'src/dos/function-info';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';
import { InputDto } from 'src/dtos/diagrams/elements/input.dto';
import { ShapeDto } from 'src/dtos/diagrams/shape.dto';
import { ElementType } from 'src/enum/element-type.enum';
import { BaseImports } from 'src/libs/base-imports';
import { DropdownModule } from 'primeng/dropdown';
import { ParameterDto } from 'src/dtos/parameter.dto';
import { ConnectionDto } from 'src/dtos/diagrams/connection.dto';

@Component({
  selector: 'cmp-properties-panel',
  standalone: true,
  imports: [InputTextModule, CommonModule, FormsModule, InputTextareaModule, DropdownModule],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent extends BaseImports implements AfterContentInit {
  @Input() diagram: DiagramCreateDto = new DiagramCreateDto();
  element: ShapeDto = new ShapeDto();

  inputElement: InputDto = new InputDto();

  functions: string[] = [];
  module: FunctionInfo | undefined = undefined;
  funcGroups: string[] = [];

  selectedFunctionInfo?: any;
  variables: ParameterDto[] = [];
  isSignal: boolean = false;

  constructor(injector: Injector) {
    super(injector);

    this.funcGroups = this.editorService.getAllFunctionGroups();
    this.init();


    if (this.diagram.FuncGroup == '' || this.diagram.FuncGroup == undefined) {
      this.diagram.FuncGroup = 'BasicMath';
    }
    /*
        this.editorService.executeFunction(this.diagram.ModulePath, 'increment', 1).then((res) => {
          console.log('increment', res);
        });


        this.editorService.executeFunction(this.diagram.ModulePath, 'sum', 1, 2, 3).then((res) => {
          console.log('sum', res);
        });


        this.editorService.executeFunction(this.diagram.ModulePath, 'divide', 8, 4).then((res) => {
          console.log('divide', res);
        });


        this.editorService.executeFunction(this.diagram.ModulePath, 'add', 1, 2).then((res) => {
          console.log('add', res);
        });*/

  }
  ngAfterContentInit(): void {
  }

  public update(elementId: string | undefined = undefined) {
    if (!elementId) {
      this.element = new ShapeDto();
      return;
    }
    this.element = this.diagram.Shapes.find(e => e.ElementId === elementId) || new ShapeDto();
    this.init();
  }

  getTaskFunctions(module: string) {
    return this.editorService.getFunctionInfo(module).then((res) => {
      if (res == undefined) return;
      this.module = res;
      this.functions = Object.keys(res);
    });
  }

  OnChangeFunction(event: any) {
    this.selectedFunctionInfo = this.module?.[event.value];
    this.InitVariables();
    this.InitInputs();
    this.InitOutputs();
  }

  init() {
    var currentFunction = this.element?.FunctionName;
    this.InitFunction().then(() => {
      this.InitVariables();
      this.InitInputs(currentFunction != this.element?.FunctionName);
      this.InitOutputs(currentFunction != this.element?.FunctionName);
    });
  }

  InitFunction() {
    var module = "BasicMath";
    switch (this.element?.Type) {
      case ElementType.Task:
        module = this.diagram.FuncGroup ?? 'BasicMath';
        break;
      case ElementType.Loop:
        module = 'Conditional';
        break;
      default:
        module = 'BasicFunctions';
        break;
    }

    return this.getTaskFunctions(module).then((res) => {
      if (this.element) {
        if (this.element.FunctionName == undefined || this.element.FunctionName == '') {
          this.element.FunctionName = this.functions[0];
        }
        this.selectedFunctionInfo = this.module?.[this.element.FunctionName];
      }
    });
  }

  InitVariables() {
    this.variables = [];
    if (this.isSignal) {
      return;
    }

    const usedParams: ParameterDto[] = [];
    this.diagram.Shapes?.forEach((shape) => {
      if (shape.Type !== ElementType.Process) {
        shape.InputParameters?.forEach((param) => {
          if (!usedParams.find((p) => p.Name === param.Name)) {
            usedParams.push(param);
          }
        });
        shape.OutputParameters?.forEach((param) => {
          if (!usedParams.find((p) => p.Name === param.Name)) {
            usedParams.push(param);
          }
        });
      }
    });

    this.variables = usedParams;
  }

  InitInputs(isFunctionChange: boolean = true) {
    if (this.element == undefined) {
      return;
    }
    if (!isFunctionChange) {
      return;
    }

    this.variables = [];
    this.element.InputParameters = [];

    if (this.isSignal) {
      const outgoingConnections: ConnectionDto[] = this.diagram.Connections.filter(x => x.Target == this.element?.ElementId) || [];
      for (const connection of outgoingConnections) {
        const targetElement: ShapeDto | undefined = this.diagram.Shapes.find(x => x.ElementId == connection.Source) ?? undefined;
        if (targetElement) {
          targetElement.OutputParameters.forEach((param) => {
            if (!this.variables.find(x => x.Name == param.Name)) {
              this.element.InputParameters.push(param);
            }
          });
        }
      }

      while (this.selectedFunctionInfo?.parameters.length > this.variables.length) {
        this.element.InputParameters.push({ Type: "boolean", Name: '' });
      }

      if (this.variables.length > this.selectedFunctionInfo?.parameters.length) {
        alert('There are more connections than expected. Please check the diagram.');
      }
      return;
    }

    var existParameters = [...(this.variables)];
    if (this.element) {
      this.selectedFunctionInfo?.parameters
        .forEach((parameter: "number" | "string" | "boolean" | `"number" | "boolean"` | `"number" | "string" | "boolean"` | `"number" | "string"` | `"string" | "boolean"` = "number") => {
          var paramTypes: any[] = parameter.split('|').map(x => x.trim());
          if (existParameters.length > 0) {
            var param = existParameters.find(x => parameter.includes(x.Type));
            if (param) {
              this.element.InputParameters.push(param);
              existParameters = existParameters.filter(x => x != param);
              return;
            }
          }
          this.element.InputParameters.push({ Type: paramTypes[0], Name: '' });
        });
      return;
    }
  }

  InitOutputs(isFunctionChange: boolean = true) {
    if (this.element == undefined || !isFunctionChange) {
      return;
    }

    this.element.OutputParameters = [];
    if (this.element) {
      if (this.isSignal) {
        this.element.OutputParameters.push(this.variables.find(x => x.Type == this.selectedFunctionInfo?.returnType) ?? { Type: this.selectedFunctionInfo?.returnType, Name: '' });
        return;
      }

      this.element.OutputParameters.push({ Type: this.selectedFunctionInfo?.returnType, Name: '' });
      return;
    }
  }

  getUsedParams(element: ShapeDto) {
    const outgoingConnections: ConnectionDto[] = this.diagram.Connections.filter(x => x.Target == element.ElementId) || [];
    for (const connection of outgoingConnections) {
      const targetElement: ShapeDto | undefined = this.diagram.Shapes.find(x => x.ElementId == connection.Source) ?? undefined;

      if (targetElement) {
        targetElement.OutputParameters?.forEach((param) => {
          if (!this.variables.find(x => x.Name == param.Name)) {
            this.variables.push(param);
          }
        });
        this.getUsedParams(targetElement);
      }
    }

  }

  isDiagram(): boolean {
    return (this.element == undefined || this.element?.Type === ElementType.Process);
  }

  isInput(): boolean {
    return this.element?.Type === ElementType.InputTask;
  }

  isOutput(): boolean {
    return this.element?.Type === ElementType.OutputTask;
  }

  isLoop(): boolean {
    return this.element?.Type === ElementType.Loop;
  }

  isTask(): boolean {
    return this.element?.Type === ElementType.Task;
  }

  isEndOrStart(): boolean {
    return this.element?.Type === ElementType.EndEvent || this.element?.Type === ElementType.StartEvent;
  }
}
