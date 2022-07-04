import { IAuthStatus } from './authStatus';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from './user/user';
import { Role } from '../enums/auth.enum';
import { IServerAuthResponse } from './response/serverAuthResponse';
import { UserForRegistrationDto } from './user/userForRegistration';

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>;
  readonly currentUser$: BehaviorSubject<IUser>;
  login(email: string, password: string): Observable<void>;
  logout(clearToken?: boolean): void;

  registration(u: UserForRegistrationDto): Observable<IServerAuthResponse>;
  getToken(): string;
  checkEmail(email: string): Observable<boolean>;
  checkName(userName: string): Observable<boolean>;
}
