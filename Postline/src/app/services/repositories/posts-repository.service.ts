import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EnvironmentUrlService } from '../environment-url.service';
import {PostForCreationDto} from "../../interfaces/post/postForCreationDto";
import {IPost} from "../../interfaces/post/ipost";
import {IPostForUpdateDto} from "../../interfaces/post/postForUpdateDto";
import {IPostWithPagination} from "../../interfaces/post/ipostWithPagination";

@Injectable({
  providedIn: 'root',
})
  export class PostsRepositoryService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService
  ) {}

  public getPosts = (route: string) => {
    return this.http.get<IPostWithPagination>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public getPost = (route: string) => {
    return this.http.get<IPost>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public getUserPosts(route: string) {
    return this.http.get<IPost[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  }

  public create = (route: string, body:PostForCreationDto) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
  }


  public update = (route: string, body:IPostForUpdateDto) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
  }


  public delete = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  };
}
