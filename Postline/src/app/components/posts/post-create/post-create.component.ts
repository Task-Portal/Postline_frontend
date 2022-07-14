import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsRepositoryService} from "../../../services/repositories/posts-repository.service";
import {Location} from '@angular/common';
import {PostForCreationDto} from "../../../interfaces/post/postForCreationDto";
import {CategoryRepositoryService} from "../../../services/repositories/category-repository.service";
import {ICategory} from "../../../interfaces/icategory";
import {categoryRoutes} from "../../../routes/categoryRoutes";
import {postsRoutes} from "../../../routes/postsRoutes";
import {IPost} from "../../../interfaces/post/ipost";
import {HttpErrorResponse} from "@angular/common/http";
import {AlertService} from "../../../services/alert.service";



@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  public postForm: FormGroup;
  public categories:ICategory[]
  selectedValue:string
  constructor(private location: Location, private postRepo: PostsRepositoryService,
              private categoryRepo:CategoryRepositoryService,
              private alert:AlertService) { }
  ngOnInit() {
    this.getCategories()
   this.createForm();
  }



  createForm (){
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
       body: new FormControl('', [Validators.required]),
       category: new FormControl("",[Validators.required])
    });
  }

  getCategories(){
    this.categoryRepo.getCategories(categoryRoutes.getAllCategories).subscribe(res=>{
      this.categories=res;
    })
  }


  // public hasError = (controlName: string, errorName: string) =>{
  //   return this.postForm.controls[controlName].hasError(errorName);
  // }
  public onCancel = () => {
    this.location.back();
  }
  public createPost = (postFormValue:any) => {
    if (this.postForm.valid) {
      this.executePostCreation(postFormValue);
    }
  }

  private executePostCreation = (postFormValue:any) => {

    let postForCreationDto: PostForCreationDto = {
      categoryId:this.selectedValue,
      title: postFormValue.title,
      body: postFormValue.body

    }
    console.log("Post: ", postForCreationDto)

    this.postRepo.create(postsRoutes.createPost,postForCreationDto).subscribe(

      {
         next: (post) => {

           this.alert.success(
             `Your have successfully added a new post`,
             {autoClose: true,keepAfterRouteChange: true,}
           );
           this.location.back();
         },
        error: (err: HttpErrorResponse) => {
          this.alert.error(
            `The post was not added.`,
            {autoClose: true,keepAfterRouteChange: true,}
          );

          this.location.back()
        },
      }
   )
  }

}
