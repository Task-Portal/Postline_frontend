import { Component, OnInit } from '@angular/core';
import { PostsRepositoryService } from '../../services/repositories/posts-repository.service';
import { IPost } from '../../interfaces/ipost';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AlertService } from '../../services/alert.service';
import { postsRoutes } from '../../routes/postsRoutes';
import { Router } from '@angular/router';

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
    private alert: AlertService,
    private router: Router
  ) {}

  posts: IPost[];

  ngOnInit(): void {
    this.getAllPosts();
  }

  public getPostDetails = (id: string) => {
    // const detailsUrl: string = `/owner/details/${id}`;
    this.router.navigate([postsRoutes.getOnePost(id)]);
  };

  private getAllPosts = () => {
    this.repository.getPosts(postsRoutes.getAllPost).subscribe({
      next: (posts: IPost[]) => {
        this.posts = posts;
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.alert.error(this.errorHandler.errorMessage, this.options);
      },
    });
  };

  public executeSelectedChange = (event: any) => {
    console.log(event);
  };
}
