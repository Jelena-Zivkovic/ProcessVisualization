import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';

@Component({
  selector: 'cmp-properties-panel',
  standalone: true,
  imports: [InputTextModule, CommonModule, FormsModule, InputTextareaModule],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent {
  @Input() modalData: DiagramCreateDto = new DiagramCreateDto();
  element: any;

  constructor() {
  }

  public update(el: any | undefined = undefined) {
    this.element = el;

    console.log(this.modalData);

    // this.element.x = 140;
  }
}
