import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoenixFrameworkModule } from '../framework-components/framework.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { AgGridModule } from 'ag-grid-angular';
import { FinanceComponent } from './finance.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    ReactiveFormsModule,
    FinanceRoutingModule,
    PhoenixFrameworkModule,
    DataTablesModule,
    AgGridModule
  ],
  declarations: [
    FinanceComponent,
    InvoiceComponent
  ],
})
export class FinanceModule { }
