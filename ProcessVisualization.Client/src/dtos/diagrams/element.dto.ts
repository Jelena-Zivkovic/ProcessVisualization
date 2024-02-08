export class ElementDto {
  id: string = "";
  businessObject?: any;
  type: string = "";
  labelId?: any;//Label
  labelIds: string[] = [];//Label
  parent?: string;
  //incoming: any[] = [];//Connection
  //outgoing: any[] = [];//Connection

  constructor() {
  }
}
