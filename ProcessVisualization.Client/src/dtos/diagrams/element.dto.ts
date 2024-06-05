import { ElementType } from "src/enum/element-type.enum";

export class ElementDto {
  Id?: number;
  ElementId: string = "";
  businessObject?: any;
  Type: ElementType = ElementType.Process;
  //labelId?: any;//Label
  //labelIds: string[] = [];//Label
  parent?: string;
  Label: string = "";
  //incoming: any[] = [];//Connection
  //outgoing: any[] = [];//Connection

  constructor() {
  }

  copy(parameter: any) {
    this.Id = parameter.Id;
    this.ElementId = parameter.ElementId;
    this.Type = parameter.Type;
    this.Label = parameter.Label;
    this.parent = parameter.parent;
    //this.incoming = parameter.incoming;
    //this.outgoing = parameter.outgoing;
  }
}
