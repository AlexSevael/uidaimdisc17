import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VaveComponent } from './vave.component';
import { RequestComponent } from './request/request.component';
import { NewComponent } from './request/new/new.component';
import { ListComponent } from './request/list/list.component';
const routes: Routes = [
  { path: '', component: VaveComponent, children: [
    { path: '', redirectTo: 'request', pathMatch: 'full' },
    {path : 'request', component: RequestComponent,
    children : [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {path : 'new', component: NewComponent},
      {path : 'list', component: ListComponent},
    ]},
    
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaveRoutingModule { }
