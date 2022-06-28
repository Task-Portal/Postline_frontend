import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost } from '../interfaces/ipost';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetPostsService {
  constructor(private httpClient: HttpClient) {}

  public getPosts(): Observable<IPost[]> {
    return this.httpClient.get<IPost[]>(`${environment.baseUrl}/post`);
  }
}
