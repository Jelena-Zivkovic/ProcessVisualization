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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmEventType, Confirmation, ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'cmp-properties-panel',
  standalone: true,
  imports: [InputTextModule, CommonModule, FormsModule, InputTextareaModule, DropdownModule, ConfirmDialogModule],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss'],
  providers: [ConfirmationService]
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

  funcGroup: string = '';

  constructor(injector: Injector, private confirmationService: ConfirmationService, private messageService: MessageService) {
    super(injector);

    this.funcGroups = this.editorService.getAllFunctionGroups();
    this.init();


    if (this.diagram.FuncGroup == '' || this.diagram.FuncGroup == undefined) {
      this.diagram.FuncGroup = 'BasicMath';
    }
  }

  ngAfterContentInit(): void {
  }

  public update(elementId: string | undefined = undefined) {
    if (!elementId) {
      this.element = new ShapeDto();
      return;
    }
    const element = this.diagram.Shapes.find(e => e.ElementId === elementId);
    this.element = element ? Object.assign({}, element) : new ShapeDto();

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

      this.InitInputs(currentFunction != this.element?.FunctionName);
      this.InitOutputs(currentFunction != this.element?.FunctionName);

      setTimeout(() => {
        this.InitVariables();
      }, 500);
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
    this.variables = [{ Name: 'test', Type: 'string', SerialNumber: 0 }];
    if (this.isSignal) {
      return;
    }

    var usedParams: ParameterDto[] = [];
    this.diagram.Shapes?.forEach((shape) => {
      if (shape.Type !== ElementType.Process) {
        shape.InputParameters?.forEach((param) => {
          if (param.Name != '' && !usedParams.find((p) => p.Name === param.Name)) {
            usedParams.push(param);
          }
        });
        shape.OutputParameters?.forEach((param) => {
          if (param.Name != '' && !usedParams.find((p) => p.Name === param.Name)) {
            usedParams.push(param);
          }
        });
      }
    });
    console.log(usedParams);
    this.variables = <ParameterDto[]>usedParams ?? [];
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

      var num: number = 0;
      while (this.selectedFunctionInfo?.parameters.length > this.variables.length) {
        this.element.InputParameters.push({ Type: "boolean", Name: '', SerialNumber: num });
        num = num + 1;
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
          const maxSerialNumber = this.element.InputParameters.reduce((max, param) => {
            return param.SerialNumber > max ? param.SerialNumber : max;
          }, 0);

          this.element.InputParameters.push({ Type: paramTypes[0], Name: '', SerialNumber: maxSerialNumber + 1 });
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
      const maxSerialNumber = this.element.OutputParameters.reduce((max, param) => {
        return param.SerialNumber > max ? param.SerialNumber : max;
      }, 0);

      if (this.isSignal) {
        this.element.OutputParameters.push(this.variables.find(x => x.Type == this.selectedFunctionInfo?.returnType) ?? { Type: this.selectedFunctionInfo?.returnType, Name: '', SerialNumber: maxSerialNumber });
        return;
      }

      this.element.OutputParameters.push({ Type: this.selectedFunctionInfo?.returnType, Name: '', SerialNumber: maxSerialNumber });
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

  onChangeFuncGroup(event: any) {
    if (event == this.diagram.FuncGroup) return;
    if (this.diagram.FuncGroup == '' || this.diagram.FuncGroup == undefined) {
      this.diagram.FuncGroup = event;
      return;
    }

    this.confirmationService.confirm({
      message: '<b>Are you sure you want to change the the function group?</b> <br /><small><i>When changing the function group, shape parameter values ​​are deleted</i></small>',
      header: 'Confirmation',
      icon: PrimeIcons.INFO_CIRCLE,
      accept: () => {
        this.diagram.FuncGroup = event;
      },
      reject: (type: ConfirmEventType) => {
        this.funcGroup = this.diagram.FuncGroup || 'BasicMath';
      }
    });
  }

  apply() {
    this.diagram.Shapes = this.diagram.Shapes.filter(x => x.ElementId != this.element.ElementId);
    this.diagram.Shapes.push(this.element);
    this.commonService.setDocument(this.diagram);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes applied successfully' });
  }

}
