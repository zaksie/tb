import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {retry, throwError, timer} from "rxjs";
import {catchError} from "rxjs/operators";

const maxRetries = 5
const retryDelay = 100

export const retryInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.headers.has('X-Skip-Retry')) {
    return next(request);
  }

  return next(request).pipe(
    retry({
      count: maxRetries,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status === 429) {
          console.log(
            `Request failed with status ${error.status}. Retry attempt ${retryCount} of ${maxRetries} after ${retryDelay}ms delay`
          );
          return timer(retryDelay);
        }
        return throwError(() => error);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(
        `Max retries (${maxRetries}) reached for request. Failing with status ${error.status}.`
      );
      return throwError(() => error);
    })
  );
};


