import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentUrlService} from "../environment-url.service";
import {ICategory} from "../../interfaces/icategory";

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
}
