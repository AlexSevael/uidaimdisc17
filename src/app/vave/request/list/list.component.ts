import { Component, OnInit, OnDestroy, Injectable, ChangeDetectorRef, ViewChild, } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router, ActivatedRoute } from '@angular/router';
import { WebserviceService } from '../../../services/webservice.service';
import { DatatransferService } from '../../../services/datatransfer.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthGuard } from '../../../services/canactivate.service';

declare var $:any

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  dropdownSettings:any = {}
  private lsitAPI = this.getdata.appconstantVAVE + 'list'
  private getPaginationCountAPI = this.getdata.appconstantVAVE + 'getPaginationCount'
  private getFilterColumnsAPI = this.getdata.appconstantVAVE + 'getFilterColumns'
  private getCountAPI = this.getdata.appconstantVAVE + 'getCount'
  private validBulkFileAPI = this.getdata.appconstantVAVE + 'validBulkFile'
  private uploadBulkFileAPI = this.getdata.appconstantVAVE + 'uploadBulkFile'
  private downloadExcelDumpAPI = this.getdata.appconstantVAVE + 'downloadExcelDump'
  constructor(private fb: FormBuilder, public AuthGuard: AuthGuard, private route: ActivatedRoute, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService,
    public getdata: DatatransferService) {
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        value: 'value',
        selectAllText: 'Select All',
        unSelectAllText: 'DeSelect All',
        itemsShowLimit: 0,
        allowSearchFilter: true
      };
  }

  supplierid = 0
  userid = 0
  roleid = 0
  ngOnInit() {
    let usertype = localStorage.getItem('vevaUserType')
    let tab_type = Number(localStorage.getItem('vave_tabs'))
    this.usertype = Number(usertype)
    if(this.AuthGuard.session().roleid == 1 || this.AuthGuard.session().vevaAdmin == 1){
      this.userid = 0
     }else{
       this.userid = this.AuthGuard.session().id
     }
    if(this.AuthGuard.session().roleid == 4 || this.AuthGuard.session().roleid == 1 || this.AuthGuard.session().vevaAdmin == 1) {
      this.supplierid = this.AuthGuard.session().supplierid
    } else {
      this.supplierid = 0
    }
    setTimeout(()=>{
      $("#tab"+tab_type).prop('checked', true)
    },100)
    this.tabs_(tab_type,1)
  }
  tabs_(type,call_type){
    localStorage.setItem('vave_tabs',type)
    if(call_type == 1){
      this.currentPage = Number(localStorage.getItem('vave_currentPage'))
    }else{
      localStorage.setItem('vave_currentPage','1')
      this.currentPage = 1
    }
    this._formID_ = []
    this._vendorCode_ = []
    this._Status_ = []
    this.Form_ID_val = []
    this.VendorCode__val = []
    this.status__val = []
    this.send_Filter_val = []
    this.tab_type = type
    this.search_val = ''
    $("#search").val('')
    this.vave_list_()
    this.fileter()
  }
  search_val = ''
  search(value){
    this.search_val = value
    this.vave_list_()
  }
  vave_list_data = []
  usertype = 0
  tab_type = 0
  vave_list_() {
    let reqdata = {
      "userid": this.userid,
      "supplierid": this.supplierid,
      "searchstr": this.search_val,
      "pagination": this.currentPage,
      "roleid": this.AuthGuard.session().roleid,
      "filterList": this.send_Filter_val,
      "statusflag": this.tab_type,
      "usertype" : this.usertype
    }
    this.makeapi.method(this.lsitAPI, reqdata, 'postjson')
      .subscribe(data => {
         this.vave_list_data = data
         this.getCount()
      },
        Error => { })
  }
  currstatus_list = []
  FormID_list = []
  vendorCode_list = []
  fileter() {
    let reqdata = {
      "userid": this.userid,
      "supplierid": this.supplierid,
      "roleid": this.AuthGuard.session().roleid,
      "statusflag": this.tab_type,
      "usertype" : this.usertype,
    }
    this.makeapi.method(this.getFilterColumnsAPI, reqdata, 'postjson')
      .subscribe(data => {
         this.FormID_list = data['a.vevaformid']
         this.vendorCode_list = data['a.supplierid']
         this.currstatus_list = data['a.currstatus']
      },
        Error => { })
  }
   // pagination
   currentPage = 1
   paginatePartList(page) {
     if (page == 'prev' && this.currentPage > 1) {
       if (page == 'prev') {
         // this.loading = true;
       }
       else {
         // this.loading = false;
       }
       this.currentPage = this.currentPage - 1
     }
     else {
       if (page == 'next') {
         // this.loading = true;
       }
       else {
         // this.loading = false;
       }
       this.currentPage = this.currentPage + 1
     }
     if(this.send_Filter_val.length == 0){
      localStorage.setItem('vave_currentPage',String(this.currentPage))
    }
     this.vave_list_()
   }
   searchPage() {
     // this.loading = true;
     var inputPageValue = parseInt($("#currentPageInput").val())
     if (this.totalPages < inputPageValue || inputPageValue <= 0) {
       alert("Enter valid page number!");
       $("#currentPageInput").val(this.currentPage)
     }
     else {
       this.currentPage = inputPageValue;
       if(this.send_Filter_val.length == 0){
        localStorage.setItem('vave_currentPage',String(this.currentPage))
      }
       this.vave_list_()
 
     }
   }
  totalPartCount = 0
page_count = 0
totalPages = 10
paginationcount_fun(){
  let reqdata = {
    "userid": this.userid,
    "supplierid": this.supplierid,
    "searchstr": this.search_val,
    "roleid": this.AuthGuard.session().roleid,
    "filterList": this.send_Filter_val,
    "statusflag": this.tab_type,
    "usertype" : this.usertype
  }
  return this.makeapi.method(this.getPaginationCountAPI, reqdata, "postjson")
    .subscribe(data => {
      this.page_count = data.pageCount
      this.totalPages = Math.ceil(data.pageCount / 10);
    },
      Error => {
      });
}
get_count = 0
getCount(){
  let reqdata = {
    "userid": this.userid,
    "supplierid": this.supplierid,
    "roleid": this.AuthGuard.session().roleid,
    "statusflag": this.tab_type,
    "filterList": this.send_Filter_val,
    "pagination": this.currentPage,
    "searchstr":this.search_val,
    "usertype" : this.usertype
  }
  return this.makeapi.method(this.getCountAPI, reqdata, "postjson")
    .subscribe(data => {
       this.get_count = data
       this.paginationcount_fun()
    },
      Error => {
      });
}
  pass_data(_id){
    localStorage.setItem('vave_currentPage',String(this.currentPage))
    localStorage.setItem('vave_tabs',String(this.tab_type))
    this.router.navigate(['dashboard/vave/request/new'],{queryParams : {id:_id}});
  }
  check_status(status){
    let colors
    if(this.AuthGuard.session().roleid == 4){
   if(status == -1 || status == -101){
      colors = 'red'
    }else if(status == 5){
      colors = 'green'
    }else{
      colors = 'yellow'
    }
  }else{
    if(status < 0){
      colors = 'red'
    }else{
      if(status == 5){
        colors = 'green'
      }else{
        colors = 'yellow'
      }
    }
  }
    return colors
  }
  open_upload(){
    this.upload_attach.nativeElement.value = "";
    this.upload_filename = ""
   $("#show_upload_file").modal("show")
  }
  clear(){
    this.upload_attach.nativeElement.value = "";
    this.upload_filename = ""
    $("#show_upload_file").modal("hide")
  }
  @ViewChild('upload_attach') upload_attach: any;
  upload_filename = ''
  send_upload_file: File
  choose_file(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.upload_filename = file.name;
      this.send_upload_file = file
    }
  }
  file_validation(){
    if(this.upload_filename == ''){
      this.getdata.showNotification('bottom', 'right', 'Please choose the file', "danger");
    }else{
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.upload_filename);
    finalformdata.append("file", this.send_upload_file);
    this.makeapi.method(this.validBulkFileAPI, finalformdata, 'file')
      .subscribe(data => {
        if(data.status == 'Success'){
          this.file_upload()
      }else{
        this.getdata.showNotification('bottom', 'right', data.filed, "success");
      }
      })
  }
}
  file_upload(){
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.upload_filename);
    finalformdata.append("file", this.send_upload_file);
    finalformdata.append("supplierid", String(this.AuthGuard.session().supplierid));
    finalformdata.append("requesterid", String(this.AuthGuard.session().id));
    this.makeapi.method(this.uploadBulkFileAPI, finalformdata, 'file')
      .subscribe(data => {
        if(data.status == 'success'){
         this.clear()
          this.vave_list_()
          this.getdata.showNotification('bottom', 'right', "Bulk Upload Completed", "success");
      }
      })
  }

  _formID_ = []
  _vendorCode_ = []
  _Status_ = []
// vendor code 
Form_ID_val = []
send_Filter_val = []
FormID_onItemSelect_list(val){
  this.Form_ID_val = this.Form_ID_val.filter(data => data != val)
  this.Form_ID_val.push(val)

  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.vevaformid')
  this.send_Filter_val.push({'filtertype' : 'a.vevaformid','values' : this.Form_ID_val})
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
FormID_onSelectAll_list(val){
  this.Form_ID_val = []
  this.Form_ID_val = val
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.vevaformid')
  this.send_Filter_val.push({'filtertype' : 'a.vevaformid','values' : val})
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
FormID_onDeSelectAll_list(val){
  this.Form_ID_val = []
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.vevaformid')
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
FormID_onItemDeSelect_list(val){
  this.Form_ID_val = this.Form_ID_val.filter(data => data != val)
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.vevaformid')
  if(this.Form_ID_val.length > 0){
    this.send_Filter_val.push({'filtertype' : 'a.vevaformid','values' : this.Form_ID_val})
  }
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}

  // vendor code 
VendorCode__val = []
Vendor_onItemSelect_list(val){
  this.VendorCode__val = this.VendorCode__val.filter(data => data != val.id)
  this.VendorCode__val.push(val.id)

  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.supplierid')
  this.send_Filter_val.push({'filtertype' : 'a.supplierid','values' : this.VendorCode__val})

  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
Vendor_onSelectAll_list(val){
  this.VendorCode__val = []
  for(let i=0; i<val.length; i++){
    this.VendorCode__val.push(val[i].id)
  }
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.supplierid')
  this.send_Filter_val.push({'filtertype' : 'a.supplierid','values' : this.VendorCode__val})
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
Vendor_onDeSelectAll_list(val){
  this.VendorCode__val = []
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.supplierid')
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
Vendor_onItemDeSelect_list(val){
  this.VendorCode__val = this.VendorCode__val.filter(data => data != val.id)
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.supplierid')
  if(this.VendorCode__val.length > 0){
     this.send_Filter_val.push({'filtertype' : 'a.supplierid','values' : this.VendorCode__val})
  }
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}

// status 
status__val = []
Status_onItemSelect_list(val){
  this.status__val = this.status__val.filter(data => data != val.id)
  this.status__val.push(val.id)

  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.currstatus')
  this.send_Filter_val.push({'filtertype' : 'a.currstatus','values' : this.status__val})

  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
Status_onSelectAll_list(val){
  this.status__val = []
  for(let i=0; i<val.length; i++){
    this.status__val.push(val[i].id)
  }
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.currstatus')
  this.send_Filter_val.push({'filtertype' : 'a.currstatus','values' : this.status__val})
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
Status_onDeSelectAll_list(val){
  this.status__val = []
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.currstatus')
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
Status_onItemDeSelect_list(val){
  this.status__val = this.status__val.filter(data => data != val.id)
  this.send_Filter_val = this.send_Filter_val.filter(data => data.filtertype != 'a.currstatus')
  if(this.status__val.length > 0){
     this.send_Filter_val.push({'filtertype' : 'a.currstatus','values' : this.status__val})
  }
  if(this.send_Filter_val.length > 0){
    this.currentPage = 1
  }else{
    this.currentPage = Number(localStorage.getItem('vave_currentPage'))
  }
  this.vave_list_()
}
dump_download(){
  let reqdata = {"userid": 0, "supplierid": this.AuthGuard.session().supplierid,"roleid": this.AuthGuard.session().roleid, "usertype": this.usertype 
  }
  return this.makeapi.dowcument_method(this.downloadExcelDumpAPI, reqdata, 'xlsx')
  .subscribe(res => {
    var url = window.URL.createObjectURL(res.data);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = 'Vave_Dump_Download';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
  })
}
}