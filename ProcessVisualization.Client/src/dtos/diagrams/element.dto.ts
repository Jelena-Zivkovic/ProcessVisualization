export class ElementDto {
  Id: string = "";
  businessObject?: any;
  Type: string = "";
  labelId?: any;//Label
  labelIds: string[] = [];//Label
  parent?: string;
  //incoming: any[] = [];//Connection
  //outgoing: any[] = [];//Connection

  constructor() {
  }
}
