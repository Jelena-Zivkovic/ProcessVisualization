import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { attr as svgAttr } from 'tiny-svg';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { Parent } from 'bpmn-js/lib/model/Types';
import { getMid, getConnectionMid } from 'diagram-js/lib/layout/LayoutUtil';
import Canvas from 'diagram-js/lib/core/Canvas';

export default class CustomConnectionRenderer extends BaseRenderer {
  static $inject = ['eventBus', 'bpmnRenderer', 'canvas'];

  private bpmnRenderer: any;
  private canvas: any;

  // ...

  constructor(eventBus: any, bpmnRenderer: any, canvas: any) {
    super(eventBus, 1500); // set a higher priority than the default BpmnRenderer

    this.bpmnRenderer = bpmnRenderer;
    this.canvas = canvas;
  }

  override canRender(element: any) {
    // only render connections
    return is(element, 'bpmn:SequenceFlow');
  }

  override drawConnection(parentNode: any, element: any) {

    const connection = this.bpmnRenderer.drawConnection(parentNode, element);

    if (element.source?.type === 'bpmn:ExclusiveGateway') {
      const midWayPoint = getConnectionMid(element);//this.getMidWayPoint(element.waypoints);
      // create label
      const label = svgCreate('text');
      svgAttr(label, {
        fill: 'black',
        fontSize: '12px',
        textAnchor: 'middle',
        x: midWayPoint.x,
        y: midWayPoint.y - 10,
        alignmentBaseline: 'middle',
      });
      //console.log(element.source.outgoing, this.bpmnRenderer);

      if (element.source.outgoing.length > 1) {
        label.textContent = "false";
      }
      else {
        label.textContent = element.businessObject.name ?? "true";
      }

      svgAppend(parentNode, label);
    }
    return connection;
  }

  getMidWayPoint(waypoints: any[]) {
    console.log(waypoints);
    if (!waypoints || waypoints.length === 0) {
      return null;
    }

    let midPointIndex = Math.floor(waypoints.length / 2);

    if (waypoints.length % 2 === 0) {
      // If there's an even number of waypoints, get the average of the two middle points
      let point1 = waypoints[midPointIndex - 1];
      let point2 = waypoints[midPointIndex];
      return {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2
      };
    } else {
      // If there's an odd number of waypoints, return the middle point
      return waypoints[midPointIndex];
    }
  }
}
