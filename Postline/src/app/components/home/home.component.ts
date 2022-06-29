import { Component, OnInit } from '@angular/core';
import { PostsRepositoryService } from '../../services/repositories/posts-repository.service';
import { IPost } from '../../interfaces/ipost';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AlertService } from '../../services/alert.service';
import { posts } from '../../routes/posts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //#region for alert
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  //endregion

  constructor(
    private repository: PostsRepositoryService,
    private errorHandler: ErrorHandlerService,
    private alert: AlertService
  ) {}

  posts: IPost[];

  ngOnInit(): void {
    this.getAllPosts();
  }

  private getAllPosts = () => {
    this.repository.getPosts(posts.getAllPost).subscribe({
      next: (posts: IPost[]) => {
        this.posts = posts;
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.alert.error(this.errorHandler.errorMessage, this.options);
      },
    });
  };
}
