//#region Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentUrlService } from '../environment-url.service';
import { UserForRegistrationDto } from '../../interfaces/user/userForRegistration';
import { RegistrationResponseDto } from '../../interfaces/response/registrationResponseDto';
import { UserForAuthenticationDto } from '../../interfaces/user/userForAuthenticationDto';
import { AuthResponseDto } from '../../interfaces/response/authResponseDto';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPassword } from '../../interfaces/user/forgotPassword';
import { ResetPasswordDto } from '../../interfaces/user/ResetPasswordDto';
import { CustomEncoder } from '../../common/customEncoder';
import { TwoFactorDto } from '../../interfaces/twoFactor/twoFactorDto';
//#endregion

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

  //#region Is User Authenticated
  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    console.log(
      `isUserAuthenticated:  ${token && !this.jwtHelper.isTokenExpired(token)}`
    );
    // if (token && !this.jwtHelper.isTokenExpired(token)) return true;
    //
    // return false;

    return !!(token && !this.jwtHelper.isTokenExpired(token));
  };

  //#endregion

  //#region Is User in Role
  public isUserInRole = (expectedRole: string): boolean => {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token!);
    const role =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    return role === expectedRole;
  };

  //#endregion

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

  //#region Two step login
  public twoStepLogin = (route: string, body: TwoFactorDto) => {
    return this.http.post<AuthResponseDto>(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };
  //#endregion

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

  //#region Cofnirm Email
  public confirmEmail = (route: string, token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('token', token);
    params = params.append('email', email);

    return this.http.get(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      { params: params }
    );
  };

  //#endregion
}
