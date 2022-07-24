import { Component, OnInit } from '@angular/core';
import {UserRepositoryService} from "../../../services/repositories/user-repository.service";
import {userRoutes} from "../../../routes/userRoutes";
import {IUserForAuthenticationDto} from "../../../interfaces/user/userForUpdateMeDto";
import {Location} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../../services/alert.service";
import {postsRoutes} from "../../../routes/postsRoutes";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../../../services/auth/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  public userForm: FormGroup;
  selectedValue:string
  verification=[false,true]
  //#region Ctor
  constructor(private userRepo: UserRepositoryService, private location:Location, private alert:AlertService) { }
//#endregion

user:IUserForAuthenticationDto ={
    firstName:"",
    lastName:"",
    email:"",
    isTwoFactorAuthorizationEnabled:false
}
  ngOnInit(): void {
    this.getUser()
    this.createForm()
  }

  createForm (){
    this.userForm = new FormGroup({
      firstName: new FormControl(this.user.firstName, [Validators.required]),
      lastName: new FormControl(this.user.lastName, [Validators.required]),
      email: new FormControl(this.user.email, [Validators.required]),
      isTwoFactorAuthorizationEnabled: new FormControl(this.user.isTwoFactorAuthorizationEnabled, [Validators.required]),

    });
  }

  getUser(){
    this.userRepo.getUser(userRoutes.getUserInfo).subscribe(res=>{
      this.user=res;
      this.createForm()
    })
  }
  public onCancel = () => {
    this.location.back();
  }

  public updateUser = (userFormValue:any) => {

    this.user = userFormValue

    this.userRepo.update(userRoutes.userUpdateInfo,this.user).subscribe(

      {
        next: (res) => {

          this.alert.success(
            `Your have successfully updated the info.`,
            {autoClose: true,keepAfterRouteChange: true,}
          );

          this.location.back();
        },
        error: (err: HttpErrorResponse) => {
          console.log("Error: ", err)
          this.alert.error(
            `The info was not updated.`,
            {autoClose: true,keepAfterRouteChange: true,}
          );

          this.location.back()
        },
      }
    )

  }

}
