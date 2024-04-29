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
import { Connection, Element, Label } from 'bpmn-js/lib/model/Types';
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
import { SignalREditorService } from 'src/services/siganlrhub-editor.service';
import { ButtonModule } from 'primeng/button';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel.component';
import { SharedDo } from 'src/dos/shared/shared.do';
import { LabelDto } from 'src/dtos/diagrams/label.dto';
import IncomingConnectionNumberRule from './rules/incoming-connection-number.rule';
import { CustomRenderer } from './props-provider/CustomRender';
import { ElementType } from 'src/enum/element-type.enum';
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
  @ViewChild('propertiesPanel') propertiesPanel!: PropertiesPanelComponent;
  private bpmnJS!: Modeler;
  private zoomScale: number = 1;
  diagram: DiagramCreateDto;
  email: string = "";
  group: string = "";
  selectedElement: ShapeDto | undefined;

  documentActions: any;

  @ViewChild('diagramRef', { static: true }) private diagramRef: ElementRef | undefined;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;
  constructor(injector: Injector, private signalRService: SignalREditorService) {
    super(injector);
    this.diagram = this.commonService.getDocument();
    const roomId = this.commonService.getRoomId();
    this.email = this.authenticationService.getLoginData().Email;

    if (!this.diagram.Id && roomId) {
      this.webapiDocumentsService.create(roomId).subscribe((res) => {
        this.diagram = res.Data ?? new DiagramCreateDto(roomId);
      });
    }
    this.group = `${roomId}.${this.diagram.Id}`;
    this.bpmnJS = new Modeler({
      container: this.diagramRef?.nativeElement,
      height: "100%",
      propertiesPanel: {
        parent: this.propertiesRef?.nativeElement
      },
      moddleExtensions: {
      },
      additionalModules: [
        { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
        { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
        {
          __init__: ['incomingConnectionNumberRule'],
          incomingConnectionNumberRule: ['type', IncomingConnectionNumberRule]
        },
        {
          __init__: ['customRenderer'],
          customRenderer: ['type', CustomRenderer]
        }
      ]
    });
    this.initDocumentActions();
    this.sharedService.on("ReceiveMessage123", this.updateGraph.bind(this))
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.diagramRef?.nativeElement);
    this.importDiagram(this.initConfigEditor());
    this.initGraph(this.diagram).then(() => {
      this.onChange();

      this.signalRService.startConnection(this.group);

      var that = this;
      this.bpmnJS.on('element.changed', function (event: any) {
        that.bpmnJS.saveXML().then((value: SaveXMLResult) => {
          that.diagram.Xml = value.xml ?? that.diagram.Xml;
          that.signalRService.sendMessageToGroup(that.group, that.email, that.diagram);
        });
      });

      this.bpmnJS.on('element.click', (event: any) => {
        console.log('element.click', event.element.id)
        this.propertiesPanel.update(event.element.id);
        //this.selectedElement = this.diagram.Shapes.find(x => x.ElementId == event.element.id);
      });
    });

  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
    this.signalRService.removeFromGroup(this.group);
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }

  private updateGraph(data: SharedDo) {
    if (data?.Data?.id == this.diagram.Id) {
      this.bpmnJS.importXML(data.Data.xml).then((res) => {
        this.diagram.Xml = data.Data.xml;
        this.commonService.setDocument(this.diagram);
      });
    }
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
      },
      // {
      //   label: 'Simulate',
      //   icon: 'pi pi-fw pi-arrows-alt',
      //   command: () => { this.traverseDiagram1(this.diagram); }
      // }
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
        a.download = this.diagram.Name + '.bpmn';
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
      a.download = this.diagram.Name + '.svg';
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

  changeColorOfShapes() {
    const elementFactory: ElementFactory = this.bpmnJS.get('elementFactory'),
      elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry'),
      modeling: Modeling = this.bpmnJS.get('modeling');

    this.diagram.Shapes.forEach((element: { Type: any; ElementId: any; X: number; Y: number; }) => {
      const task = elementFactory.createShape({
        type: element.Type,
        id: element.ElementId,
      });

      // { stroke: 'red', fill: 'yellow' }modeling.createShape(task, { x: <number>element.X, y: <number>element.Y }, <Parent><Element>process, { stroke: 'red', fill: 'yellow' });
      // Add the missing import statement

      const label = elementFactory.createLabel({
        id: task.id + '_label',
        businessObject: elementFactory.create('label', { type: "label", text: 'Your Label Text' })
      });

      // Add the label to the shape
      if (task) {
        modeling.createLabel(task, { x: task.x, y: task.y + 20 }, label);
      }


      // Change the color of the shape
    });
  }

  private onChange() {
    const eventBus: EventBus = this.bpmnJS.get('eventBus');
    var autoSave: boolean = false;

    eventBus.on('commandStack.changed', (event: Event) => {
      autoSave = true;
    });

    setInterval(() => {
      if (autoSave) {
        this.save();
        autoSave = false;
      }
    }, 20000);
  }

  private save() {
    this.updateLocal();
    this.webapiDocumentsService.save(this.diagram).subscribe(res => {
      console.log("SAVED", this.diagram.Id, res);
    })
  }

  private createTask(event: any, element: any) {
    const elementFactory: ElementFactory = this.bpmnJS.get('elementFactory'),
      modeling: Modeling = this.bpmnJS.get('modeling');

    const task = elementFactory.createShape({
      type: 'bpmn:Task',
      id: 'Task_' + Math.random().toString(36).substring(7),
    });

    modeling.createShape(task, { x: 100, y: 100 }, element);
    return task;
  }

  private updateLocal() {
    this.bpmnJS.saveXML().then((value: SaveXMLResult) => {
      if (value.xml) {
        this.diagram.Xml = value.xml;
      }
    });

    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');
    const modeling: Modeling = this.bpmnJS.get('modeling');

    this.diagram.Shapes = [];
    this.diagram.Connections = [];
    this.diagram.Labels = []
    var defaultElements = Object.values(DefaultElement);
    elementRegistry.getAll().filter(y => !defaultElements.find(z => z == y.id)).forEach(x => {
      var el: ElementDto = {
        ElementId: x.id,
        businessObject: undefined,//x.businessObject,
        labelId: (<Element>x).label?.id,
        labelIds: (<Element>x).labels.map(x => x.id),
        //parent: (<Element>x).parent,
        //incoming: (<Element>x).incoming,
        //outgoing: (<Element>x).outgoing,
        Type: (<Element>x).type as ElementType
      };

      if ((<Shape>x).x != undefined && (<Shape>x).type != 'label') {
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

      if ((<Shape>x).type == 'label') {
        const label = x as Label;
        (<LabelDto>el).X = (<Label>x).x;
        (<LabelDto>el).Y = (<Label>x).y;
        (<LabelDto>el).Width = (<Label>x).width;
        (<LabelDto>el).Height = (<Label>x).height;
        (<LabelDto>el).Text = (<Label>x).businessObject?.name;
        (<LabelDto>el).Anchor = (<Label>x).businessObject?.anchor;
        (<LabelDto>el).Bounds = {
          X: (<Label>x).di.bounds.x,
          Y: (<Label>x).di.bounds.y,
          Width: (<Label>x).di.bounds.width,
          Height: (<Label>x).di.bounds.height
        };
        this.diagram.Labels.push(<LabelDto>el);
      }
      console.log(this.diagram)
      return el;
    });
  }

  /* handleClickEvent(element: any) {
     this.propertiesPanel.update(element);

     var selectedElement = (<any>this.bpmnJS.get('selection')).get();
     console.log('element.changed 2', selectedElement);

     this.redrawElement(selectedElement[0]);
   }*/

  redrawElement(element: any) {
    // Get the renderer
    const elementRegistry = this.bpmnJS.get('elementRegistry');
    const elementRegistryEntry = (<any>elementRegistry).get(element.id);
    // Get the BpmnRenderer
    const bpmnRenderer: any = this.bpmnJS.get('bpmnRenderer');


    // Redraw the element
    //var l = bpmnRenderer.drawShape(element, (<any>this.bpmnJS.get('canvas'))?.getRootElement());
  }

  traverseDiagram(diagram: DiagramCreateDto) {
    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');
    //   const startEvents: ElementLike | undefined = elementRegistry.get(diagram.Shapes?.filter(x => x.Type == 'bpmn:StartEvent').map(x => x.ElementId));
    //const endEvent: ElementLike | undefined = elementRegistry.get(diagram.EndEventId);
    const startEvents: ElementLike[] = elementRegistry.getAll().filter(x => x['type'] == 'bpmn:StartEvent');
    startEvents.forEach(element => {
      //const startEvents: ElementLike | undefined = elementRegistry.get();

      this.processElement(element, element.id);
    });

    /*if (endEvent) {
      this.processElement(endEvent);
    }*/
  }

  processElement(element: ElementLike, token: string = "1") {
    // Process the element here
    console.log("TOKEN: " + token, 'Processing element:', element);

    const outgoingConnections: Array<Connection> = element?.['outgoing'] || [];
    for (const connection of outgoingConnections) {
      const targetElement: ElementLike | undefined = connection.target;
      if (targetElement) {
        this.processElement(targetElement, token);
      }
    }
  }


  changeColorOfShapes1() {
    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');
    const modeling: Modeling = this.bpmnJS.get('modeling');

    elementRegistry.getAll().forEach(x => {
      //const moddle: Moddle = this.bpmnJS.get('moddle');
      //const color = moddle.create('bpmn:Color', { stroke: 'red', fill: 'yellow' });
      //moddle.getPropertyDescriptor(x, { stroke: 'red', fill: 'yellow' });
      //moddle.setColor(x.businessObject, color);
    });
  }

  changeColorOfShapes2(id: string) {
    const graphicsFactory: any = this.bpmnJS.get('graphicsFactory');
    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');

    // Get the element
    const element = elementRegistry.get(id);

    // Draw the shape
    const shape = graphicsFactory?.drawShape(element);

    // Update the color of the shape
    graphicsFactory.setFill(shape, 'red');
    graphicsFactory.setStroke(shape, 'black');
  }
}

