import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaveRoutingModule } from './vave-routing.module';
import { VaveComponent } from './vave.component';
import { RequestComponent } from './request/request.component';
import { NewComponent } from './request/new/new.component';
import { ListComponent } from './request/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  imports: [
    CommonModule,
    VaveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    TooltipModule.forRoot(),
    NgMultiSelectDropDownModule,
  ],
  declarations: [
    VaveComponent,
    RequestComponent,
    NewComponent,
    ListComponent
  ]
})
export class VaveModule { }
