import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from '../../components/user/profile/profile.component';

import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {PostCreateComponent} from "../../components/posts/post-create/post-create.component";
import {PostUpdateComponent} from "../../components/posts/post-update/post-update.component";
import { UserSettingsComponent } from '../../components/user/user-settings/user-settings.component';

@NgModule({
  declarations: [ProfileComponent, PostCreateComponent,
    PostUpdateComponent,
    UserSettingsComponent,],
  imports: [CommonModule, UserRoutingModule, SharedModule, ReactiveFormsModule],
})
export class UserModule {
}
