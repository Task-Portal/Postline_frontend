import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from '../environment-url.service';
import { UserForRegistrationDto } from '../../interfaces/user/userForRegistration';
import { RegistrationResponseDto } from '../../interfaces/response/registrationResponseDto';
import { UserForAuthenticationDto } from '../../interfaces/user/userForAuthenticationDto';
import { AuthResponseDto } from '../../interfaces/response/authResponseDto';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPassword } from '../../interfaces/user/forgotPassword';
import { ResetPasswordDto } from '../../interfaces/user/ResetPasswordDto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService,
    private jwtHelper: JwtHelperService
  ) {}

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    console.log(
      `isUserAuthenticated:  ${token && !this.jwtHelper.isTokenExpired(token)}`
    );
    if (token && !this.jwtHelper.isTokenExpired(token)) return true;

    return false;

    // return !!(token && !this.jwtHelper.isTokenExpired(token));
  };

  public isUserInRole = (expectedRole: string): boolean => {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token!);
    const role =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    return role === expectedRole;
  };

  //#region Register User, CheckEmail, Login User, Logout, Forgot Password, Reset Password
  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this.http.post<RegistrationResponseDto>(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };

  public checkEmail = (route: string, email: string) => {
    return this.http.post<boolean>(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      { email }
    );
  };

  public loginUser = (route: string, body: UserForAuthenticationDto) => {
    return this.http.post<AuthResponseDto>(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };

  public logout = () => {
    localStorage.removeItem('token');
    this.sendAuthStateChangeNotification(false);
  };

  public forgotPassword = (route: string, body: ForgotPassword) => {
    return this.http.post(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };

  public resetPassword = (route: string, body: ResetPasswordDto) => {
    return this.http.post(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };

  //endregion

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  public getClaims = (route: string) => {
    return this.http.get(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };
}
