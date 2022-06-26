import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwt = this.authService.getToken();
    const authRequest = req.clone({
      setHeaders: { authorization: `Bearer ${jwt}` },
    });
    return next.handle(authRequest).pipe(
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login'], {
            queryParams: { redirectUrl: this.router.routerState.snapshot.url },
          });
        }

        return throwError(err);
      })
    );
  }
}
// intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   return next.handle(request).pipe(catchError(err => {
//     if ([401, 403].includes(err.status) && this.accountService.userValue) {
//       // auto logout if 401 or 403 response returned from api
//       this.accountService.logout();
//     }
//
//     const error = err.error?.message || err.statusText;
//     console.error(err);
//     return throwError(error);
//   }))
// }
