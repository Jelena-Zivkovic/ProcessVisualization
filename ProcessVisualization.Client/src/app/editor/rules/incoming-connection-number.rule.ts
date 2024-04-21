//import inherits from 'inherits';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

export default class IncomingConnectionNumberRule extends RuleProvider {

  static override $inject = ['eventBus'];
  constructor(eventBus: any) {
    super(eventBus);
  }

  override init() {
    this.addRule('connection.create', 2000, (context: any) => {
      const source = context.source;
      const target = context.target;
      console.log('source', source);
      console.log('target', target);
      // check if the target is a custom task
      if (target.type === 'bpmn:Task') {
        // check if the target already has 2 incoming connections
        if (target.incoming && target.incoming.length >= 2) {
          return false; // prevent the connection
        }
      }

      return true; // allow the connection
    });
  }
}
