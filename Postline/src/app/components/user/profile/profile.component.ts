import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../interfaces/user/user';
import { IPost } from '../../../interfaces/ipost';
import { PostsRepositoryService } from '../../../services/repositories/posts-repository.service';
import { first } from 'rxjs';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: IUser;
  posts: IPost[];
  //#region for alert
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  //endregion
  constructor(
    private authService: AuthService,
    private getPostService: PostsRepositoryService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.alertService.info('here in ngOnit', this.options);
    this.user = this.authService.currentUser$.value;
    this.alertService.info(`User: ${this.user.id}`, this.options);
    this.getPostService
      .getUserPosts(this.user.id)
      .pipe(first())
      .subscribe((posts) => (this.posts = posts));
    this.alertService.info(`Getting posts: ${this.posts}`);
  }
}
