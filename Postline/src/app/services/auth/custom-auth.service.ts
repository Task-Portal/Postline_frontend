import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, distinctUntilChanged, map, Observable } from 'rxjs';
import { IServerAuthResponse } from '../../interfaces/serverAuthResponse';
import { Role } from '../../enums/auth.enum';
import { IAuthStatus } from '../../interfaces/authStatus';
import { $enum } from 'ts-enum-util';
import { IJwtToken } from '../../interfaces/jwtToken';
import { User } from '../../entities/user';
import { environment } from '../../../environments/environment';
import { transformError } from '../../common/transformError';
import { IUser } from '../../interfaces/user';
import { IUserForRegistration } from '../../interfaces/userForRegistration';

@Injectable()
export class CustomAuthService extends AuthService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  //Todo change mockServer
  protected authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    return this.httpClient.post<IServerAuthResponse>(
      `${environment.mockServer}/auth/login`,
      {
        email,
        password,
      }
    );
  }

  protected registerUser(
    user: IUserForRegistration
  ): Observable<IServerAuthResponse> {
    return this.httpClient.post<IServerAuthResponse>(
      `${environment.baseUrl}/auth`,
      user
    );
  }

  protected checkEmailCustom(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${environment.baseUrl}/auth/checkEmail`,
      { email }
    );
  }
  protected checkUserNameCustom(userName: string): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${environment.baseUrl}/auth/checkUserName`,
      { userName }
    );
  }

  protected transformJwtToken(token: IJwtToken): IAuthStatus {
    return {
      isAuthenticated: !!token.id,
      userId: token.id,
      userRole: $enum(Role).asValueOrDefault(token.role, Role.None),
    } as IAuthStatus;
  }

  protected getCurrentUser(): Observable<User> {
    return this.httpClient
      .get<IUser>(`${environment.mockServer}/auth/me`)
      .pipe(map(User.Build, catchError(transformError)));
  }
}
