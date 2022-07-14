import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../../components/user/profile/profile.component';
import { AuthGuard } from '../../services/guards/auth.guard';
import {PostDetailsComponent} from "../../components/posts/post-details/post-details.component";
import {PostCreateComponent} from "../../components/posts/post-create/post-create.component";

const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: PostDetailsComponent },
  { path: 'create', component: PostCreateComponent, canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
