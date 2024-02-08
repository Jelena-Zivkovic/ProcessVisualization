import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoaderInterceptorService } from "./loader-interceptor.service";
import { MapDataInterceptorService } from "./map-data-interceptor.service";
import { ErrorInterceptorService } from "./error-interceptor.service";

export const interceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MapDataInterceptorService, multi: true },
] 
