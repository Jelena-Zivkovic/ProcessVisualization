
declare module "bpmn-js-properties-panel" {
  import * as BpmnPropertiesPanel from "index$3";
  import * as BpmnPropertiesProvider from "index$2";
  import * as CamundaPlatformPropertiesProvider from "index";
  import * as ZeebePropertiesProvider from "index$1";
  import * as TooltipProvider from "TooltipProvider";
  import * as useService from "useService";
  // import * as BpmnPropertiesPanel from "index$3";

  //export const exports: BpmnPropertiesPanel;
  const BpmnPropertiesPanelModule: typeof BpmnPropertiesPanel;
  const BpmnPropertiesProviderModule: typeof BpmnPropertiesProvider;
  const CamundaPlatformPropertiesProviderModule: typeof CamundaPlatformPropertiesProvider;
  const ZeebePropertiesProviderModule: typeof ZeebePropertiesProvider;
  const ZeebeTooltipProvider: typeof TooltipProvider;

  export {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
    ZeebePropertiesProviderModule,
    ZeebeTooltipProvider,
    useService
  }
}

declare module "index$3" {
  const BpmnPropertiesPanelModule: any;
  export = BpmnPropertiesPanelModule;
}

declare module "index$2" {
  const BpmnPropertiesProviderModule: any;
  export = BpmnPropertiesProviderModule;
}

declare module "index" {
  const CamundaPlatformPropertiesProviderModule: any;
  export = CamundaPlatformPropertiesProviderModule;
}

declare module "index$1" {
  const ZeebePropertiesProviderModule: any;
  export = ZeebePropertiesProviderModule;
}

declare module "TooltipProvider" {
  const ZeebeTooltipProvider: any;
  export = ZeebeTooltipProvider;
}

declare module "useService" {
  const useService: any;
  export = useService;
}

