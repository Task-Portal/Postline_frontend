import { IAuthStatus } from './authStatus';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from './user';
import { Role } from '../enums/auth.enum';
import { IServerAuthResponse } from './serverAuthResponse';
import { IUserForRegistration } from './userForRegistration';

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>;
  readonly currentUser$: BehaviorSubject<IUser>;
  login(email: string, password: string): Observable<void>;
  logout(clearToken?: boolean): void;

  registration(u: IUserForRegistration): Observable<IServerAuthResponse>;
  getToken(): string;
  checkEmail(email: string): Observable<boolean>;
  checkName(userName: string): Observable<boolean>;
}
