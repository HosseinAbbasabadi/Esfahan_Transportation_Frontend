import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../authentication/login/login.component';
import { LogoutComponent } from '../authentication/logout/logout.component';
import { AppShellComponent } from './app-shell.component';
import { authGuard } from './framework-services/auth.guard.service';
import { sessionGuard } from './framework-services/session.guard.service';
import { ImportExcelComponent } from './framework-components/import-excel/import-excel.component';
import { ChallangeComponent } from '../authentication/challange/challange.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard, sessionGuard],
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'import-excel', component: ImportExcelComponent },
      { path: 'import-excel/:guid', component: ImportExcelComponent },
      { path: 'dashboard/:showSessions', component: DashboardComponent },
      {
        path: 'basic-info',
        loadChildren: () =>
          import('./basic-info/basic-info.module')
            .then(x => x.BasicInfoModule)
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module')
            .then(x => x.FinanceModule)
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'challange',
    component: ChallangeComponent
  },
  {
    path: '',
    redirectTo: 'error/404',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'error/404',
    pathMatch: 'full'
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppShellRoutingModule { }
