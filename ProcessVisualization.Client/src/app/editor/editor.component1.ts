import { AfterContentInit, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modeler, InjectionNames, OriginalPaletteProvider } from "./bpmn-js/bpmn-js";
import { CustomPropsProvider } from './props-provider/CustomPropsProvider';
import { CustomPaletteProvider } from "./props-provider/CustomPaletteProvider";
import { CommonModule } from '@angular/common';
import { ElementFactory } from 'bpmn-js/lib/features/palette/PaletteProvider';
import { switchMap } from 'rxjs';

const customModdle = {
  name: "customModdle",
  uri: "http://example.com/custom-moddle",
  prefix: "custom",
  xml: {
    tagAlias: "lowerCase"
  },
  associations: [],
  types: [
    {
      "name": "ExtUserTask",
      "extends": [
        "bpmn:UserTask"
      ],
      "properties": [
        {
          "name": "worklist",
          "isAttr": true,
          "type": "String"
        }
      ]
    },
  ]
};
@Component({
  selector: 'app-editor123',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent1 implements OnInit, AfterContentInit {
  private modeler!: any;

  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      additionalModules: [
        //PropertiesPanelModule,

        // Re-use original bpmn-properties-module, see CustomPropsProvider
        //{[InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]]},
        { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },

        // Re-use original palette, see CustomPaletteProvider
        { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
        { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
      ],
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtension: {
        custom: customModdle
      }
    });
  }
  ngAfterContentInit(): void {
    this.load();
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

  load(): void {
    const url = '../../assets/diagram/diagram1.bpmn';
    this.http.get(url, {
      headers: { observe: 'response' }, responseType: 'text'
    }).pipe(switchMap(
      async (x: any) => {
        console.log('Fetched XML, now importing: ', x);
        this.modeler.importXML(url, this.handleError);
      },
      //this.handleError
    ));
  }

  save(): void {
    this.modeler.saveXML((err: any, xml: any) => console.log('Result of saving XML: ', err, xml));
  }

}
