import _Modeler from 'bpmn-js/lib/Modeler.js';
//import * as _Modeler from "bpmn-js/dist/bpmn-modeler.production.min.js";
//import * as _PropertiesPanelModule from 'bpmn-js-properties-panel';
//import * as _BpmnPropertiesProvider from 'bpmn-js-properties-panel/lib/provider/bpmn';
import * as _EntryFactory from 'diagram-js/lib/core/ElementFactory';
import _PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import * as _ContextPadProvider from 'diagram-js/lib/features/context-pad/ContextPadProvider';

export const InjectionNames = {
  eventBus: 'eventBus',
  bpmnFactory: 'bpmnFactory',
  elementRegistry: 'elementRegistry',
  translate: 'translate',
  propertiesProvider: 'propertiesProvider',
  bpmnPropertiesProvider: 'bpmnPropertiesProvider',
  paletteProvider: 'paletteProvider',
  originalPaletteProvider: 'originalPaletteProvider',
  incomingConnectionNumberRule: 'incomingConnectionNumberRule',
  contextPadProvider: 'contextPadProvider'
};

export const Modeler = _Modeler;
//export const PropertiesPanelModule = _PropertiesPanelModule.BpmnPropertiesPanelModule;
export const EntryFactory = _EntryFactory;
export const OriginalPaletteProvider = _PaletteProvider;
export const ContextPadProvider = _ContextPadProvider;
//export const OriginalPropertiesProvider = _PropertiesPanelModule.BpmnPropertiesProviderModule;

export interface IPaletteProvider {
  getPaletteEntries(): any;
}

export interface IPalette {
  registerProvider(provider: IPaletteProvider): any;
}

export interface IPropertiesProvider {
  getTabs(elemnt: any): any;
}
