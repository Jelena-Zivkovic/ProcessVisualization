import { IPalette, IPaletteProvider } from "../bpmn-js/bpmn-js";

export class CustomPaletteProvider implements IPaletteProvider {

  static $inject = ['palette', 'originalPaletteProvider', 'elementFactory', 'create'];

  private readonly elementFactory: any;
  private readonly create: any;

  // Note that names of arguments must match injected modules, see InjectionNames.
  // I don't know why originalPaletteProvider matters but it breaks if it isn't there.
  // I guess since this component is injected, and it requires an instance of originalPaletteProvider,
  // originalPaletteProvider will be new'ed and thus call palette.registerProvider for itself.
  // There probably is a better way.
  constructor(private palette: IPalette, private originalPaletteProvider: IPaletteProvider, elementFactory: any, create: any) {
    palette.registerProvider(this);
    this.elementFactory = elementFactory;
    this.create = create;
  }
  startCreate(elementType: string) {
    const shape = this.elementFactory.createShape({ type: elementType });
    this.create.start(event, shape);
  }

  getPaletteEntries() {
    return {
      'create.receive-task': {
        group: 'activity',
        className: 'bpmn-icon-receive-task',
        title: 'Create ReceiveTask',
        action: {
          dragstart: (event: DragEvent) => this.startCreate('bpmn:ReceiveTask'),
          click: (event: MouseEvent) => this.startCreate('bpmn:ReceiveTask')
        }
      },

      'create.send-task': {
        group: 'activity',
        className: 'bpmn-icon-send-task',
        title: 'Create sendTask',
        action: {
          dragstart: (event: DragEvent) => this.startCreate('bpmn:SendTask'),
          click: (event: MouseEvent) => this.startCreate('bpmn:SendTask')
        }
      }
    };
  }
}
