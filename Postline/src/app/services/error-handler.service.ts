import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements HttpInterceptor {
  public errorMessage: string = '';
  constructor(private router: Router) {}
  public handleError = (error: HttpErrorResponse) => {
    if (error.status === 500) {
      this.handle500Error(error);
    } else if (error.status === 404) {
      this.handle404Error(error);
    } else if (error.status === 400) {
      this.errorMessage = this.handleBadRequest(error);
    } else if (error.status === 401) {
      this.handleUnauthorized(error);
    } else {
      this.handleOtherError(error);
    }
  };

  private handleUnauthorized = (error: HttpErrorResponse) => {
    console.log(`handleUnauthorized `);
    console.log(`Error - message: ${error.message}`);
    if (this.router.url === '/authentication/login') {
      return 'Authentication failed. Wrong Username or Password';
    } else {
      this.router.navigate(['/authentication/login'], {
        queryParams: { returnUrl: this.router.url },
      });

      return error.message;
    }
  };

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  };
  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  };
  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
  };
  private createErrorMessage = (error: HttpErrorResponse) => {
    this.errorMessage = error.error ? error.error : error.statusText;
  };

  private handleBadRequest = (error: HttpErrorResponse): string => {
    if (this.router.url === '/authentication/register') {
      let message = '';
      const values = Object.values(error.error.errors);
      values.map((m) => {
        message += m + '<br>';
      });
      return message.slice(0, -4);
    } else {
      return error.error ? error.error : error.message;
    }
  };

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }
}
