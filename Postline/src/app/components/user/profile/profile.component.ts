import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IPost} from '../../../interfaces/post/ipost';
import {PostsRepositoryService} from '../../../services/repositories/posts-repository.service';

import {postsRoutes} from "../../../routes/postsRoutes";
import {Post} from "../../../entities/post";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';




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
      this.dataSource.data = res as IPost[];
    })

  }
  public redirectToDetails = (id: string) => {
    console.log("Id: ", id)
    let url: string = `/user/post/${id}`;
    this.router.navigate([url]);
  }
  public redirectToUpdate = (id: string) => {
    const updateUrl: string = `/user/update/${id}`;
    this.router.navigate([updateUrl]);
  }
  public redirectToDelete = (id: string) => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
       this.deletePost(id)
      }
    })

  }

  private deletePost(id:string){

    this.repoService.delete(postsRoutes.deletePost(id)).subscribe({
      next:(res)=>{
      this.dataSource.data=  this.dataSource.data.filter(s=>s.id!=id)
        Swal.fire({
          title: 'Hurray!!',
          text:   "Post has been deleted successfully",
          icon: 'success'
        });

      },
      error:(res)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    })
  }

}
