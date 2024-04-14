import { Component, ElementRef, Injector, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

import { from, ignoreElements, Observable, of } from 'rxjs';
import { ElementLike, ShapeLike, Parent } from 'diagram-js/lib/model/Types';
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
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';
import { MenubarModule } from 'primeng/menubar';
import { SaveSVGResult, SaveXMLResult } from 'bpmn-js/lib/BaseViewer';
import { InjectionNames, OriginalPaletteProvider } from './bpmn-js/bpmn-js';
import { CustomPaletteProvider } from './props-provider/CustomPaletteProvider';
import { CustomPropsProvider } from './props-provider/CustomPropsProvider';
//import {BpmnPropertiesPanelModule, } from 'bpmn-js-properties-panel';
//import TokenSimulationModule from 'bpmn-js-token-simulation/lib/viewer';
//const PropertiesModule = require('bpmn-js-properties-panel');
//import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import { BaseImports } from 'src/libs/base-imports';
import { WebapiDocumentsService } from 'src/services/webapi-documents.service';
import { InputTextModule } from 'primeng/inputtext';
import { SignalREditorService } from 'src/services/siganlrhub-editor.service';
import { ButtonModule } from 'primeng/button';
import { AppModule } from '../app.module';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel.component';
import { SharedDo } from 'src/dos/shared/shared.do';
//declare var propertiesPanel: any;
//declare var BpmnPropertiesPanelModule: any;
//declare var BpmnPropertiesProviderModule: any;

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MenubarModule, ButtonModule, PropertiesPanelComponent],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends BaseImports implements OnInit {
  @ViewChild('propertiesPanel') propertiesPanel: PropertiesPanelComponent = new PropertiesPanelComponent();
  private bpmnJS!: Modeler;
  private zoomScale: number = 1;
  diagram: DiagramCreateDto;
  email: string = "";
  group: string = "";
  selectedElement: any;

  documentActions: any;

  @ViewChild('diagramRef', { static: true }) private diagramRef: ElementRef | undefined;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;
  constructor(injector: Injector, private signalRService: SignalREditorService) {
    super(injector);
    this.diagram = this.commonService.getDocument();
    const roomId = this.commonService.getRoomId();
    this.email = this.authenticationService.getLoginData().Email;
    console.log(this.diagram)

    if (!this.diagram.Id && roomId) {
      this.webapiDocumentsService.create(roomId).subscribe((res) => {
        this.diagram = res.Data ?? new DiagramCreateDto(roomId);
      });
    }

    this.sharedService.on("123456", this.updateGraph.bind(this))

    this.group = `${roomId}.${this.diagram.Id}`;
    console.log(this.diagram)
    this.bpmnJS = new Modeler({
      container: this.diagramRef?.nativeElement,
      height: "100%",
      propertiesPanel: {
        parent: this.propertiesRef?.nativeElement
      },
      moddleExtensions: {
        //custom: customModdle
      },
      additionalModules: [
        //PropertiesPanelModule,
        //BpmnPropertiesPanelModule,
        //PropertiesModule.BpmnPropertiesProviderModule,
        //TokenSimulation,
        //{ [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        //{ [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },

        { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
        { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
      ]
    });
    this.initDocumentActions();
  }

  ngOnInit(): void {
    this.signalRService.startConnection(this.group);
    this.signalRService.addReceiveMessageListener();

    // this.bpmnJS.on('element.click', (event: any) => {
    //   this.handleClickEvent(event.element);
    // });

    const that = this;

    /*this.bpmnJS.on('element.click', (event: any) => {
      console.log('element.click')
      const elementFactory: ElementFactory = that.bpmnJS.get('elementFactory'),
        elementRegistry: ElementRegistry = that.bpmnJS.get('elementRegistry'),
        modeling: Modeling = that.bpmnJS.get('modeling');
      var shape = elementRegistry.get("Activity_0o3g0e1");
      console.log(shape, elementFactory)
      //this.handleClickEvent(event.element);

      console.log(event, that.bpmnJS)
      var label = elementFactory.createLabel({
        id: 'newLabelId',
        businessObject: elementFactory.create('label', { type: "bpmn:TextAnnotation", text: 'Your Label Text' })
      });

      // Add the label to the shape
      if (shape) {
        var llp = modeling.createLabel(<Element>shape, { x: 100, y: 100 }, label);
        console.log(llp);
      }

      // Refresh the diagram to see the changes
      // Canvas.addLabel(label, shape);
    });*/

    this.bpmnJS.on('element.changed', function (event: any) {
      console.log('element.changed 1', event.element);
    });
  }

  ngAfterContentInit(): void {
    // attach BpmnJS instance to DOM element
    this.bpmnJS.attachTo(this.diagramRef?.nativeElement);
    this.importDiagram(this.initConfigEditor());
    this.createGraph12(this.diagram);

    const commandStack: any = this.bpmnJS.get('commandStack');
    this.onChange();
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
    this.signalRService.removeFromGroup(this.group);
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }

  private async createGraph() {
    const elementFactory: ElementFactory = await this.bpmnJS.get('elementFactory'),
      elementRegistry: ElementRegistry = await this.bpmnJS.get('elementRegistry'),
      modeling: Modeling = await this.bpmnJS.get('modeling');

    const process: ElementLike | undefined = await elementRegistry.get('Process'),
      startEvent: ElementLike | undefined = await elementRegistry.get('StartEvent');

    const task = elementFactory.createShape({
      type: 'bpmn:Task', id: 'task1'
    });

    modeling.createShape(task, { x: 400, y: 100 }, <Parent>process);
    /*if (process) {
      await modeling.createShape(startEvent, { x: 200, y: 100 }, <Parent>process);
      await modeling.createShape(task, { x: 400, y: 100 }, <Parent>process);
    }*/

    if (startEvent) {
      modeling.connect(<Element>startEvent, task);
    }
  }

  private updateGraph(data: SharedDo) {
    var diagram: DiagramCreateDto = new DiagramCreateDto();
    if (!data) {
      diagram = this.diagram;
    }
    else if ((<SharedDo>data).Data) {
      diagram = (<SharedDo>data).Data;
    }
    console.log(diagram, this.diagram);
    const id = this.diagram.Id;
    this.diagram = data.Data;
    this.diagram.Id = id;
    console.log(diagram, this.diagram);

    this.commonService.setDocument(this.diagram);

    console.log(diagram, this.diagram, this.commonService.getDocument());
  }

  private async createGraph12(data?: DiagramCreateDto) {
    /*var res = {
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
};*/

    const elementFactory: ElementFactory = await this.bpmnJS.get('elementFactory'),
      elementRegistry: ElementRegistry = await this.bpmnJS.get('elementRegistry'),
      modeling: Modeling = await this.bpmnJS.get('modeling');

    const process: ElementLike | undefined = await elementRegistry.get('Process'),
      startEvent: ElementLike | undefined = await elementRegistry.get('StartEvent');

    if (this.diagram.Shapes?.length > 0) {
      this.diagram.Shapes.forEach((element: { Type: any; Id: any; X: number; Y: number; }) => {
        const task = elementFactory.createShape({
          type: element.Type,
          id: element.Id,
        });

        modeling.createShape(task, { x: <number>element.X, y: <number>element.Y }, <Parent>process);
      });
    }

    if (this.diagram.Connections?.length > 0) {
      this.diagram.Connections.forEach((element: ConnectionDto) => {
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

  createTask(event: any, element: any) {
    const elementFactory: ElementFactory = this.bpmnJS.get('elementFactory');
    const shape = elementFactory.create('shape', { type: 'bpmn:Task' });

    //create.start(event, shape, element);
  }


  undo() {
    const commandStack: any = this.bpmnJS.get('commandStack');

    if (commandStack.canUndo()) {
      commandStack.undo();
    }
  }

  redo() {
    const commandStack: any = this.bpmnJS.get('commandStack');

    if (commandStack.canRedo()) {
      commandStack.redo();
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
      },
      {
        label: 'Save',
        icon: 'pi pi-fw pi-plus',
        command: () => { this.save() }
      },
      {
        label: 'Zoom in',
        icon: 'pi pi-fw pi-plus',
        command: () => { this.zoomIn() }
      },
      {
        label: 'Zoom out',
        icon: 'pi pi-fw pi-minus',
        command: () => { this.zoomOut() }
      },
      {
        label: 'Fit content',
        icon: 'pi pi-fw pi-arrows-alt',
        command: () => { this.fitContent() }
      },
      {
        label: 'Send mess',
        icon: 'pi pi-fw pi-arrows-alt',
        command: () => { this.signalRService.sendMessageToGroup(this.group, this.email, this.diagram); }
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

  private onChange() {
    const eventBus: EventBus = this.bpmnJS.get('eventBus');
    var autoSave: boolean = false;

    eventBus.on('commandStack.changed', (event: Event) => {
      autoSave = true;

      this.updateLocal();
      this.signalRService.sendMessageToGroup(this.group, this.email, this.diagram);
    });

    setInterval(() => {
      if (autoSave) {
        this.save();
        autoSave = false;
      }
    }, 15000);
  }

  private save() {
    this.updateLocal();
    this.webapiDocumentsService.save(this.diagram).subscribe(res => {
      console.log("SAVE", this.diagram.Id, res)
      this.commonService.setDocument(res.Data ?? this.diagram);
      this.diagram.Id = res.Data?.Id;
    })
  }

  updateLocal() {
    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');
    this.diagram.Shapes = [];
    this.diagram.Connections = [];
    var defaultElements = Object.values(DefaultElement);
    elementRegistry.getAll().filter(y => !defaultElements.find(z => z == y.id)).forEach(x => {
      var el: ElementDto = {
        Id: x.id,
        businessObject: undefined,//x.businessObject,
        labelId: (<Element>x).label?.id,
        labelIds: (<Element>x).labels.map(x => x.id),
        //parent: (<Element>x).parent,
        //incoming: (<Element>x).incoming,
        //outgoing: (<Element>x).outgoing,
        Type: (<Element>x).type
      };

      if ((<Shape>x).x != undefined) {
        (<ShapeDto>el).X = (<Shape>x).x;
        (<ShapeDto>el).Y = (<Shape>x).y;
        (<ShapeDto>el).Width = (<Shape>x).width;
        (<ShapeDto>el).Height = (<Shape>x).height;

        this.diagram.Shapes.push(<ShapeDto>el);
      }

      if ((<Connection>x).target) {
        (<ConnectionDto>el).Target = (<Connection>x).target?.id;
        (<ConnectionDto>el).Source = (<Connection>x).source?.id;
        (<ConnectionDto>el).WayPoints = (<Connection>x).waypoints.map(y => {
          return {
            x: y.x,
            y: y.y
          }
        });
        this.diagram.Connections.push(<ConnectionDto>el);
      }
      return el;
    });
  }
  /*
    handleClickEvent(element: any) {
      // Handle click event here
      console.log('Element clicked:', element);
      this.propertiesPanel.update(element);

      var selectedElement = (<any>this.bpmnJS.get('selection')).get();
      console.log('element.changed 2', selectedElement);

      this.redrawElement(selectedElement[0]);
    }

    redrawElement(element: any) {
      // Get the renderer
      const elementRegistry = this.bpmnJS.get('elementRegistry');
      const elementRegistryEntry = (<any>elementRegistry).get(element.id);
      // Get the BpmnRenderer
      const bpmnRenderer: any = this.bpmnJS.get('bpmnRenderer');


      // Redraw the element
      //var l = bpmnRenderer.drawShape(element, (<any>this.bpmnJS.get('canvas'))?.getRootElement());
    }
    */
}

