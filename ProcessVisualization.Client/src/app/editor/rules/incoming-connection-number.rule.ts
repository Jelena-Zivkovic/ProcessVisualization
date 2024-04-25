//import inherits from 'inherits';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { delay } from 'rxjs';
import { Root } from 'diagram-js/lib/model/index';
import { ElementType } from 'src/enum/element-type.enum';

export default class IncomingConnectionNumberRule extends RuleProvider {

  static override $inject = ['eventBus'];
  constructor(eventBus: any) {
    super(eventBus);
    console.log(eventBus._listeners);
  }

  override init() {
    this.addRule('connection.create', 1001, (context: any) => {
      const source = context.source;
      const target = context.target;

      if (!source || !source.type || !target || !target.type || source.type === 'bpmn:Process' || target.type === 'bpmn:Process') {
        return;
      }

      if (target?.type === ElementType.Task || target?.type === 'bpmn:ExclusiveGateway') {
        if (target.incoming && target.incoming.length >= 2) {
          return false;
        }
      }

      if (source.outgoing && ((source.outgoing.length >= 1 && source.type !== 'bpmn:ExclusiveGateway') || (source.type === 'bpmn:ExclusiveGateway' && source.outgoing.length >= 2))) {
        return false;
      }
      return;
    });

    this.addRule('shape.create', 1001, (context: any) => {
      console.log(context);
    });
  }
}
