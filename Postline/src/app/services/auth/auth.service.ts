import { Injectable } from '@angular/core';
import { IAuthService } from '../../interfaces/iauthService';
import {
  BehaviorSubject,
  catchError,
  filter,
  first,
  map,
  mergeMap,
  Observable,
  of,
  pipe,
  tap,
  throwError,
} from 'rxjs';
import { IAuthStatus } from '../../interfaces/authStatus';
import { IUser } from '../../interfaces/user';
import { defaultAuthStatus } from '../../entities/defaultAuthStatus';
import { User } from '../../entities/user';
import { IServerAuthResponse } from '../../interfaces/serverAuthResponse';
import { CacheService } from './cache.service';
import decode from 'jwt-decode';
import { transformError } from '../../common/transformError';
import { Role } from '../../enums/auth.enum';
import { debug, RxJsLoggingLevel } from '../../common/rxjsDebuger';
import { IUserForRegistration } from '../../interfaces/userForRegistration';

@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  protected constructor() {
    super();
    if (this.hasExpiredToken()) {
      this.logout(true);
    } else {
      this.authStatus$.next(this.getAuthStatusFromToken());
      // To load user on browser refresh, resume pipeline must activate on the next cycle
      // Which allows for all services to constructed properly
      setTimeout(() => this.resumeCurrentUser$.subscribe(), 0);
    }
  }

  private getAndUpdateUserIfAuthenticated = pipe(
    filter((status: IAuthStatus) => status.isAuthenticated),
    mergeMap(() => this.getCurrentUser()),
    map((user: IUser) => this.currentUser$.next(user)),
    catchError(transformError)
  );

  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());
  protected readonly resumeCurrentUser$ = this.authStatus$.pipe(
    this.getAndUpdateUserIfAuthenticated
  );

  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>;
  protected abstract registerUser(
    u: IUserForRegistration
  ): Observable<IServerAuthResponse>;

  protected abstract checkEmailCustom(email: string): Observable<boolean>;
  protected abstract checkUserNameCustom(userName: string): Observable<boolean>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<User>;

  login(email: string, password: string): Observable<void> {
    this.clearToken();

    const loginResponse$ = this.authProvider(email, password).pipe(
      map((value) => {
        console.log('Value in login function 62', value);
        if (value.accessToken !== undefined) this.setToken(value.accessToken);
        // const token = decode(value.accessToken)
        // return this.transformJwtToken(token)
        return this.getAuthStatusFromToken(); // Keeping the code DRY!
      }),
      tap((status) => this.authStatus$.next(status)),
      // filter((status: IAuthStatus) => status.isAuthenticated),
      // mergeMap(() => this.getCurrentUser()),
      // map((user: IUser) => this.currentUser$.next(user)),
      // catchError(transformError)
      this.getAndUpdateUserIfAuthenticated // Keeping the code DRY!
    );

    loginResponse$.subscribe({
      error: (err) => {
        this.logout();
        return throwError(err);
      },
    });

    return loginResponse$;
  }

  logout(clearToken?: boolean): void {
    if (clearToken) {
      this.clearToken();
    }
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0);
  }

  //#region Token functions
  protected setToken(jwt: string) {
    this.setItem('jwt', jwt);
  }
  getToken(): string {
    return this.getItem('jwt') ?? '';
  }
  protected clearToken() {
    this.removeItem('jwt');
  }

  protected hasExpiredToken(): boolean {
    const jwt = this.getToken();
    if (jwt) {
      const payload = decode(jwt) as any;
      return Date.now() >= payload.exp * 1000;
    }
    return true;
  }

  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(decode(this.getToken()));
  }

  //#endregion

  registration(user: IUserForRegistration): Observable<IServerAuthResponse> {
    return this.registerUser(user);
  }

  checkEmail(email: string): Observable<boolean> {
    return this.checkEmailCustom(email);
  }

  checkName(userName: string): Observable<boolean> {
    return this.checkUserNameCustom(userName);
  }
}
