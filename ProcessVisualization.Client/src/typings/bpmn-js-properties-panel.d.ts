declare module 'bpmn-js-properties-panel' {
  //import { PropertiesPanel } from 'bpmn-js-properties-panel';
  //import { PropertiesPanel } from 'bpmn-js/lib/PropertiesPanel';

  /*interface BpmnPropertiesPanel {
    // Define your types based on the functionality provided by bpmn-js-properties-panel
    // For example:
    attachTo(container: HTMLElement): void;
    detach(): void;
    import(properties: object): void;
    export(): object;
    // Add more methods and properties as needed
  }*/

  // const PropertiesPanel: PropertiesPanel;
  const BpmnPropertiesPanelModule: any;//BpmnPropertiesPanel;
  const BpmnPropertiesProviderModule: any
  export {
    //PropertiesPanel,
    //BpmnPropertiesPanel,
    BpmnPropertiesProviderModule,
    BpmnPropertiesPanelModule
  };
}

