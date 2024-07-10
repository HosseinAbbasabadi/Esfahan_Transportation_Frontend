import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './basic-info.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoenixFrameworkModule } from '../framework-components/framework.module';
import { BasicInfoRoutingModule } from './basic-info-routing.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    ReactiveFormsModule,
    BasicInfoRoutingModule,
    PhoenixFrameworkModule,
    DataTablesModule,
    AgGridModule
  ],
  declarations: [
    BasicInfoComponent,
    VehicleTypeComponent
  ],
})
export class BasicInfoModule { }
