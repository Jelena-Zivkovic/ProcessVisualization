import { Injectable, Injector } from '@angular/core';
import { LoggerService } from 'src/services/logger.service';
import { ResponseTemplateDto } from 'src/dtos/response-template.dto';
import { BaseImports } from 'src/libs/base-imports';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorService
  extends BaseImports
  implements HttpInterceptor {
  token?: string | null;
  includeContentType: boolean = false;
  omitCalls = ['Authentication'];
  skipInterceptor = false;

  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private injector: Injector,
    private router: Router
  ) {
    super(injector);
    this.loggerService = injector.get(LoggerService);
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

    this.token = this.authenticationService.getAccessToken();
    if (this.token && !this.skipInterceptor) {
      return next.handle(this.addAuthToken(req, this.token)).pipe(
        catchError((requestError: HttpErrorResponse) => {
          if (requestError && requestError.status === 401) {
            if (this.refreshTokenInProgress) {
              return this.refreshTokenSubject.pipe(
                filter((x) => x !== null),
                take(1),
                switchMap((token) => {
                  return next.handle(this.addAuthToken(req, token));
                })
              );
            } else {
              this.refreshTokenInProgress = true;
              this.refreshTokenSubject.next(null);
            }
          }
          return this.handleError(req, requestError);
        })
      );
    }

    this.skipInterceptor = false;

    if (req.url.includes('Authentication') || req.url.includes('Users')) {
      return next.handle(req).pipe(
        catchError((requestError: HttpErrorResponse) => {
          return this.handleError(req, requestError);
        })
      );
    }

    return next.handle(req);
  }

  addAuthToken(req: HttpRequest<any>, token: string) {
    let headers = req.headers.set('Authorization', 'Bearer ' + token);
    this.includeContentType = !(req.body instanceof FormData);
    if (this.includeContentType) {
      headers = headers.delete('Content-Type');
      headers = headers.append('Content-Type', 'application/json');
    }
    return req.clone({ headers: headers });
  }

  handleError(req: HttpRequest<any>, error: HttpErrorResponse) {
    let errBody = new ResponseTemplateDto<any>();

    let errorMessage = 'Error';
    if (error.status == 403 && error.error.ErrorMessage != "refresh_token_expired_error") {
      errorMessage = 'You do not have permision for access';
      //this.commonService.showToastError(errorMessage);

      return throwError(error);
    }

    if (error.status != 401 && error.status >= 400 && error.status <= 500 && error.error.ErrorMessage != "refresh_token_expired_error") {
      errBody = error.error ?? error.message;
      /*this.commonService.showToastError(
        errBody.ErrorMessage?.replace('_', ' ') || 'Error'
      );*/
      return this.logAndThrowError(
        errBody,
        req.method +
        JSON.stringify(req.urlWithParams) +
        JSON.stringify(req.body)
      );
    }

    errBody.IsSuccess = false;
    errBody.Data = false;

    errBody.ErrorMessage = errorMessage;
    return this.logAndThrowError(
      errBody,
      req.method + JSON.stringify(req.urlWithParams) + JSON.stringify(req.body)
    );
  }

  logAndThrowError(errBody: any, origin?: string | null) {
    this.loggerService.errorObject(errBody, origin);
    return throwError(() => new Error(errBody));
  }
}
