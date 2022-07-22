import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {EnvironmentUrlService} from "../environment-url.service";
import {ICategory} from "../../interfaces/icategory";
import {PostForCreationDto} from "../../interfaces/post/postForCreationDto";
import {ICategoryForCreation} from "../../interfaces/Category/CategoryForCreation";
import {IPostForUpdateDto} from "../../interfaces/post/postForUpdateDto";
import {ICategoryForUpdateDto} from "../../interfaces/Category/CategoryForUpdateDto";

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService {

  constructor(private http: HttpClient,
              private envUrl: EnvironmentUrlService) { }

  public getCategories = (route: string) => {
    return this.http.get<ICategory[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  public create = (route: string, body: ICategoryForCreation) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
  }

  public delete = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public update = (route: string, body:ICategoryForUpdateDto) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
  }


  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  };
}
