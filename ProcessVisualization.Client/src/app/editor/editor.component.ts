import { Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import type eventBus from "bpmn-js/lib/NavigatedViewer"
import type InternalEvent from "bpmn-js/lib/NavigatedViewer"
import Modeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import EventBus from 'diagram-js/lib/core/EventBus';

import { from, Observable, of } from 'rxjs';
import { ElementLike, Parent } from 'diagram-js/lib/model/Types';
import { Connection, Element } from 'bpmn-js/lib/model/Types';
import { getLocaleDirection } from '@angular/common';
import { InitEditableRow } from 'primeng/table';
import PaletteProvider, { Palette } from 'bpmn-js/lib/features/palette/PaletteProvider';
import { HeaderComponent } from '../header/header.component';
import { Shape } from 'bpmn-js/lib/model/Types';
import { ElementDto } from 'src/dtos/diagrams/element.dto';
import { ShapeDto } from 'src/dtos/diagrams/shape.dto';
import { ConnectionDto } from 'src/dtos/diagrams/connection.dto';
import { DefaultElement } from 'src/enum/default-element.enum';
import { DiagramDto } from 'src/dtos/diagrams/diagram.dto';
import { MenubarModule } from 'primeng/menubar';
import { SaveSVGResult, SaveXMLResult } from 'bpmn-js/lib/BaseViewer';


@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MenubarModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnChanges {
  private bpmnJS!: Modeler;
  documentActions: any;

  // retrieve DOM element reference
  @ViewChild('diagramRef', { static: true }) private diagramRef: ElementRef | undefined;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;
  constructor() {
    this.bpmnJS = new Modeler({
      container: this.diagramRef?.nativeElement,
      height: "100%",
      propertiesPanel: {
        parent: 'propertiesRef'
      },
      //moddleExtensions: {
      //custom: custom
      //}
    });
    this.initDocumentActions();
    console.log(this.bpmnJS)
  }
  ngAfterContentInit(): void {
    // attach BpmnJS instance to DOM element
    this.bpmnJS.attachTo(this.diagramRef?.nativeElement);
    this.importDiagram(this.initConfigEditor());
    //this.createGraph();
    this.createGraph12();
    //this.importPalette();

    const commandStack: any = this.bpmnJS.get('commandStack');
    const eventBus: EventBus = this.bpmnJS.get('eventBus');
    /*
        commandStack.on('commandStack.changed', (event: any) => {
          // Handle diagram changes here
          console.log('Diagram changed:', event);
        });*/
    eventBus.on('commandStack.changed', (event: Event) => {
      // save XML
      console.log('Diagram changed 11:', event);
      console.log(Object.values(DefaultElement))

      var defaultElements = Object.values(DefaultElement);
      const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');
      var diagram: DiagramDto = new DiagramDto();
      elementRegistry.getAll().filter(y => !defaultElements.find(z => z == y.id)).forEach(x => {
        var el: ElementDto = {
          id: x.id,
          businessObject: undefined,//x.businessObject,
          labelId: (<Element>x).label?.id,
          labelIds: (<Element>x).labels.map(x => x.id),
          //parent: (<Element>x).parent,
          //incoming: (<Element>x).incoming,
          //outgoing: (<Element>x).outgoing,
          type: (<Element>x).type
        };

        if ((<Shape>x).x != undefined) {
          (<ShapeDto>el).x = (<Shape>x).x;
          (<ShapeDto>el).y = (<Shape>x).y;
          (<ShapeDto>el).width = (<Shape>x).width;
          (<ShapeDto>el).height = (<Shape>x).height;

          diagram.Shapes.push(<ShapeDto>el);
        }

        if ((<Connection>x).target) {
          (<ConnectionDto>el).target = (<Connection>x).target?.id;
          (<ConnectionDto>el).source = (<Connection>x).source?.id;
          (<ConnectionDto>el).waypoints = (<Connection>x).waypoints.map(y => {
            return {
              x: y.x,
              y: y.y
            }
          });
          diagram.Connections.push(<ConnectionDto>el);
        }
        return el;
      });
      console.log(diagram, elementRegistry.getAll());
    });
    //commandStack.off('changed');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   */
  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }
  private async createGraph() {
    // (1) Get the modules
    const elementFactory: ElementFactory = await this.bpmnJS.get('elementFactory'),
      elementRegistry: ElementRegistry = await this.bpmnJS.get('elementRegistry'),
      modeling: Modeling = await this.bpmnJS.get('modeling');

    //console.log(Modeling)

    // (2) Get the existing process and the start event - ElementLike | undefined
    //const process: any = await elementFactory.createRoot({ type: 'bpmn:Process' }),
    //startEvent = await elementFactory.createShape({ type: 'bpmn:StartEvent' });
    const process: ElementLike | undefined = await elementRegistry.get('Process'),
      startEvent: ElementLike | undefined = await elementRegistry.get('StartEvent');

    // (3) Create a new diagram shape
    const task = elementFactory.createShape({
      type: 'bpmn:Task', id: 'task1'
    });
    //console.log(process, task, startEvent)
    // (4) Add the new task to the diagram
    modeling.createShape(task, { x: 400, y: 100 }, <Parent>process);
    /*if (process) {
      await modeling.createShape(startEvent, { x: 200, y: 100 }, <Parent>process);
      await modeling.createShape(task, { x: 400, y: 100 }, <Parent>process);
    }*/

    // You can now access the new task through the element registry
    //console.log(await elementRegistry.get(task.id)); // Shape { "type": "bpmn:Task", ... }

    // (5) Connect the existing start event to new task
    if (startEvent) {
      modeling.connect(<Element>startEvent, task);
    }
  }
  //

  private async createGraph12(diagram?: DiagramDto) {
    var res = {
      "Shapes": [
        {
          "id": "task1",
          "labelIds": [],
          "type": "bpmn:Task",
          "x": 300,
          "y": 100,
          "width": 100,
          "height": 80
        },
        {
          "id": "task2",
          "labelIds": [],
          "type": "bpmn:Task",
          "x": 500,
          "y": 100,
          "width": 100,
          "height": 80
        },
        {
          "id": "task3",
          "labelIds": [],
          "type": "bpmn:Task",
          "x": 700,
          "y": 100,
          "width": 100,
          "height": 80
        }
      ],
      "Connections": [
        {
          "id": "Flow_1b69r47",
          "labelIds": [],
          "type": "bpmn:SequenceFlow",
          "target": "task1",
          "source": "task2",
          "waypoints": [
            {
              "x": 218,
              "y": 100
            },
            {
              "x": 350,
              "y": 100
            }
          ]
        }
      ]
    };

    const elementFactory: ElementFactory = await this.bpmnJS.get('elementFactory'),
      elementRegistry: ElementRegistry = await this.bpmnJS.get('elementRegistry'),
      modeling: Modeling = await this.bpmnJS.get('modeling');

    const process: ElementLike | undefined = await elementRegistry.get('Process'),
      startEvent: ElementLike | undefined = await elementRegistry.get('StartEvent');

    res.Shapes.forEach(element => {
      const task = elementFactory.createShape({
        type: element.type,
        id: element.id,
      });

      modeling.createShape(task, { x: <number>element.x, y: <number>element.y }, <Parent>process);
    });

    res.Connections.forEach(element => {
      if (element && (<ConnectionDto>element)?.source && (<ConnectionDto>element)?.target) {
        var source = <Element>elementRegistry.find(x => x.id == element.source);
        var target = <Element>elementRegistry.find(x => x.id == element.target);
        if (source && target) {
          modeling.connect(source, target);
        }
      }
    });
  }

  private importPalette() {
    // Assuming you have access to the BPMN editor API

    // Get the default palette provider
    const paletteProvider: any = this.bpmnJS.get('paletteProvider');

    // Define a custom task palette provider
    const that = this;
    const customTaskPaletteProvider: any = {
      getPaletteEntries: function (/* element */) {
        return {
          'create.task': {
            group: 'activity',
            className: 'bpmn-icon-task',
            title: 'Task',
            action: {
              dragstart: function (event: any, element: any) {
                const shape = that.createTask(event, element);
                //.start(event, shape, element);
              },
              click: function (event: any, element: any) {
                const shape = that.createTask(event, element);
                //create.start(event, shape, element);
              }
            }
          }
          // Optionally, you can include more task-related symbols as needed.
        };
      }
    };

    // Override the original palette provider with the custom task palette provider
    paletteProvider.registerProvider('taskPalette', customTaskPaletteProvider);

  }

  // Define the function to create a task element
  createTask(event: any, element: any) {
    const elementFactory: ElementFactory = this.bpmnJS.get('elementFactory');
    const shape = elementFactory.create('shape', { type: 'bpmn:Task' });

    //create.start(event, shape, element);
  }


  undo() {
    const commandStack: any = this.bpmnJS.get('commandStack');

    if (commandStack.canUndo()) {
      commandStack.undo()
    }
  }

  redo() {
    const commandStack: any = this.bpmnJS.get('commandStack');

    if (commandStack.canRedo()) {
      commandStack.redo()
    }
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

  initDocumentActions() {
    this.documentActions = [
      {
        label: 'Export to xml',
        icon: 'pi pi-fw pi-file-export',
        command: () => { this.exportToXml() }
      },
      {
        label: 'Export to svg',
        icon: 'pi pi-fw pi-file-export',
        command: () => { this.exportToSvg() }
      }
    ];
  }

  private exportToXml() {
    this.bpmnJS.saveXML().then((value: SaveXMLResult) => {
      if (value.error) {
        alert("Export error: " + value.error)
      }
      else if (value.xml) {
        var blob = new Blob([value.xml], { type: 'image/svg+xml' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.bpmn';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  }

  private exportToSvg() {
    this.bpmnJS.saveSVG().then((value: SaveSVGResult) => {
      var blob = new Blob([value.svg], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

