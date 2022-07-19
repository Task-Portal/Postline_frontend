import {Component, OnInit} from '@angular/core';
import {PostsRepositoryService} from '../../services/repositories/posts-repository.service';
import {IPost} from '../../interfaces/post/ipost';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {AlertService} from '../../services/alert.service';
import {postsRoutes} from '../../routes/postsRoutes';
import {Router} from '@angular/router';
import {IPostWithPagination} from "../../interfaces/post/ipostWithPagination";
import {categoryRoutes} from "../../routes/categoryRoutes";
import {CategoryRepositoryService} from "../../services/repositories/category-repository.service";
import {ICategory} from "../../interfaces/icategory";
import {MiscellaneousService} from "../../services/miscellaneous.service";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  categories: ICategory[]
  posts: IPost[];

  //#region Filter
  categoryName: string
  firstPanel = "Filter"
  fromDate: string
  toDate: string

  //#endregion

  //#region for alert
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  //endregion


  //#region My Paginator
  pageSize: number = 5
  hasNext: boolean
  hasPrevious: boolean
  currentPage: number = 1
  totalPages: number

  //#endregion


  constructor(
    private repository: PostsRepositoryService,
    private errorHandler: ErrorHandlerService,
    private alert: AlertService,
    private router: Router,
    private categoryRepo: CategoryRepositoryService,
    private mis: MiscellaneousService
  ) {
  }


  ngOnInit(): void {
    let size: number = Number(localStorage.getItem("NumberOfPages_home"))
    if (size !== 0) this.pageSize = size
    this.getAllPosts();
    this.getCategories()
  }

  public getPostDetails = (id: string) => {
    this.router.navigate([postsRoutes.getOnePost(id)]);
  };

  getCategories() {

    this.categoryRepo.getCategories(categoryRoutes.getAllCategories).subscribe(res => {
      this.categories = res;
      console.log("Getting Categories: ", this.categoryName)
    })
  }

  public getAllPosts = () => {

    const link = this.getHref()
    if (link == "") return
    console.log("link: ", link)

    this.repository.getPosts(link).subscribe({
      next: (response: IPostWithPagination) => {

        this.hasNext = response.data.hasNext
        this.hasPrevious = response.data.hasPrevious
        this.pageSize = response.data.pageSize
        this.currentPage = response.data.currentPage
        this.posts = response.posts
        this.totalPages = response.data.totalPages

      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.alert.error(this.errorHandler.errorMessage, this.options);
      },
    });

  };


//#region Paginator functions
  onClick(text: string) {
    text === "right" ? this.currentPage += 1 : this.currentPage -= 1

    this.getAllPosts()
  }

  handleNumberOfPages(text: any) {

    if (text.trim().length > 0) {
      this.pageSize = Number(text);
      this.getAllPosts()
      localStorage.setItem("NumberOfPages_home", text)
    }
  }

//#endregion

  onClear() {
    this.categoryName = ""
    this.toDate = ""
    this.fromDate = ""
  }

  getHref(): (string) {

    if (!this.toDate && this.fromDate) {
      this.toDate = this.mis.addDays(new Date(), 1).toISOString().split('T')[0]
    }


    if (this.fromDate && this.fromDate == this.toDate) {
      this.toDate = this.mis.addDays(new Date(this.toDate), 1).toISOString().split('T')[0]
    }


    if (this.categoryName && this.fromDate) {

      return this.AreDatesWrong() ? "" :
        postsRoutes.getPostsByDateAndCategory(this.currentPage, this.pageSize, this.fromDate, this.toDate, this.categoryName)
    } else if (this.categoryName) {
      return postsRoutes.getPostsByCategory(this.currentPage, this.pageSize, this.categoryName)
    } else if (this.fromDate) {
      return this.AreDatesWrong() ? "" :
        postsRoutes.getPostsByDate(this.currentPage, this.pageSize, this.fromDate, this.toDate,)
    }

    return postsRoutes.getAllPost(this.currentPage, this.pageSize)

  }

  AreDatesWrong(): boolean {
    if (new Date(this.fromDate) > new Date(this.toDate)) {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `From date ${this.fromDate} can't be bigger than End date ${this.toDate} in the filter panel`,

      })
      this.toDate = ""
      return true
    }
    return false
  }


}
