import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from "@auth0/auth0-angular";
import {inject} from "@angular/core";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

export const authenticationErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.toString().includes('Missing Refresh Token')) auth.loginWithPopup()
      return throwError(() => error);
    })
  );
};
