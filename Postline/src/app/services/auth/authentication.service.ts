import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from '../environment-url.service';
import { UserForRegistrationDto } from '../../interfaces/user/userForRegistration';
import { RegistrationResponseDto } from '../../interfaces/response/registrationResponseDto';
import { UserForAuthenticationDto } from '../../interfaces/user/userForAuthenticationDto';
import { AuthResponseDto } from '../../interfaces/response/authResponseDto';
import { CacheService } from './cache.service';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends CacheService {
  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService,
    private jwtHelper: JwtHelperService
  ) {
    super();
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    console.log(
      `isUserAuthenticated:  ${token && !this.jwtHelper.isTokenExpired(token)}`
    );
    if (token && !this.jwtHelper.isTokenExpired(token)) return true;

    return false;

    // return !!(token && !this.jwtHelper.isTokenExpired(token));
  };

  //#region Register User, CheckEmail, Login User, Logout
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
    this.removeItem('token');
    this.sendAuthStateChangeNotification(false);
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
