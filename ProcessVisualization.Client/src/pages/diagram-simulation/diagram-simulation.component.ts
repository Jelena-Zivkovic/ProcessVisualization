import { AfterContentInit, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { BaseImports } from 'src/libs/base-imports';
import Modeler from 'bpmn-js/lib/Modeler';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';
import { ElementLike, ShapeLike, Parent } from 'diagram-js/lib/model/Types';
import { Connection, Element, Label } from 'bpmn-js/lib/model/Types';
import { ConnectionDto } from 'src/dtos/diagrams/connection.dto';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import Canvas from 'diagram-js/lib/core/Canvas';
import { PropertiesPanelComponent } from 'src/app/properties-panel/properties-panel.component';
import { Observable, from } from 'rxjs';
import { ShapeDto } from 'src/dtos/diagrams/shape.dto';
import { ElementType } from 'src/enum/element-type.enum';
import { InjectionNames } from 'src/app/editor/bpmn-js/bpmn-js';
import { CustomRenderer } from 'src/app/editor/props-provider/CustomRender';
import { ParameterDto } from 'src/dtos/parameter.dto';
import EventBus from 'diagram-js/lib/core/EventBus';
import { EventBusEventCallback } from 'bpmn-js/lib/BaseViewer';

@Component({
  selector: 'app-diagram-simulation',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, PropertiesPanelComponent],
  templateUrl: './diagram-simulation.component.html',
  styleUrls: ['./diagram-simulation.component.scss']
})
export class DiagramSimulationComponent extends BaseImports implements AfterContentInit {
  @ViewChild('diagramRef', { static: true }) private diagramRef: ElementRef | undefined;
  private bpmnJS!: Modeler;
  diagram: DiagramCreateDto;
  private zoomScale: number = 1;
  logs: string[] = [];
  resultConsole: string[] = [];
  varibales: ParameterDto[] = [];

  documentActions: any;

  constructor(injector: Injector) {
    super(injector);
    this.diagram = this.commonService.getDocument();
    const roomId = this.commonService.getRoomId();

    if (!this.diagram.Id && roomId) {
      this.webapiDocumentsService.create(roomId).subscribe((res) => {
        this.diagram = res.Data ?? new DiagramCreateDto(roomId);
      });
    };
    this.bpmnJS = new Modeler({
      container: this.diagramRef?.nativeElement,
      height: "100%",

      keyboard: {
        bindTo: window
      },
      propertiesPanel: {

      },
      additionalModules: [
        {
          __init__: ['customRenderer'],
          customRenderer: ['type', CustomRenderer]
        }
      ]
    });

    this.initDocumentActions();
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.diagramRef?.nativeElement);
    this.importDiagram(this.initConfigEditor());
    this.initGraph(this.diagram);
    this.editorService.disableDiagram(this.bpmnJS);
  }

  private async initGraph(diagram: DiagramCreateDto) {
    const elementFactory: ElementFactory = await this.bpmnJS.get('elementFactory'),
      elementRegistry: ElementRegistry = await this.bpmnJS.get('elementRegistry'),
      modeling: Modeling = await this.bpmnJS.get('modeling');

    const process: ElementLike | undefined = await elementRegistry.get('Process'),
      startEvent: ElementLike | undefined = await elementRegistry.get('StartEvent');

    if (diagram.Shapes?.length > 0) {
      diagram.Shapes.forEach((element: { Type: any; ElementId: any; X: number; Y: number; }) => {


        const task = elementFactory.createShape({
          type: element.Type,
          id: element.ElementId,
          /* name: 'Task Name',

           businessObject: {
             name: 'Task Name' // This is the label text
           }*/
        });

        const created = modeling.createShape(task, { x: <number>element.X, y: <number>element.Y }, <Parent>process);

      });
    }

    if (diagram.Connections?.length > 0) {
      diagram.Connections.forEach((element: ConnectionDto) => {
        if (element && (<ConnectionDto>element)?.Source && (<ConnectionDto>element)?.Target) {
          var source = <Element>elementRegistry.find(x => x.id == element.Source);
          var target = <Element>elementRegistry.find(x => x.id == element.Target);
          if (source && target) {
            modeling.connect(source, target);
          }
        }
      });
    }
  }

  zoomIn() {
    this.zoomScale = this.zoomScale + 0.1;
    (<Canvas>this.bpmnJS.get('canvas')).zoom(this.zoomScale);
  }

  zoomOut() {
    this.zoomScale = this.zoomScale - 0.1;
    (<Canvas>this.bpmnJS.get('canvas')).zoom(this.zoomScale);
  }

  fitContent() {
    this.zoomScale = 1;
    (<Canvas>this.bpmnJS.get('canvas')).zoom('fit-viewport');
  }


  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }

  initConfigEditor() {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.1.0" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL bpmn0.xsd">
      <bpmn:process id="Process" isExecutable="false">
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>`;
  }



  resizeElement(elementId: string, width: number, height: number) {
    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');
    const shape = elementRegistry.get(elementId);

    if (!shape) {
      return;
    }
    const x = width - shape['width'];
    const y = height - shape['height'];
    const newBounds = {
      x: shape['x'] - x / 2,
      y: shape['y'] - y / 2,
      width: width,  // new width
      height: height  // new height
    };

    // Resize the shape
    const modeling: any = this.bpmnJS.get('modeling');
    modeling.resizeShape(shape, newBounds);
  }

  initDocumentActions() {
    this.documentActions = [
      {
        label: 'Simulate',
        icon: 'pi pi-fw pi-arrows-alt',
        command: () => { this.traverseDiagram1(this.diagram); }
      }
    ];
  }

  traverseDiagram1(diagram: DiagramCreateDto) {
    const startEvents: ShapeDto[] = diagram.Shapes.filter(x => x.Type == ElementType.StartEvent);
    startEvents.forEach(element => {
      this.processElement1(element, diagram, element.ElementId);
    });
  }


  processElement1(element: ShapeDto, diagram: DiagramCreateDto, token: string = "1") {
    this.resizeElement(element.ElementId, element.Width + 20, element.Height + 20);
    setTimeout(() => {
      if (element.Type != ElementType.EndEvent && element.Type != ElementType.StartEvent) {
        this.executeFunction(element, diagram, token);
      }
      console.log("TOKEN: " + token, 'Processing element:', element);
      const outgoingConnections: ConnectionDto[] = diagram.Connections.filter(x => x.Source == element.ElementId) || [];
      if (element.Type != ElementType.Loop) {
        for (const connection of outgoingConnections) {
          const targetElement: ShapeDto | undefined = diagram.Shapes.find(x => x.ElementId == connection.Target) ?? undefined;
          if (targetElement) {
            this.processElement1(targetElement, diagram, token);
          }
        }
      }
      else {
        const targetElement: ShapeDto | undefined = diagram.Shapes.find(x => x.ElementId == element.OutputParameters[0].Value) ?? undefined;
        if (targetElement) {
          this.processElement1(targetElement, diagram, token);
        }
      }
      this.resizeElement(element.ElementId, element.Width, element.Height);

    }, 1000);
  }

  executeFunction(element: ShapeDto, diagram: DiagramCreateDto, token: string = "1") {
    var module = "BasicMath";
    switch (element?.Type) {
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

    if (element.Type != ElementType.InputTask) {
      if (element.Type == ElementType.OutputTask) {
        if (element.OutputParameters.length > 0) {
          if (element.InputParameters.length == 0) {
            element.InputParameters.push({ Name: element.OutputParameters[0].Name, Type: element.OutputParameters[0].Type, Value: element.OutputParameters[0].Value, SerialNumber: element.OutputParameters[0].SerialNumber });
          }
          else {
            element.InputParameters[0].Name = element.OutputParameters[0].Name;
          }
        }
      }
      element.InputParameters.forEach((input) => {
        var value = this.varibales?.find(x => x.Name == input.Name);
        if (input) {
          input.Value = value?.Value ?? input.Value;
        }
      });
    }

    return this.editorService.executeFunction(module, element.FunctionName, ...(element.InputParameters.map(x => this.cast(x.Value, x)))).then((res) => {
      element.OutputParameters.forEach((output, index) => {
        output.Value = res;
        var variable = this.varibales.find(x => x.Name == output.Name);
        if (variable) {
          variable.Value = this.cast(res, output);
        }
        else {
          var name = output.Name;
          if (element.Type == ElementType.OutputTask || element.Type == ElementType.InputTask) {
            name = element.InputParameters[0].Name;
          }
          this.varibales.push({ Name: name, Type: output.Type, Value: res, SerialNumber: output.SerialNumber });
        }

        this.log(element, this.diagram, token);
      });
    });
  }

  cast(res: any, parm: ParameterDto) {
    if (parm.Type == "number") {
      return Number(res);
    }
    if (parm.Type == "boolean") {
      return Boolean(res);
    }
    return res;

  }

  log(element: ShapeDto, diagram: DiagramCreateDto, token: string = "1") {
    var message = token + " - " + element.ElementId + " - ";
    switch (element.Type) {
      case ElementType.StartEvent:
        message += "Start Event";
        break;
      case ElementType.EndEvent:
        message += "End Event";
        break;
      case ElementType.InputTask:
        message += "Input - " + "variable" + element.InputParameters[0].Name + ", value: " + element.InputParameters[0].Value;
        break;
      case ElementType.OutputTask:
        message += "Output - " + "variable" + element.OutputParameters[0].Name + ", value: " + element.OutputParameters[0].Value;
        this.resultConsole.push((element.OutputParameters[0].Value ?? "").toString());
        break;
      case ElementType.Task:
        message += "Task - function: " + element.FunctionName + ",input: " + element.InputParameters[0].Name + ", value: " + element.InputParameters[0].Value + ", output: " + element.OutputParameters[0].Name + ", value: " + element.OutputParameters[0].Value;
        break;
      case ElementType.Loop:
        message += "Loop - " + "variable" + element.InputParameters[0].Name + ", value: " + element.InputParameters[0].Value + ", " + "variable" + element.OutputParameters[0].Name + ", value: " + element.OutputParameters[0].Value;
        break;
      default:
        message += "Unknown Element";
        break;

    }

    this.logs.push((new Date()).toString() + " " + message);
  }
}
