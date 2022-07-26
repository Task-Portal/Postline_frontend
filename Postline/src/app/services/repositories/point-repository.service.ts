import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentUrlService} from "../environment-url.service";
import {BaseRepositoryService} from "./base-repository.service";
import {IPointForCreationDto} from "../../interfaces/Point/pointForCreationDto";
import {ICreatePointResponseDto} from "../../interfaces/Point/createPointResponseDto";

@Injectable({
  providedIn: 'root'
})
export class PointRepositoryService extends BaseRepositoryService{

  constructor(private http: HttpClient,
              private envUrl: EnvironmentUrlService) {
    super();
  }

  public create = (route: string, body: IPointForCreationDto) => {
    return this.http.post<ICreatePointResponseDto>(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
  }



}
