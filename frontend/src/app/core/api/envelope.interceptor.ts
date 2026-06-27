import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiError } from './api-error';
import { ApiEnvelope } from './envelope.types';

export const envelopeInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object' && 'success' in event.body) {
        const body = event.body as ApiEnvelope<unknown>;
        if (!body.success) {
          throw new ApiError(event.status, body.message || 'Request failed');
        }
        return event.clone({ body: body.data ?? body });
      }
      return event;
    }),
  );
};
