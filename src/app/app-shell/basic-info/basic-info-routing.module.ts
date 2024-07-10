import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { BasicInfoComponent } from './basic-info.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';

const routes: Routes = [
  {
    path: '',
    component: BasicInfoComponent,
    children: [
      { path: 'vehicle-type', component: VehicleTypeComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicInfoRoutingModule { }
