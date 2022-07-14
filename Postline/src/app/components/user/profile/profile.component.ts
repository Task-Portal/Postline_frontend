import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IPost} from '../../../interfaces/post/ipost';
import {PostsRepositoryService} from '../../../services/repositories/posts-repository.service';

import {postsRoutes} from "../../../routes/postsRoutes";
import {Post} from "../../../entities/post";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public displayedColumns = ['title','postDate','categoryName', 'rating', 'details','update', 'delete'];

  public dataSource = new MatTableDataSource<Post>();

  //#region Sorting,, Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  //#endregion

  //#region for alert
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  //endregion

  //#region Ctor
  constructor(
    private repoService: PostsRepositoryService, private router:Router
  ) {
  }
  //#endregion

  //#region Filter
  public doFilter = (value: any) => {
    this.dataSource.filter = value.target.value?.trim().toLocaleLowerCase();

  }
  //#endregion




  ngOnInit(): void {

    this.getAllPosts()
  }


  public getAllPosts = () => {

    this.repoService.getUserPosts(postsRoutes.getUserPosts).subscribe(res => {
      console.log("Data from server, user posts: ", res)
      this.dataSource.data = res as IPost[];
    })

  }
  public redirectToDetails = (id: string) => {
    console.log("Id: ", id)
    let url: string = `/user/post/${id}`;
    this.router.navigate([url]);
  }
  public redirectToUpdate = (id: string) => {

  }
  public redirectToDelete = (id: string) => {

  }

}
