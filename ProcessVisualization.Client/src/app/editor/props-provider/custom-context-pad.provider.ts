import { ContextPadEntries, ContextPadEntry } from 'diagram-js/lib/features/context-pad/ContextPadProvider';
import ContextPadProvider, { ElementFactory } from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import { Shape } from 'diagram-js/lib/model/Types';
import Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import { ShapeDto } from 'src/dtos/diagrams/shape.dto';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';
import { ElementType } from 'src/enum/element-type.enum';

export class CustomContextPadProvider extends ContextPadProvider {
  elementFactory: ElementFactory;
  _modeling: Modeling;
  constructor(config: any, bpmnInjector: any, eventBus: any, contextPad: any, modeling: any, elementFactory: any, connect: any, create: any, popupMenu: any, canvas: any, rules: any, translate: any) {
    super(config, bpmnInjector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate);

    this.elementFactory = elementFactory;
    this._modeling = modeling;
  }

  static override $inject = ['config', 'injector', 'eventBus', 'contextPad', 'modeling', 'elementFactory', 'connect', 'create', 'popupMenu', 'canvas', 'rules', 'translate'];

  createCopyAction(element: any) {
    return {
      group: 'edit',
      className: 'bpmn-icon-copy',
      title: 'Copy',
      action: {
        click: (event: any) => {
          this.copyShape(element);
        }
      }

    };
  }

  override getContextPadEntries(element: any) {
    const entries: ContextPadEntries = super.getContextPadEntries(element);
    if ((<Shape>element).x == undefined) {
      return entries;
    }

    // Add the copy action to the contextpad
    const newAction: any = this.createCopyAction(element);
    var newEntries = { ...entries, newAction };
    // entries.push(this.createCopyAction(element));
    console.log(newEntries);
    return newEntries;
  }

  copyShape(element: any) {
    const diagram = this.getDocument();
    const shape: ShapeDto | undefined = diagram.Shapes.find(x => x.ElementId == element.id);

    const copiedShape = {
      type: <string>shape?.Type ?? 'bpmn:Task',
      x: element.x + 100,
      y: element.y + 100,
    };

    // Create the new shape
    var newShape = this._modeling.createShape(copiedShape, { x: copiedShape.x, y: copiedShape.y }, element.parent);

    var copiedShapeDto: ShapeDto = new ShapeDto();
    copiedShapeDto.copy(newShape);
    copiedShapeDto.Label = shape?.Label ?? "";
    copiedShapeDto.InputParameters = shape?.InputParameters ?? [];
    copiedShapeDto.FunctionName = shape?.FunctionName ?? "";
    copiedShapeDto.OutputParameters = shape?.OutputParameters ?? [];
    copiedShapeDto.X = copiedShape?.x ?? 0;
    copiedShapeDto.Y = copiedShape?.y ?? 0;

    // {
    //   ElementId: newShape.id,
    //   Type: <ElementType>newShape.type,
    //   X: copiedShape.x,
    //   Y: copiedShape.y,
    //   Width: newShape.width,
    //   Height: newShape.height,
    //   Label: shape?.Label ?? "",
    //   /*Bounds: {
    //     X: copiedShape.di.bounds.x,
    //     Y: copiedShape.di.bounds.y,
    //     Width: copiedShape.di.bounds.width,
    //     Height: copiedShape.di.bounds.height
    //   },*/

    //   InputParameters: shape?.InputParameters ?? [],
    //   FunctionName: shape?.FunctionName ?? "",
    //   OutputParameters: shape?.OutputParameters ?? []
    // };
    diagram.Shapes.push(copiedShapeDto);
    this.setDocument(diagram);

    return copiedShape;
  }

  private getDocument(): DiagramCreateDto {
    var doc = localStorage.getItem("diagram");

    if (doc != null) {
      const diagram = JSON.parse(doc) as DiagramCreateDto
      return diagram;
    }
    return new DiagramCreateDto();
  }
  private setDocument(doc: DiagramCreateDto) {
    localStorage.setItem("diagram", JSON.stringify(doc));
  }
}
