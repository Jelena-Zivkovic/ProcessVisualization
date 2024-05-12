import { Component, ElementRef, HostListener, Injector, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

import { Label } from 'diagram-js/lib/model/Types';
import { HeaderComponent } from '../header/header.component';
import { Shape } from 'bpmn-js/lib/model/Types';
import { ElementDto } from 'src/dtos/diagrams/element.dto';
import { ShapeDto } from 'src/dtos/diagrams/shape.dto';
import { ConnectionDto } from 'src/dtos/diagrams/connection.dto';
import { DefaultElement } from 'src/enum/default-element.enum';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';
import { MenubarModule } from 'primeng/menubar';
import { BaseViewerOptions, SaveSVGResult, SaveXMLResult } from 'bpmn-js/lib/BaseViewer';
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
import { PrimeIcons, MenuItem } from 'primeng/api';
import { CustomContextPadProvider } from './props-provider/custom-context-pad.provider';
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
  private enableBpmnJS!: Modeler;
  private disebleBpmnJS!: Modeler;
  disable: boolean = false;
  private bpmnJS!: Modeler;
  private zoomScale: number = 1;
  diagram: DiagramCreateDto;
  email: string = "";
  group: string = "";
  selectedElement: ShapeDto | undefined;

  documentActions: any;
  disabledImg: string = "";

  @ViewChild('diagramRef', { static: true }) private diagramRef: ElementRef | undefined;
  @ViewChild('diagramRefDisable', { static: true }) private diagramRefDisable: ElementRef | undefined;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;
  @ViewChild('propertiesRefDisable', { static: true }) private propertiesRefDisable: ElementRef | undefined;
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

    this.enableBpmnJS = new Modeler({
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
        { [InjectionNames.contextPadProvider]: ['type', CustomContextPadProvider] },
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
    this.disebleBpmnJS = new Modeler({
      container: this.diagramRefDisable?.nativeElement,
      height: "100%",
      propertiesPanel: {
        parent: this.propertiesRefDisable?.nativeElement
      },
      moddleExtensions: {
      },
      additionalModules: [
        {
          __init__: ['customRenderer'],
          customRenderer: ['type', CustomRenderer]
        }
      ]
    });
    this.editorService.disableDiagram(this.disebleBpmnJS);
    this.bpmnJS = this.disebleBpmnJS;
    this.disable = true;
    console.log(this.enableBpmnJS, this.enableBpmnJS)

    this.initDocumentActions();
    this.sharedService.on("ReceiveMessage123", this.updateGraph.bind(this))
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.enableBpmnJS.attachTo(this.diagramRef?.nativeElement);
    this.disebleBpmnJS.attachTo(this.diagramRefDisable?.nativeElement);
    this.importDiagram(this.initConfigEditor());
    this.initGraph(this.diagram).then(() => {
      this.onChange();

      this.signalRService.startConnection(this.group);

      var that = this;
      this.bpmnJS.on('element.changed', function (event: any) {
        that.bpmnJS.saveXML().then((value: SaveXMLResult) => {
          that.diagram.Xml = value.xml ?? that.diagram.Xml;
          that.updateLocal(false);
          //that.commonService.setDocument(that.diagram);
          that.signalRService.sendMessageToGroup(that.group, that.email, that.diagram);
        });
      });

      this.bpmnJS.on('element.create', (event: any) => {
      });

      this.bpmnJS.on('element.click', (event: any) => {
        this.propertiesPanel.update(event.element.id);
        console.log(event, this.bpmnJS)
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
        this.updateLocal();
        // this.commonService.setDocument(this.diagram);+
        this.saveSvgAsImage();
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
      diagram.Shapes.forEach((element: ShapeDto) => {
        const task = elementFactory.createShape({
          type: element.Type,
          id: element.ElementId
        });

        task.businessObject.name = element.Label ?? "";

        const created = modeling.createShape(task, { x: <number>element.X, y: <number>element.Y }, <Parent>process);
      });
    }

    if (diagram.Connections?.length > 0) {
      diagram.Connections.forEach((element: ConnectionDto) => {
        if (element && element.Source && element.Target) {
          const source = elementRegistry.get(element.Source) as Element;
          const target = elementRegistry.get(element.Target) as Element;

          if (source && target && parent) {
            var connection = elementFactory.createConnection({
              type: 'bpmn:SequenceFlow',
              source: source,
              target: target,
              // waypoints: [
              //   { x: 100, y: 100 },
              //   { x: 200, y: 200 }
              // ],
            });
            connection.businessObject.name = element.Label;

            modeling.createConnection(source, target, connection, <Parent>process);
          }
        }
      });
    }
  }

  private updateAndRedrawShape(elementId: string) {
    const modeling: Modeling = this.bpmnJS.get('modeling');
    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');

    const element = elementRegistry.get(elementId) as Shape;
    if (element) {
      modeling.moveShape(element, { x: 0, y: 0 });
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

  private saveSvgAsImage() {
    this.bpmnJS.saveSVG().then((value: SaveSVGResult) => {
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(value.svg);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0);

        this.disabledImg = canvas.toDataURL('image/png');
      };
    });

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
        label: 'Save',
        icon: PrimeIcons.SAVE,
        command: () => { this.save() }
      },
      {
        label: 'Disable',
        icon: PrimeIcons.SAVE,
        command: () => { this.enableModule(false); }
      },
      {
        label: 'Enable',
        icon: PrimeIcons.SAVE,
        command: () => { this.enableModule(true); }
      },
      {
        label: 'Undo',
        icon: PrimeIcons.UNDO,
        command: () => { this.undo() }
      },
      {
        label: 'Redo',
        icon: PrimeIcons.REPLAY,
        class: 'p-button-danger',
        command: () => { this.redo() }
      },
      {
        separator: true
      },
      {
        label: 'Export',
        icon: PrimeIcons.FILE_EXPORT,
        items: [
          {
            label: 'Export to xml',
            command: () => { this.exportToXml() }
          },
          {
            label: 'Export to svg',
            command: () => { this.exportToSvg() }
          }
        ]
      },
      {
        label: 'Send mess',
        icon: PrimeIcons.SEND,
        command: () => { this.signalRService.sendMessageToGroup(this.group, this.email, this.diagram); }
      },
      {
        label: 'Simulate',
        icon: PrimeIcons.PLAY,
        command: () => { this.routerService.navigate("diagram-simulation"); }
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
        // this.save();
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

  private updateLocal(updateXml: boolean = true) {
    if (updateXml) {
      this.bpmnJS.saveXML().then((value: SaveXMLResult) => {
        if (value.xml) {
          this.diagram.Xml = value.xml;
        }
      });
    }

    const elementRegistry: ElementRegistry = this.bpmnJS.get('elementRegistry');
    const modeling: Modeling = this.bpmnJS.get('modeling');

    //this.diagram.Shapes = [];
    this.diagram.Connections = [];
    var defaultElements = Object.values(DefaultElement);
    if (!this.diagram.Xml) {
      this.diagram.Xml = "";
    }

    elementRegistry.getAll().filter(y => !defaultElements.find(z => z == y.id)).forEach(x => {
      var el: ShapeDto | ElementDto | ConnectionDto | undefined = this.diagram.Shapes.find(y => y.ElementId == x.id);
      if (el) {
        el.Label = (<Element>x).businessObject?.name ?? "";
        el.Type = (<Element>x).type as ElementType;
      }
      else {
        el = {
          ElementId: x.id,
          //businessObject: undefined,//x.businessObject,
          //labelId: (<Element>x).label?.id,
          //labelIds: (<Element>x).labels.map(x => x.id),
          //parent: (<Element>x).parent,
          //incoming: (<Element>x).incoming,
          //outgoing: (<Element>x).outgoing,
          Type: (<Element>x).type as ElementType,
          Label: (<Element>x).businessObject?.name ?? ""
        } as ElementDto;
        if ((<Shape>x).x != undefined && (<Shape>x).type != 'label') {

          this.diagram.Shapes.push(<ShapeDto>el);
        }
        else {
          this.diagram.Connections.push(<ConnectionDto>el);
        }
      }

      if ((<Shape>x).x != undefined && (<Shape>x).type != 'label') {
        (<ShapeDto>el).X = (<Shape>x).x;
        (<ShapeDto>el).Y = (<Shape>x).y;
        (<ShapeDto>el).Width = (<Shape>x).width;
        (<ShapeDto>el).Height = (<Shape>x).height;

        if (!(<ShapeDto>el).InputParameters) {
          (<ShapeDto>el).InputParameters = [];
        }
        else {
          (<ShapeDto>el).InputParameters.map(x => {
            if (!x.Value) {
              x.Value = "";
            }
          })
        }

        if (!(<ShapeDto>el).OutputParameters) {
          (<ShapeDto>el).OutputParameters = [];
        }
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

        // this.diagram.Connections.push(<ConnectionDto>el);
      }
      if (!(<ConnectionDto>el).Value) {
        (<ConnectionDto>el).Value = "";
      }
      return el;
    });

    this.commonService.setDocument(this.diagram);
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

  onClick(event: any) {
    console.log(this.diagram, event)
  }

  enableModule(enable: boolean) {
    console.log(enable)
    this.disable = !enable;


    if (enable) {
      console.log("enable")
      this.bpmnJS = this.enableBpmnJS
    }
    else {
      console.log("disable")
      this.bpmnJS = this.disebleBpmnJS;
    }
    this.importDiagram(this.diagram.Xml).subscribe(() => {
      console.log("dsa")
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    console.log("window:beforeunload", $event)
    $event.returnValue = false;
    return false;
  }
}

