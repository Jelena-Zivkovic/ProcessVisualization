export enum ElementType {
  Process = 'bpmn:Process',
  StartEvent = 'bpmn:StartEvent',
  IntermediateThrowEvent = 'bpmn:IntermediateThrowEvent',
  EndEvent = 'bpmn:EndEvent',
  //ExclusiveGateway = 'bpmn:ExclusiveGateway',
  Task = 'bpmn:Task',
  OutputTask = 'bpmn:ReceiveTask',
  InputTask = 'bpmn:SendTask',
  Loop = 'bpmn:ExclusiveGateway',
}
