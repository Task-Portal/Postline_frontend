import { Component, OnInit } from '@angular/core';
import { PostsRepositoryService } from '../../services/repositories/posts-repository.service';
import { IPost } from '../../interfaces/post/ipost';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AlertService } from '../../services/alert.service';
import { postsRoutes } from '../../routes/postsRoutes';
import { Router } from '@angular/router';
import { IPostWithPagination } from '../../interfaces/post/ipostWithPagination';
import { categoryRoutes } from '../../routes/categoryRoutes';
import { CategoryRepositoryService } from '../../services/repositories/category-repository.service';
import { ICategory } from '../../interfaces/icategory';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import Swal from 'sweetalert2';
import { IPostParams } from '../../interfaces/post/postParams';
import { IPaginatorParams } from '../../interfaces/paginatorParams';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  categories: ICategory[];
  posts: IPost[];

  //#region Sort Params
  sort = {
    type: ['desc', 'asc'],
    fields: ['title', 'categoryName', 'firstName', 'lastName', 'postDate'],
    selectedField: '',
    selectedType: '',
  };
  //#endregion

  //#region Accordion Names
  firstPanel = 'Filter';
  secondPanel = 'Search';
  thirdPanel = 'Sort';
  //#endregion

  //#region PostParams
  postParams: IPostParams = {
    categoryName: '',
    postFrom: '',
    postTo: '',
    searchTerm: '',
    orderBy: '',
  };
  //#endregion

  //#region for alert
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  //endregion

  //#region My Paginator
  paginator: IPaginatorParams = {
    pageSize: 5,
    hasNext: false,
    hasPrevious: false,
    currentPage: 1,
    totalPages: 0,
  };

  //#endregion

  //#region Ctor
  constructor(
    private repository: PostsRepositoryService,
    private errorHandler: ErrorHandlerService,
    private alert: AlertService,
    private router: Router,
    private categoryRepo: CategoryRepositoryService,
    private mis: MiscellaneousService
  ) {}
  //#endregion

  //#region NgOnInit
  ngOnInit(): void {
    let size: number = Number(localStorage.getItem('NumberOfPages_home'));
    if (size !== 0) this.paginator.pageSize = size;
    this.getAllPosts();
    this.getCategories();
  }
  //#endregion

  //#region Navigate to Details
  public navigateToDetails = (id: string) => {
    this.router.navigate([postsRoutes.getOnePost(id)]);
  };
  //#endregion

  //#region Get Categories
  getCategories() {
    this.categoryRepo
      .getCategories(categoryRoutes.getAllCategories)
      .subscribe((res) => {
        this.categories = res;
      });
  }

  //#endregion

  //#region Get All Posts
  public getAllPosts = () => {
    const link = this.getHref();
    if (link == '') return;
    console.log('link: ', link);

    this.repository.getPosts(link).subscribe({
      next: (response: IPostWithPagination) => {
        this.paginator.hasNext = response.data.hasNext;
        this.paginator.hasPrevious = response.data.hasPrevious;
        this.paginator.pageSize = response.data.pageSize;
        this.paginator.currentPage = response.data.currentPage;
        this.posts = response.posts;
        this.paginator.totalPages = response.data.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.alert.error(this.errorHandler.errorMessage, this.options);
      },
    });
  };
  //#endregion

  //#region Paginator functions
  onClick(text: string) {
    text === 'right'
      ? (this.paginator.currentPage += 1)
      : (this.paginator.currentPage -= 1);
    this.getAllPosts();
  }

  handleNumberOfPages(text: any) {
    if (text.trim().length > 0) {
      this.paginator.pageSize = Number(text);
      this.getAllPosts();
      localStorage.setItem('NumberOfPages_home', text);
    }
  }

  //#endregion

  //#region OnClear
  onClear(text: string) {
    if (text == 'search') {
      this.postParams.searchTerm = '';
    } else if (text === 'filter') {
      this.postParams.categoryName = '';
      this.postParams.postTo = '';
      this.postParams.postFrom = '';
    } else {
      this.sort.selectedType = '';
      this.sort.selectedField = '';
      this.postParams.orderBy = '';
    }
  }

  //#endregion

  //#region Get Href
  getHref(): string {
    if (!this.postParams.postTo && this.postParams.postFrom) {
      this.postParams.postTo = this.mis
        .addDays(new Date(), 1)
        .toISOString()
        .split('T')[0];
    }

    if (
      this.postParams.postFrom &&
      this.postParams.postFrom == this.postParams.postTo
    ) {
      this.postParams.postTo = this.mis
        .addDays(new Date(this.postParams.postTo), 1)
        .toISOString()
        .split('T')[0];
    }

    return this.AreDatesWrong()
      ? ''
      : postsRoutes.generateRoute(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.postParams
        );
  }

  //#endregion

  //#region Are Dates Wrong
  AreDatesWrong(): boolean {
    if (
      this.postParams.postFrom &&
      this.postParams.postTo &&
      new Date(this.postParams.postFrom) > new Date(this.postParams.postTo)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `From date ${this.postParams.postFrom} can't be bigger than End date ${this.postParams.postTo} in the filter panel`,
      });
      this.postParams.postTo = '';
      return true;
    }
    return false;
  }

  //#endregion

  onSort() {
    this.postParams.orderBy = `${this.sort.selectedField} ${this.sort.selectedType}`;
    this.getAllPosts();
  }
}
