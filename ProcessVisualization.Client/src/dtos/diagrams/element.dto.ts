import { ElementType } from "src/enum/element-type.enum";

export class ElementDto {
  Id?: number;
  ElementId: string = "";
  businessObject?: any;
  Type: ElementType = ElementType.Process;
  labelId?: any;//Label
  labelIds: string[] = [];//Label
  parent?: string;
  //incoming: any[] = [];//Connection
  //outgoing: any[] = [];//Connection

  constructor() {
  }
}
