import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Constants } from 'src/app/app.constants';
import { AuthenticationService } from './authentication.service';

export class BaseApiService {
  http: HttpClient;
  authenticationService: AuthenticationService;

  constructor(injector: Injector) {
    this.http = injector.get(HttpClient);
    this.authenticationService = injector.get(AuthenticationService);
  }

  getHttpParams(
    showLoader = true,
    params?: any,
    body?: any,
    redirectHeader = false
  ) {
    let httpParams: HttpParams = new HttpParams();
    let headers = this.authenticationService.generateRequestHeaders();
    if (showLoader)
      headers = headers.append(Constants.SHOW_LOADER, showLoader.toString());
    /*if(redirectHeader){
      headers = headers.append(Constants.REDIRECT_HEADER, 'true');
    }*/
    if (params) {
      Object.keys(params).forEach((param) => {
        if (params[param] != undefined && !Number.isNaN(params[param])) {
          if (Array.isArray(params[param])) {
            params[param].forEach((item: any, index: any) => {
              httpParams = httpParams.append(param + "[" + index + "]", item.toString());
            });
          }
          else if (params[param] instanceof Date) {
            httpParams = httpParams.append(
              param,
              (params[param] as Date).toISOString()
            );
          } else
            httpParams = httpParams.append(param, params[param].toString());
        }
      });
    }
    return {
      params: httpParams,
      headers: headers,
      body: body,
    };
  }
}
