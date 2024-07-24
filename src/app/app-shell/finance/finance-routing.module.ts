import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { FinanceComponent } from './finance.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceOpsComponent } from './invoice/invoice-ops/invoice-ops.component';

const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: [
      { path: 'invoice', component: InvoiceComponent },
      { path: 'invoice-ops', component: InvoiceOpsComponent },
      { path: 'invoice-ops/:guid', component: InvoiceOpsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule { }
