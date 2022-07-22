import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerHomeComponent } from '../../components/manager/manager-home/manager-home.component';
import { ManagerComponent } from '../../components/manager/manager/manager.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [ManagerHomeComponent, ManagerComponent],
  imports: [CommonModule, ManagerRoutingModule, SharedModule],
})
export class ManagerModule {}
