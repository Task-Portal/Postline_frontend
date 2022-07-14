import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from '../../components/user/profile/profile.component';

import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule,ReactiveFormsModule],
})
export class UserModule {}
