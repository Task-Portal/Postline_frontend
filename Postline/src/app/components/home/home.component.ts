import { Component, OnInit } from '@angular/core';
import { PostsRepositoryService } from '../../services/repositories/posts-repository.service';
import { IPost } from '../../interfaces/ipost';
import { first } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private getPostService: PostsRepositoryService) {}

  posts: IPost[];

  ngOnInit(): void {
    this.getPostService
      .getAllPosts()
      .pipe(first())
      .subscribe((posts) => (this.posts = posts));
  }
}
