import { CommonModule } from '@angular/common';
import { Component, Injector, Input } from '@angular/core';
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

@Component({
  selector: 'cmp-properties-panel',
  standalone: true,
  imports: [InputTextModule, CommonModule, FormsModule, InputTextareaModule, DropdownModule],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent extends BaseImports {
  @Input() diagram: DiagramCreateDto = new DiagramCreateDto();
  @Input() element: ShapeDto | undefined = new ShapeDto();

  //element: ShapeDto = new ShapeDto();
  inputElement: InputDto = new InputDto();
  elementType: ElementType = ElementType.Process;


  taskFunctions: string[] = [];
  selectedFunctionInfo?: any;
  module: FunctionInfo | undefined = undefined;
  variables: { key: string, value: string }[] = [];
  inputVariables: { key: string, value: string }[] = [];
  outputVariables: { key: string, value: string }[] = [];

  constructor(injector: Injector) {
    super(injector);
    console.log(this.getTaskFunctions());
    this.taskFunctions = this.getTaskFunctions();
    console.log(this.taskFunctions);
    this.editorService.executeFunction("", 'increment', 1).then((res) => {
      console.log('increment', res);
    });


    this.editorService.executeFunction("", 'sum', 1, 2, 3).then((res) => {
      console.log('sum', res);
    });


    this.editorService.executeFunction("", 'divide', 8, 4).then((res) => {
      console.log('divide', res);
    });


    this.editorService.executeFunction("", 'add', 1, 2).then((res) => {
      console.log('add', res);
    });

  }

  public update(elementId: string | undefined = undefined) {
    if (!elementId) {
      this.elementType = ElementType.Process;
      this.element = new ShapeDto();
      return;
    }
    this.element = this.diagram.Shapes.find(e => e.ElementId === elementId) || new ShapeDto();
    switch (this.element?.Type) {
      case ElementType.InputTask:
        this.inputElement = this.element as InputDto;
        break;
      case ElementType.Loop:
      case ElementType.Task:
        this.elementType = ElementType.Task;
        break;
      default:
        this.elementType = ElementType.Process;
        break;
    }

    console.log(this.diagram);
  }

  isDiagram(): boolean {
    return this.element?.Type === ElementType.Process;
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

  getTaskFunctions(): string[] {
    this.editorService.getFunctionInfo('../../functions/function-module.module').then((res) => {
      if (res == undefined) return;
      this.module = res;
      this.taskFunctions = Object.keys(res);
      console.log(this.taskFunctions);
    });
    return [];
  }

  OnChangeFunction(event: any) {
    console.log(event.value);
    this.selectedFunctionInfo = this.module?.[event.value];
    console.log(this.selectedFunctionInfo);
    // this.editorService.executeFunction('../../functions/function-module.module', event, 1, 2).then((res) => {
    //   console.log(event, res);
    // });
  }

  InitInputs() {
    this.selectedFunctionInfo?.parameters
      .forEach((parameter: string) => {
        this.inputVariables.push({ key: parameter, value: '' });
      });
  }
}
