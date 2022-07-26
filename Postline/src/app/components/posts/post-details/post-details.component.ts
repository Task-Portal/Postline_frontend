import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { PostsRepositoryService } from '../../../services/repositories/posts-repository.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IPost } from '../../../interfaces/post/ipost';
import { postsRoutes } from '../../../routes/postsRoutes';
import { AlertService } from '../../../services/alert.service';
import {Location} from '@angular/common';
import {IPointForCreationDto} from "../../../interfaces/Point/pointForCreationDto";
import {PointRepositoryService} from "../../../services/repositories/point-repository.service";
import {pointRoutes} from "../../../routes/pointRoutes";
import Swal from "sweetalert2";
import { ICreatePointResponseDto} from "../../../interfaces/Point/createPointResponseDto";

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
    private location: Location,
    private pointRepo:PointRepositoryService
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

  handleRating(isUp:boolean){

    let point:IPointForCreationDto = {
      isIncrement:isUp,
      postId: this.post.id
    }

    this.pointRepo.create(pointRoutes.createPoint,point).subscribe({
      next: (res:ICreatePointResponseDto) => {
        console.log("Response: ",res)
        if (res.message) Swal.fire(res.message)
        this.post.rating=res.count
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.alert.error(this.errorHandler.errorMessage, {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      },
    });

  }
}
