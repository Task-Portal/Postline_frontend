import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost } from '../../interfaces/ipost';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsRepositoryService {
  constructor(private httpClient: HttpClient) {}

  public getAllPosts(): Observable<IPost[]> {
    return this.httpClient.get<IPost[]>(`${environment.baseUrl}/post`);
  }
  public getUserPosts(id: string): Observable<IPost[]> {
    return this.httpClient.get<IPost[]>(
      `${environment.baseUrl}/post/user/${id}`
    );
  }
}
