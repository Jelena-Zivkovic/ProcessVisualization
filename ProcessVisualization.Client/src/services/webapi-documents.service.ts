import { Injectable, Injector } from "@angular/core";
import { Constants } from "src/app/app.constants";
import { DiagramCreateDto } from "src/dtos/diagrams/diagram-create.dto";
import { ResponseTemplateDto } from "src/dtos/response-template.dto";
import { BaseApiService } from "./base-api.service";

@Injectable()
export class WebapiDocumentsService extends BaseApiService {
  controllerName = 'Document';
  baseUrl = Constants.BASE_URL + this.controllerName;
  constructor(injector: Injector) {
    super(injector);
  }

  getDocument(id: number, showLoader = false) {
    return this.http.get<ResponseTemplateDto<any>>(
      this.baseUrl + '/' + id,
      this.getHttpParams(showLoader)
    );
  }

  save(document: DiagramCreateDto, showLoader = false) {
    return this.http.post<ResponseTemplateDto<DiagramCreateDto>>(
      this.baseUrl + "/Save",
      document,
      this.getHttpParams(showLoader)
    )
  }


  create(roomId: number, showLoader = false) {
    return this.http.post<ResponseTemplateDto<DiagramCreateDto>>(
      this.baseUrl,
      roomId,
      this.getHttpParams(showLoader)
    )
  }
}
