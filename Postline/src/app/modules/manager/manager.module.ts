import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerHomeComponent } from '../../components/manager/manager-home/manager-home.component';
import { ManagerComponent } from '../../components/manager/manager/manager.component';
import { UserManagementComponent } from '../../components/manager/user-management/user-management.component';

@NgModule({
  declarations: [ManagerHomeComponent, ManagerComponent, UserManagementComponent],
  imports: [CommonModule, ManagerRoutingModule],
})
export class ManagerModule {}
