import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { FinanceComponent } from './finance.component';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: [
      { path: 'invoice', component: InvoiceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule { }
