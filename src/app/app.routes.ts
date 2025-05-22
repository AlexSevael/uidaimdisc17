import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/canactivate.service';
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component:LoginComponent },
    {
      path: 'dashboard', component: DashboardComponent,
      children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component:HomeComponent, canActivate: [AuthGuard] },
      ]}
  ];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }