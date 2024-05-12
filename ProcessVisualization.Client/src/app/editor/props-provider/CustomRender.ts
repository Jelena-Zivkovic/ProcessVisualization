
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
import EventBus from 'diagram-js/lib/core/EventBus';
import { Shape } from 'bpmn-js/lib/model/Types';

const HIGH_PRIORITY = 1500;

export class CustomRenderer extends BaseRenderer {
  static $inject = ['eventBus', 'bpmnRenderer'];
  bpmnRenderer: any;

  constructor(eventBus: EventBus, bpmnRenderer: any) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  override canRender(element: Shape) {
    // Specify the type of the BPMN element you want to customize
    return element.type === 'bpmn:SendTask' || element.type === 'bpmn:ReceiveTask';
  }

  override drawShape(parentNode: Element, element: Shape) {
    // Customize the appearance of the BPMN element
    var points: string = "";
    if (element.type === 'bpmn:SendTask') {
      points = [
        { x: 0, y: 0 },
        { x: element.width, y: 0 },
        { x: element.width * 0.80, y: element.height },
        { x: element.width * 0.20, y: element.height }
      ].map(p => `${p.x},${p.y}`).join(' ');
    } else if (element.type === 'bpmn:ReceiveTask') {
      points = [
        { x: element.width * 0.20, y: 0 },
        { x: element.width * 0.80, y: 0 },
        { x: element.width, y: element.height },
        { x: 0, y: element.height },
      ].map(p => `${p.x},${p.y}`).join(' ');
    }
    // Create the trapezoid
    const trapezoid = svgCreate('polygon');
    // Create the label for the trapezoid
    const label = svgCreate('text');

    svgAttr(trapezoid, {
      points: points,
      stroke: 'rgb(34, 36, 42)',
      fillOpacity: 0.95,
      fill: 'white',  // Fill color
      //stroke: 'black',  // Border color
      strokeWidth: 2  // Border width
    });

    svgAppend(parentNode, trapezoid);
    svgAttr(label, {
      x: element.width / 2,
      y: element.height / 2,
      textAnchor: 'middle',
      alignmentBaseline: 'middle',
      fill: 'black',
      fontSize: '12px'
    });
    label.textContent = element.businessObject.name || '';
    svgAppend(parentNode, label);
    return trapezoid;
  }
}
