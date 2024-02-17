import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ResponseTemplateDto } from 'src/dtos/response-template.dto';
import { BaseImports } from 'src/libs/base-imports';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapDataInterceptorService
  extends BaseImports
  implements HttpInterceptor {
  omitCalls = ['Authentication'];
  skipInterceptor = false;

  constructor(private injector: Injector) {
    super(injector);
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.omitCalls.forEach((api) => {
      if (req.url.includes(api)) {
        this.skipInterceptor = true;
      }
    });
    if (!this.skipInterceptor) {
      return next.handle(req).pipe(
        map((res) => {
          if (res instanceof HttpResponse) {
            const data = res.body as ResponseTemplateDto<any>;
            if (!data.IsSuccess) {
              alert(data.Message!);
            }
          }
          return res;
        })
      );
    } else {
      this.skipInterceptor = false;
      return next.handle(req);
    }
  }
}
