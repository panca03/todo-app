import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const body = error.error;
        const status = error.status;
        let message = 'Request failed';
        let errors: Record<string, string[]> | undefined;

        if (body && typeof body === 'object') {
          if ('message' in body && typeof body.message === 'string') {
            message = body.message;
          }
          if ('errors' in body && body.errors && typeof body.errors === 'object') {
            errors = body.errors as Record<string, string[]>;
          }
        }

        return throwError(() => new ApiError(status, message, errors));
      }

      return throwError(() => error);
    }),
  );
};
