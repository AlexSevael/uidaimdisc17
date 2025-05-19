import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginComponent } from './login/login.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component:LoginComponent }
  ];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }