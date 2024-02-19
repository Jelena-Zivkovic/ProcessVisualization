import { Injectable, Injector } from '@angular/core';
import { SharedService } from './shared.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { AlertDo } from 'src/dos/alert.do';
import { HttpClient } from '@angular/common/http';
import { Subject, debounceTime, filter, skip, first } from 'rxjs';
import { KeyValue } from '@angular/common';
import { Constants } from 'src/app/app.constants';
import { DropdownItemDo } from 'src/dos/dropdown/dropdown-item.do';
import { DropdownItemStringDo } from 'src/dos/dropdown/dropdown-item-string.do';
import { DiagramCreateDto } from 'src/dtos/diagrams/diagram-create.dto';

@Injectable()
export class CommonService {
  timer: any;
  loaderArray: string[];
  http: HttpClient;

  constructor(
    private injector: Injector,
    private sharedService: SharedService,
  ) {
    this.loaderArray = [];
    this.http = injector.get(HttpClient);
  }

  alert(message: string, title: string | null = null) {
    var data = new AlertDo();
    data.title = title;
    data.content = message;
    this.sharedService.broadcast(Constants.EV_SHOW_ALERT, data);
  }

  showLoader() {
    if (this.loaderArray.length == 0) {
      this.sharedService.broadcast(Constants.EV_SPINNER_STATE_CHANGED, true);
    }
    this.loaderArray.push('load');
  }

  hideLoader() {
    this.loaderArray.pop();
    if (this.loaderArray.length == 0) {
      this.sharedService.broadcast(Constants.EV_SPINNER_STATE_CHANGED, false);
    }
  }

  formatImageUrl(url: string) {
    return url + '?time=' + Date.now().toString();
  }

  encodeAngularImageUrl(path: string) {
    return path.split('/').join('~2F');
  }

  decodeAngularImageUrl(path: string) {
    return path.split('~2F').join('/');
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isEmptyForm(formGroup: FormGroup): boolean {
    let isEmpty = true;
    Object.keys(formGroup.controls).forEach((field) => {
      const formField = formGroup.get(field);
      if (formField instanceof FormGroup) {
        if (!this.isEmptyForm(formField)) {
          isEmpty = false;
        }
      }
      if (this.isFilled(formGroup, field)) {
        isEmpty = false;
      }
    });
    return isEmpty;
  }

  isFilled(formGroup: FormGroup | FormArray, field: string) {
    const formField = formGroup.get(field);
    if (formField instanceof FormArray) {
      return formField.length > 0;
    }
    const isFilled: boolean =
      (formField &&
        formField.value !== null &&
        formField.value != undefined &&
        formField?.touched &&
        formField?.value.toString() !== '') ||
      false;
    return isFilled;
  }

  formChanges(
    forms: (FormGroup | FormControl)[],
    formChanged: boolean,
    omitChanges: boolean
  ) {
    const subject = new Subject<boolean>();
    forms.forEach((form) => {
      form.valueChanges
        .pipe(
          debounceTime(200),
          skip(1),
          filter(() => !formChanged && !omitChanges)
        )
        .subscribe(() => subject.next(true));
    });
    return subject.asObservable();
  }

  getDefaultDropdownItem(): DropdownItemDo {
    var res = new DropdownItemDo();
    res.value = undefined;
    res.label = '--Select--';
    return res;
  }

  getDefaultDropdownItemString(): DropdownItemStringDo {
    var res = new DropdownItemStringDo();
    res.value = null;
    res.label = '--Select--';
    return res;
  }

  setRoomId(roomId: number) {
    localStorage.setItem("roomId", roomId.toString());
  }

  getRoomId(): number {
    return +(localStorage.getItem("roomId") ?? "");
  }

  setDocument(doc: DiagramCreateDto) {
    localStorage.setItem("diagram", JSON.stringify(doc));
  }

  getDocument(): DiagramCreateDto {
    var doc = localStorage.getItem("diagram");
    if (doc != null) {
      return <DiagramCreateDto>JSON.parse(doc);
    }
    return new DiagramCreateDto();
  }

  clearDocument(): void {
    localStorage.removeItem("diagram");
  }
}
