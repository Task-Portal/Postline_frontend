import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {categoryRoutes} from "../../../routes/categoryRoutes";
import {CategoryRepositoryService} from "../../../services/repositories/category-repository.service";
import {ICategory} from "../../../interfaces/icategory";
import {HttpErrorResponse} from "@angular/common/http";
import {AlertService} from "../../../services/alert.service";
import {ICategoryForUpdateDto} from "../../../interfaces/Category/CategoryForUpdateDto";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit, AfterViewInit {
  public displayedColumns = ['categoryName', 'update', 'delete'];
  newCategoryName = ""
  categoryForUpdateDto: ICategoryForUpdateDto = {
    id: '',
    categoryName: '',
  }
  public dataSource = new MatTableDataSource<ICategory>();

  constructor(private router: Router, private categoryRepo: CategoryRepositoryService,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.getCategories();
  }

  //#region Sorting,, Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  //#endregion


  //#region Get Categories
  getCategories() {
    this.categoryRepo
      .getCategories(categoryRoutes.getAllCategories)
      .subscribe((res) => {
        this.dataSource.data = res as ICategory[];
      });
  }
  //#endregion


  public redirectToUpdate = (elem: any) => {
    this.categoryForUpdateDto = elem

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

  //#region Crud Category
  private deletePost(id: string) {
    console.log("Id: ", id)
    this.categoryRepo.delete(categoryRoutes.deleteCategory(id)).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.filter(s => s.id != id)
        Swal.fire({
          title: 'Hurray!!',
          text: "Category has been deleted successfully",
          icon: 'success'
        });

      },
      error: (res) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    })
  }

  createCategory() {
    if (this.newCategoryName) {
      let category = {categoryName: this.newCategoryName}
      this.categoryRepo.create(categoryRoutes.createCategory, category)
        .subscribe(
          {
            next: (category) => {
              const data = this.dataSource.data
              console.log("category: ", category)
              data.push(category as ICategory)
              this.dataSource.data = data
              this.alert.success(
                `Your have successfully added a new category`,
                {autoClose: true, keepAfterRouteChange: true,}
              );

            },
            error: (err: HttpErrorResponse) => {
              this.alert.error(
                `The category was not added.`,
                {autoClose: true, keepAfterRouteChange: true,}
              );


            },
          }
        )
      console.log(this.newCategoryName)
    }
  }

  updateCategory() {

    if (this.categoryForUpdateDto.categoryName != "") {
      this.categoryRepo.update(categoryRoutes.updatePost, this.categoryForUpdateDto).subscribe(
        {
          next: (category) => {
            const data = this.dataSource.data.filter(c => c.id != this.categoryForUpdateDto.id)
            data.push(this.categoryForUpdateDto)
            this.categoryForUpdateDto = {id: "", categoryName: ''}
            this.alert.success(
              `Your have successfully updated the category`,
              {autoClose: true, keepAfterRouteChange: true,}
            );

          },
          error: (err: HttpErrorResponse) => {
            this.alert.error(
              `The category was not updated.`,
              {autoClose: true, keepAfterRouteChange: true,}
            );

          },
        }
      )
    }

  }
  //#endregion
}
