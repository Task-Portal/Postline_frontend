import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ICategory} from "../../../interfaces/icategory";
import {Location} from "@angular/common";
import {PostsRepositoryService} from "../../../services/repositories/posts-repository.service";
import {CategoryRepositoryService} from "../../../services/repositories/category-repository.service";
import {AlertService} from "../../../services/alert.service";
import {categoryRoutes} from "../../../routes/categoryRoutes";
import {IPostForUpdateDto} from "../../../interfaces/post/postForUpdateDto";
import {ActivatedRoute} from "@angular/router";
import {IPost} from "../../../interfaces/post/ipost";
import {postsRoutes} from "../../../routes/postsRoutes";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-post-update',
  templateUrl: './post-update.component.html',
  styleUrls: ['./post-update.component.css']
})
export class PostUpdateComponent implements OnInit {

  public postForm: FormGroup;
  public categories:ICategory[]
  private post:IPostForUpdateDto ={
    postId:"",
    title:"",
    body:"",
    categoryId:""
  }
  selectedValue:string
  private postId:string
  constructor(private location: Location, private postRepo: PostsRepositoryService,
              private categoryRepo:CategoryRepositoryService,
              private alert:AlertService,
              private activeRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.postId = this.activeRoute.snapshot.params['id']
    this.getCategories()
    this.getPostDetails()
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
  public onCancel = () => {
    this.location.back();
  }

  public updatePost = (postFormValue:any) => {
    if (this.postForm.valid) {
      this.executePostUpdate(postFormValue);
    }
  }

  private executePostUpdate = (postFormValue:any) => {


    let postForUpdateDto: IPostForUpdateDto = {
      postId:this.postId,
      categoryId:this.selectedValue,
      title: postFormValue.title,
      body: postFormValue.body
    }


    this.postRepo.update(postsRoutes.updatePost,postForUpdateDto).subscribe(

      {
        next: (post) => {

          this.alert.success(
            `Your have successfully updated the post`,
            {autoClose: true,keepAfterRouteChange: true,}
          );
          this.location.back();
        },
        error: (err: HttpErrorResponse) => {
          console.log("Error: ", err)
          this.alert.error(
            `The post was not updated.`,
            {autoClose: true,keepAfterRouteChange: true,}
          );

          this.location.back()
        },
      }
    )
  }


    getPostDetails = () => {
      this.postRepo.getPost(postsRoutes.getOnePost(this.postId)).subscribe({
        next: (post: IPost) => {

          console.log("Post: ", post)

          this.post.body = post.body
          this.post.title = post.title
          let  categoryId = this.categories.filter(s=>s.categoryName==post.categoryName).map(b=>b.id)
          this.post.categoryId =  categoryId[0];

          this.selectedValue = categoryId[0]
          this.postForm.patchValue(this.post)
          console.log("getPostDetails: post: ", this.post)
        },
        error: (err: HttpErrorResponse) => {
          this.alert.error(`We couldn't get your post for update from Db.`, {
            autoClose: true,
            keepAfterRouteChange: true,
          });
        },
      });
    };


}
