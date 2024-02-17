import { Injectable, Injector } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignInDto } from 'src/dtos/sign-in/sign-in.dto';
import { CommonService } from './common.service';
import { SharedService } from './shared.service';
import { RouterService } from './router.service';
import { AuthenticationResponseDto } from 'src/dtos/authentication-response/authentication-response.dto';
import { Constants } from 'src/app/app.constants';

@Injectable()
export class AuthenticationService {
  key: string;
  commonService: CommonService;
  sharedService: SharedService;
  routerService: RouterService;
  private loggedIn!: boolean;
  constructor(
    private httpService: HttpClient,
    private injector: Injector
  ) {
    this.key = 'login-data';
    this.commonService = this.injector.get(CommonService);
    this.sharedService = this.injector.get(SharedService);
    this.routerService = this.injector.get(RouterService);
  }

  login(signIn: SignInDto) {
    let url = `${Constants.API_ENDPOINT}Users/SignIn`;
    let body = {
      userName: signIn.Email,
      password: signIn.Password,
    };

    return this.handleLoginLogic(url, signIn);
  }

  private handleLoginLogic(url: string, body: any) {
    this.commonService.showLoader();
    return this.httpService
      .post<Response>(url, body)
      .pipe(
        map((res: Response) => {
          let body: any;
          body = res;
          if (body.IsSuccess) {
            if (body.Data.FirstTime) {
              return this.routerService.navigate('validate-registration');
            }
            return this.mapData(res);
          } else {
            //custom error handler
            return this.customMapError(body.ErrorMessage);
          }
        }),
        catchError((err) => {
          return this.mapError(err);
        })
      )
      .pipe(
        map(() => {
          this.routerService.navigate("/");
          this.sharedService.broadcast(Constants.EV_LOGIN_STATE_CHANGED, true);
        })
      );
  }

  private customMapError(msg: String) {
    this.commonService.hideLoader();

    //regex solution
    alert(msg.replace(/_/g, ' '));
    return {};
  }

  private mapData(res: Response) {
    this.commonService.hideLoader();
    let body: any,
      text = true,
      data: any = res;
    //res.json().then(value  => {body = value;  data = value;});
    body = res;
    //res.text().then(value => text = value);
    if (text) {
      if (body.Data != undefined) {
        data = body.Data;
      }
    }

    localStorage.setItem(this.key, JSON.stringify(data));
    return body || {};
  }

  // NOTE: This code should also be put in HandleError function in connection service.
  private mapError(res: Response | any) {
    this.commonService.hideLoader();
    let errMsg: string = '';
    if (res instanceof Response) {
      let body = '';
      res.text().then((value) => {
        body = value || '';
      });
    } else {
      errMsg = res.message ? res.message : res.toString();
    }

    if (errMsg.indexOf('"isTrusted": true') > -1) {
      alert('Webapi is offline');
    }

    if (res.status == 400) {
      let errorJson = JSON.parse(errMsg);
      let data = errorJson.Data;
      data.map((x: any) => {
        alert(x.Value.replace(/_/g, ' '));
      });
    }

    return throwError(res);
  }

  logout(): Observable<boolean> {
    //This should be replaced with real api call to invalidate tokens
    return new Observable((observer) => {
      let url = `${Constants.API_ENDPOINT}Authentication/Logout`;
      var _headers = this.generateRequestHeaders();
      this.httpService.get<void>(url, { headers: _headers }).subscribe({
        next: (res: any) => { },
        error: (err) => { },
      });
      localStorage.removeItem(this.key);
      observer.next(true);
    });
  }

  getAccessToken(): string | null {
    var data = <AuthenticationResponseDto>(
      JSON.parse(localStorage.getItem(this.key) || '{}')
    );
    if (data == null || data == undefined) {
      return null;
    }
    return data.AccessToken;
  }

  isAuthenticated(): boolean {
    var data = <AuthenticationResponseDto>(
      JSON.parse(localStorage.getItem(this.key) || '{}')
    );
    if (data == null || data == undefined) {
      return false;
    }

    if (data.AccessToken == null || data.AccessToken == undefined) {
      return false;
    }
    return true;
  }

  generateRequestHeaders(): HttpHeaders {
    var headers = null;
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.getAccessToken(),
    });
    //headers.append('Authorization', 'Bearer ' + this.getAccessToken());
    return headers;
  }

  isTokenActive() {
    var _headers = this.generateRequestHeaders();
    var requestOptions = { headers: _headers };
    return this.httpService
      .get(
        Constants.API_ENDPOINT + 'Rooms',//Users/Profile
        requestOptions
      )
      .pipe(
        map((res: any) => {
          //this.setProfileData(res);
          return true;
        }),
        catchError((err) => {
          if (err.status == 401) {
            return of(false);
          } else {
            return of(true);
          }
        })
      );
  }

  getLoginData(): AuthenticationResponseDto {
    return <AuthenticationResponseDto>JSON.parse(localStorage.getItem(this.key) ?? "{}");
  }
}
