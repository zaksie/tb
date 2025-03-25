import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

export const authenticationErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // const auth = inject(AuthService)
  try {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // if(error.toString().includes('Missing Refresh Token'))
        //   auth.loginWithPopup().subscribe()
        return throwError(() => error);
      })
    )
  }catch{}
  return next(req);
}
