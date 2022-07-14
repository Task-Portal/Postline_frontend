import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { PostsRepositoryService } from '../../../services/repositories/posts-repository.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IPost } from '../../../interfaces/post/ipost';
import { postsRoutes } from '../../../routes/postsRoutes';
import { AlertService } from '../../../services/alert.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit {
  post: IPost;

  constructor(
    private repository: PostsRepositoryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private alert: AlertService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getPostDetails();
  }

  getPostDetails = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    this.repository.getPost(postsRoutes.getOnePost(id)).subscribe({
      next: (post: IPost) => (this.post = post),
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.alert.error(this.errorHandler.errorMessage, {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      },
    });
  };

  backClicked() {
    this.location.back();
  }
}
