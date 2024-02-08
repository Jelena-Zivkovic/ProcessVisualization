import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseImports } from 'src/libs/base-imports';
import { Constants } from 'src/app/app.constants';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderInterceptorService
  extends BaseImports
  implements HttpInterceptor {
  includeContentType = false;
  constructor(private injector: Injector) {
    super(injector);
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //spinner is set in header
    const showSpinner = req.headers.has(Constants.SHOW_LOADER);
    if (showSpinner) {
      this.commonService.showLoader();
    }
    return next.handle(req).pipe(

      //finalize executes after the request was completed/threw error
      finalize(() => {
        if (showSpinner) {
          req.headers.delete(Constants.SHOW_LOADER);
          this.commonService.hideLoader();
        }
      })
    );
  }


}
