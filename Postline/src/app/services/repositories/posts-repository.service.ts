import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost } from '../../interfaces/ipost';
import { environment } from '../../../environments/environment';
import { EnvironmentUrlService } from '../environment-url.service';

@Injectable({
  providedIn: 'root',
})
export class PostsRepositoryService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService
  ) {}

  public getPosts = (route: string) => {
    return this.http.get<IPost[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public getUserPosts(id: string): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${environment.baseUrl}/post/user/${id}`);
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
