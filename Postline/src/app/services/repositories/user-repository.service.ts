import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {EnvironmentUrlService} from "../environment-url.service";
import {ICategory} from "../../interfaces/icategory";
import {PostForCreationDto} from "../../interfaces/post/postForCreationDto";
import {ICategoryForCreation} from "../../interfaces/Category/CategoryForCreation";
import {IPostForUpdateDto} from "../../interfaces/post/postForUpdateDto";
import {ICategoryForUpdateDto} from "../../interfaces/Category/CategoryForUpdateDto";
import {IUserForAuthenticationDto} from "../../interfaces/user/userForUpdateMeDto";
import {BaseRepositoryService} from "./base-repository.service";

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService extends BaseRepositoryService{

  constructor(private http: HttpClient,
              private envUrl: EnvironmentUrlService) {
    super();
  }

  public getUser = (route: string) => {
    return this.http.get<IUserForAuthenticationDto>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };




  public update = (route: string, body:IUserForAuthenticationDto) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
  }



}
