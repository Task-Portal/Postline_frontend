import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from '../../components/user/profile/profile.component';
import { LogoutComponent } from '../../components/user/logout/logout.component';
import { NavigationMenuComponent } from '../../components/user/navigation-menu/navigation-menu.component';


@NgModule({
  declarations: [
    ProfileComponent,
    LogoutComponent,
    NavigationMenuComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
