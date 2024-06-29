import { Component, ElementRef, HostListener, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import Modeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import EventBus from 'diagram-js/lib/core/EventBus';

import { from, ignoreElements, Observable, of, Subscription } from 'rxjs';
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
import { PrimeIcons, MenuItem, MessageService } from 'primeng/api';
import { CustomContextPadProvider } from './props-provider/custom-context-pad.provider';
import { EditorControlComponent } from 'src/componets/editor-control/editor-control.component';
import { ControleEditorState } from 'src/enum/controle-editor-state.enum';
//declare var propertiesPanel: any;
//declare var BpmnPropertiesPanelModule: any;
//declare var BpmnPropertiesProviderModule: any;

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MenubarModule, ButtonModule, PropertiesPanelComponent, EditorControlComponent],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends BaseImports implements OnInit, OnDestroy {
  @ViewChild('propertiesPanel') propertiesPanel!: PropertiesPanelComponent;
  subscription: Subscription[] = [];
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
  constructor(injector: Injector, private signalRService: SignalREditorService, private messageService: MessageService) {
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
        },
        // {
        //   __init__: ['customConnectionRenderer'],
        //   customConnectionRenderer: ['type', CustomConnectionRenderer]
        // }
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
    this.disable = false;
    this.bpmnJS = this.enableBpmnJS;

    this.initDocumentActions();
    this.subscription.push(this.sharedService.on("ReceiveMessage123", this.updateGraph.bind(this)));
    // this.sharedService.on("ChangeContoleEditorState123", this.enableModule.bind(this));

    var that = this;
    this.bpmnJS.on('commandStack.shape.delete.postExecuted', function (eventData: any, context: any) {
      that.diagram.Shapes = that.diagram.Shapes.filter(x => x.ElementId != eventData.context.shape.id);
    });
  }

  ngOnInit(): void {
    this.onCreateConnection();

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

      this.bpmnJS.on('element.click', (event: any) => {
        this.propertiesPanel.update(event.element.id);
      });
    });

  }

  ngOnDestroy(): void {
    console.log("destroy")
    this.bpmnJS.destroy();
    this.enableBpmnJS.destroy();
    this.disebleBpmnJS.destroy();
    this.signalRService.removeFromGroup(this.group);
    setTimeout(() => {
      this.signalRService.stopConnection();
    }, 1000);
    this.subscription.forEach(x => x.unsubscribe());
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

        const created = modeling.createShape(task, { x: (<number>element.X + task.width / 2), y: (<number>element.Y + task.height / 2) }, <Parent>process);
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
            });

            connection.businessObject.name = element.Label;
            if (element.WayPoints.length != 0) {
              connection.waypoints = element.WayPoints;
            }

            modeling.createConnection(source, target, connection, <Parent>process);
          }
        }
      });
    }
  }

  saveSvgAsImage() {
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

  onCreateConnection() {
    this.bpmnJS.on('commandStack.connection.create.preExecute', (event: any) => {
      const connection = event.context.connection;
      const source = event.context.source;

      var connectionDto: ConnectionDto = new ConnectionDto();
      if (source.type === ElementType.Loop && source.outgoing) {
        var text = source.outgoing.filter((item: any) => item.businessObject.name === "true");
        if (text.length == 0) {
          connection.businessObject.name = "true";
          connectionDto.Value = "true";
        }
        else {
          connection.businessObject.name = "false";
          connectionDto.Value = "false";
        }
      }

      connectionDto.mapConnection(connection);
      this.diagram.Connections.push(connectionDto);

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
    this.subscription.push(this.webapiDocumentsService.save(this.diagram).subscribe(res => {
      console.log("SAVED", this.diagram.Id, res);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Diagram saved' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error saving diagram' });
    }));
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

  enableModule(enable: boolean) {
    if (this.disable !== enable) {
      return;
    }

    this.disable = !enable;
    this.bpmnJS.saveXML().then((value: SaveXMLResult) => {
      var shapes = this.diagram.Shapes.map(a => Object.assign({}, a));;

      this.diagram.Shapes = [];
      this.diagram.Connections = [];
      if (value.xml) {
        this.diagram.Xml = value.xml;

        if (enable) {
          console.log("enable")
          this.bpmnJS = this.enableBpmnJS
        }
        else {
          console.log("disable")
          this.bpmnJS = this.disebleBpmnJS;
        }

        if (!this.diagram.Xml || this.diagram.Xml.length !== 0) {
          this.importDiagram(this.diagram.Xml).subscribe((res) => {
            this.updateLocal(false);
            this.diagram.Shapes.map(x => {
              var el = shapes.find(y => y.ElementId == x.ElementId || (y.Type == x.Type && y.Label == x.Label && y.X == x.X && y.Y == x.Y && y.Width == x.Width && y.Height == x.Height));
              if (el) {
                x.InputParameters = el.InputParameters;
                x.OutputParameters = el.OutputParameters;
              }
            });
            this.commonService.setDocument(this.diagram);
          });
        }
      }
    });
  }

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   console.log("window:beforeunload", $event)
  //   $event.returnValue = false;
  //   return false;
  // }
}

