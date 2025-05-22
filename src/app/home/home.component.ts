import { Component, OnInit, AfterViewInit, Injectable, ChangeDetectorRef, ViewChild, Pipe, PipeTransform, } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WebserviceService } from '../services/webservice.service';
import { DatatransferService } from '../services/datatransfer.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuard } from '../services/canactivate.service';
import { CommonModule } from '@angular/common';

declare var $:any;

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,FormsModule],
    providers:[WebserviceService,DatatransferService,AuthGuard],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

    private listBUnitsapi = this.getdata.Coreappconstant + 'listBUnits';
    private getUserPrivapi = this.getdata.appconstant + 'getUserPriv';
    private getSuppPrivapi = this.getdata.appconstant + 'getSuppPriv';
    private srrGetCriticalSupplier_api = this.getdata.appconstant + 'srrGetCriticalSupplier';
    private generateIBMSTokenapi = this.getdata.Coreappconstant + 'generateIBMSToken';
    private getallRoleapi = this.getdata.appconstantpackaging + 'listRole';
    private listSupplierSOSapi = this.getdata.appconstant + 'listSupplierSOS';
    private listSOSMessageapi = this.getdata.appconstant + 'listSOSMessage';
    private addSupplierSOSapi = this.getdata.appconstant + 'addSupplierSOS';
    private updateSOStatusapi = this.getdata.appconstant + 'updateSOStatus';
    private checkVevaUsertypeAPI = this.getdata.appconstant + 'checkVevaUsertype';
    private listAPI = this.getdata.certificationCR + 'list'
    private validityDetailAPI = this.getdata.certificationCR + 'validityDetail'
    constructor(public AuthGuard: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private ref: ChangeDetectorRef) {

    }

    userbuids = []
    usertype = 0
    vendorcode:any
    ngOnInit() {
        if(localStorage.getItem("critical_supplier") == "success"){
            this.srrGetCriticalSupplier_fun()
            }
        function blink_text() {
            $('.blink').fadeOut(500);
            $('.blink').fadeIn(500);
        }
        setInterval(blink_text, 1000);
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = './assets/js/animateshake.js';
        document.body.appendChild(scriptElement);

        this.getallBUnits();
        this.userbuids = this.AuthGuard.userbuids;
        this.getAllrole()
        // this.selectbunits()
        
        if(this.AuthGuard.session().roleid != 4){
            if(localStorage.getItem("critical_supplier") == "success"){
                this.srrGetCriticalSupplier_fun()
            }
            this.sos_supplier_list();
            this.check_user_()
        }else{
            // this.listConfig()
            // if(localStorage.getItem("critical_supplier") == "success"){
            //     this.validityDetail_()
            // }
            localStorage.setItem('vevaUserType', String(0))
        }
    }
    list_data = []
    listConfig(){
        let userid = 0
        if(this.AuthGuard.session().roleid != 1){
          userid = 0
        }
        let reqdata = "supplierid=" + this.AuthGuard.session().supplierid + "&userid=" + userid + "&roleid=" + this.AuthGuard.session().roleid 
        this.makeapi.post(this.listAPI, reqdata, 'post')
        .subscribe(data=>{
          this.list_data = data
        },)
      }
      show_restric = false
      show_scroll = false
      show_popup = false
      validityDetail:any
      show_values:any = []
      validityDetail_(){
        console.log(this.show_restric)
          this.makeapi.post(this.validityDetailAPI, "supplierid=" + this.AuthGuard.session().supplierid, 'post')
          .subscribe(data=>{
            if(data.length > 0){
                let isactive = data.filter((val:any) => val.isactive == 1)
                this.show_values[0] = isactive[0]
                if(data.length > 1){
                let isactiveNo = data.filter((val:any) => val.isactive == 0)
                this.show_values[1] = isactiveNo[0]
                }
                if(isactive[0].isactive == 1){
                    if(isactive[0].type == 1){
                        this.srrGetCriticalSupplier_fun()
                        this.show_scroll = true 
                    }else if(isactive[0].type == 2){
                        this.srrGetCriticalSupplier_fun()
                    }else{
                        this.stop()
                        this.show_restric = true 
                        this.timer_fun(isactive[0].duration)
                    }
                }
            }else{
                this.srrGetCriticalSupplier_fun()
            }
          },
        Error =>{
      
        })
        }
        timer_fun(secs:any){
            this.showtime = secs
            this.remainingTime = secs
            this.start()
        }
        timer: any; // Timer variable
    remainingTime:number = 0 // Remaining time in seconds
    showtime:any
    start() {
        this.timer = setInterval(() => {
          this.remainingTime--;
          if (this.remainingTime <= -1) {
            this.srrGetCriticalSupplier_fun()
            this.stop()
          } else {
            this.showtime = this.remainingTime
          }
        }, 1000);
      }
      stop(){
        this.show_restric = false
        clearInterval(this.timer)
    }
    srr_popup(){
        // $("#srr_popup").modal("show")
    }
    srr_popup_close(){
        if(this.show_values.length > 0){
        if(this.show_values[0].isactive == 1 && this.show_values[0].type == 2){
            this.show_popup = true
            setTimeout(()=>{
                $("#show_popup_msg").modal("show")
            },100)
        }
    }
    }
    check_user_() {
        let reqdata = 'userid=' + this.AuthGuard.session().id
        this.makeapi.post(this.checkVevaUsertypeAPI, reqdata, 'post')
          .subscribe(data => {
              if(data.status == 'Success'){
                this.usertype = data.usertype
              localStorage.setItem('vevaUserType', String(data.usertype))
              }else{
                  localStorage.setItem('vevaUserType', String(0))
              }
          },
            Error => { })
      }
    srrCritical_list:any = []
    month_obj:any = []
    year:any
    show_warning = []
    srrGetCriticalSupplier_fun(){
        let supplierid
        if(this.AuthGuard.session().roleid != 4){
            supplierid = 0
        }else{
            supplierid = this.AuthGuard.session().supplierid
        }
        return this.makeapi.post(this.srrGetCriticalSupplier_api, "supplierid=" + supplierid, "post")
            .subscribe((data:any) => {
                
                this.srrCritical_list = data;
                this.show_warning = this.srrCritical_list.filter((val:any) => val.isrepeated == 1)
                if(data.length > 0){
                    let months: { [key: number]: string } = {
                        1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
                        7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec", 13: "Jan", 14: "Feb", 15: "Mar"
                      }
                    this.month_obj = months[data[0].month]
                    this.year = data[0].year
                    this.vendorcode = this.AuthGuard.session().code
                    console.log(this.vendorcode)
                    let getcode = data.filter((val:any) => val.vendorCode == this.vendorcode)
                    if(getcode.length > 0 || this.AuthGuard.session().roleid != 4){
                    $("#critical_suppliers").modal("show")
                    }else{
                        this.srr_popup_close()
                    }
                }else{
                    this.srr_popup_close()
                }
                localStorage.removeItem("critical_supplier")
            },
                Error => {
                });
    }
    years:any = []
    yr_values:any
    first_yr:any = []
    sec_yr:any = []
    monthsForChart = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    yearlyScore_(){
        this.years = Object.keys(this.srrCritical_list[0]['yearlyScore'])
        let getvalues = this.srrCritical_list[0]['yearlyScore']
        this.first_yr = []
        this.sec_yr = []
        for(let i=0; i<this.years.length; i++){
            let getMonth_values = getvalues[this.years[i]]
            for(let j=0; j<this.monthsForChart.length; j++){
                if(i == 0){
                    this.first_yr.push(getMonth_values[this.monthsForChart[j]])
                }else{
                    this.sec_yr.push(getMonth_values[this.monthsForChart[j]])
                }
            }
            
        }
        $("#yearlyScore").modal("show")
    }
    bUnits: any;
    getallBUnits() {
        let reqdata = ""
        this.makeapi.post(this.listBUnitsapi, reqdata, "post")
            .subscribe(data => {
                this.bUnits = data;
            },);
    }
    userdata: any;
    usercompds:any = [];
    usermodids:any = [];
    count = 0;

    selectbunits() {
        this.usercompds = [];
        this.usermodids = this.AuthGuard.usermodids;
        if (this.AuthGuard.userroleid == 3 || this.AuthGuard.userroleid == 4) {
            for (var j = 1; j <= 6; j++) {
                if (this.usermodids.indexOf(j) != -1) {
                    $("#outermodule" + j).removeClass("cursornotallowed");
                    $("#innermodule" + j).removeClass("disabled")
                }
                else {
                    $("#outermodule" + j).addClass("cursornotallowed");
                    $("#innermodule" + j).addClass("disabled")
                }
            }
        }

        else if (this.AuthGuard.userroleid == 1) {
            // var addmodid = JSON.parse(localStorage.getItem("disc-portal-session"))
            // addmodid["modids"] = this.usermodids;
            // localStorage.setItem("disc-portal-session", JSON.stringify(addmodid));
        }

    }

    navigate(type:any) {
        console.log(this.AuthGuard.session().roleid);
        console.log(type);
        
        if (this.AuthGuard.session().roleid == 4) {
            if (type == 'process' || type == 'performance' || type == 'quality' || type == 'project' || type == 'kys' || type == 'vave') {
                this.router.navigateByUrl("dashboard/" + type)
            }
        }
        else if (this.AuthGuard.session().roleid == 3) {
            if (type == 'people' || type == 'process' || type == 'performance' || type == 'quality' || type == 'project' || type == 'kys' || type == 'vave') {
                this.router.navigateByUrl("dashboard/" + type)
            }
        }
        else {
            this.router.navigateByUrl("dashboard/" + type)
        }
    }

    genIBMSToken() {
        // if (this.AuthGuard.userroleid != 4) {
            var reqdata = {"userid" : this.AuthGuard.session().id, "roleid" : this.AuthGuard.session().roleid}
            this.makeapi.postjson(this.generateIBMSTokenapi, reqdata, "postjson")
                .subscribe(data => {
                    if ((data.status).toLowerCase() == 'success') {

                        this.AuthGuard.deliverytoken = data.field;
                        localStorage.removeItem('disc-portal-session');
                        localStorage.removeItem('Daim-packagingSession');
                        this.deleteCookie('packcookies');
                        this.deleteCookie('cookies');
                        window.location.href = "https://ibms.bharatbenz.com/ibmslogin?tokenkey=" + data.field
                    }
                    else {
                        localStorage.removeItem('disc-portal-session');
                        localStorage.removeItem('Daim-packagingSession');
                        this.deleteCookie('packcookies');
                        this.deleteCookie('cookies');
                    }
                },
                    Error => {
                    });
        // }
    }
    deleteCookie(cname:any) {
        var d = new Date();
        d.setTime(d.getTime() - (1000 * 60 * 60 * 24));
        var expires = "expires=" + d.toUTCString();
        window.document.cookie = cname + "=" + "; " + expires;
    }
    ngAfterViewInit() {
        this.usercompds = [];
        this.usermodids = this.AuthGuard.usermodids;

        if (this.AuthGuard.userroleid == 3 || this.AuthGuard.userroleid == 4) {
            for (var j = 1; j <= 6; j++) {
                if (this.usermodids.indexOf(j) != -1) {
                    $("#outermodule" + j).removeClass("cursornotallowed");
                    $("#innermodule" + j).removeClass("disabled")
                }
                else {
                    $("#outermodule" + j).addClass("cursornotallowed");
                    $("#innermodule" + j).addClass("disabled")
                }
            }
        }

        else if (this.AuthGuard.userroleid == 1) {
            // var addmodid = JSON.parse(localStorage.getItem("disc-portal-session"))
            // addmodid["modids"] = this.usermodids;
            // localStorage.setItem("disc-portal-session", JSON.stringify(addmodid));
        }

    }
    allroles:any
    roleidvalue:any
    roleid:any
    getAllrole() {
        let reqdata = ""
        return this.makeapi.post(this.getallRoleapi, reqdata, "post")
            .subscribe(data => {
                this.allroles = data;
                this.roleid = data.roleid
            });
    }
    private getPPInfoapi = this.getdata.Coreappconstant + 'getPPInfo/';
    Roledatas: any
    gotoPackaging() {
        var url;
        if (this.AuthGuard.session().roleid == 4) {
            url = this.getPPInfoapi + this.AuthGuard.session().id + '/1'
        }
        else {
            url = this.getPPInfoapi + this.AuthGuard.session().id + '/0'
        }
        this.makeapi.get(url, "", "getnoload")
            .subscribe(data => {
                this.Roledatas = data
                console.log(data)
                var str = data.status;
                var status = str.toLowerCase();
                if (status == 'success') {


                    // Encode the String
                    var stringdata = JSON.stringify(data)
                    // var encodeddata = btoa(stringdata);
                    localStorage.setItem("Daim-packagingSession", (stringdata));

                }
                this.redirecttopageRole()
            },
                Error => {
                });
    }
    redirecttopageRole() {
        var getval:any = localStorage.getItem("disc_packaging_flag")
        var flag = parseInt(getval);
        if (this.Roledatas.roleid == 6) {
            
            if(flag == 1){
                this.router.navigateByUrl("/dashboard/quality/packaging/signoffreport")
                
            }else{
                this.router.navigateByUrl("/dashboard/quality/pdp")
                
            }
        }
        else if (this.Roledatas.roleid == 1) {
            
            if(flag == 1){
                this.router.navigateByUrl("/dashboard/quality/packaging/mhe-approval")
                
            }else{
                this.router.navigateByUrl("/dashboard/quality/pdp")
                
            }
        }
        else if (this.Roledatas.roleid == 2) {
            
            if(flag == 1){
                this.router.navigateByUrl("/dashboard/quality/packaging/sm-approval")
                
            }else{
                this.router.navigateByUrl("/dashboard/quality/pdp")
                
            }
        }
        else if (this.Roledatas.roleid == 3) {
           
            if(flag == 1){
                this.router.navigateByUrl("/dashboard/quality/packaging/ipl-approval")
                
            }else{
                this.router.navigateByUrl("/dashboard/quality/pdp")
                
            }
        }

        else if (this.Roledatas.roleid == 0) {
           
            if(flag == 1){
                this.router.navigateByUrl("/dashboard/quality/packaging/signoffsheet")
                
            }else{
                this.router.navigateByUrl("/dashboard/quality/pdp")
                
            }
        }
        else if (this.Roledatas.roleid == 100 || this.Roledatas.roleid == 99 || this.Roledatas.roleid == 98) {
            
            if(flag == 1){
                this.router.navigateByUrl("/dashboard/quality/packaging/packdashboard")
                
            }else{
                this.router.navigateByUrl("/dashboard/quality/pdp")
                
            }
        }
        else {
            // this.router.navigateByUrl("/dashboard/quality/packaging/rolelist")
            this.router.navigateByUrl("/dashboard/quality/pdp")
            if(flag == 1){
                this.router.navigateByUrl("/dashboard/quality/packaging/rolelist")
                
            }else{
                this.router.navigateByUrl("/dashboard/quality/pdp")
                
            }
        }
        
    }
    
    // emergency msg
   
    show_msg:any = []
    show_vendors_list:any = []
    eme_msg:any
    vendor_list:any
    ope_eme_modal(){
        if(this.AuthGuard.session().roleid == 4){
            this.sos_msg_list(this.AuthGuard.session().supplierid,this.AuthGuard.session().roleid)
        }
        $("#input_msg").val(" ")
        this.vendor_list = true
        $("#emer_msg").modal("show")
        if(this.AuthGuard.session().roleid != 4){
            this.eme_msg = "Vendor List"
        }else{
            this.eme_msg = "Add Message"
        }
    }
    view_msg(supplierid:any,roleid:any){
        this.vendor_list = false
        this.sos_msg_list(supplierid, roleid)
    }
    back(){
        this.vendor_list = true
        this.eme_msg = "Vendor List"
        this.sos_supplier_list()
    }
    close(){
        if(this.AuthGuard.session().roleid == 4){
            this.send_msg()
        }else{
            this.sos_supplier_list()
        }
        $("#emer_msg").modal("hide")
    }
    send_msg(){
        $(".over_all").removeClass("bottom_scroll")
        setTimeout(() => {
            $(".over_all").addClass("bottom_scroll")
        }, 1);
}
new_sos_msg = []
sos_supplier_list(){
    $(".over_all").removeClass("bottom_scroll")
    return this.makeapi.post(this.listSupplierSOSapi, "", "post")
    .subscribe(data => {
        for(let i=0; i<data.length; i++){
            let getdate = data[i].createddate.split(" ")
            data[i].date = getdate[0]
            data[i].time = getdate[1]
        }
        this.show_vendors_list = data
        this.new_sos_msg = this.show_vendors_list.filter((val:any)=> val.unreadCount != 0)
    },);
}
sos_msg_list(supplierid:any, roleid:any){
    return this.makeapi.post(this.listSOSMessageapi, "supplierid="+supplierid + "&roleid="+roleid, "post")
    .subscribe((data:any) => {
        for(let i=0; i<data.length; i++){
            let getdate = data[i].createddate.split(" ")
            data[i].date = getdate[0]
            data[i].time = getdate[1]
        }
        this.show_msg = data
        if(this.AuthGuard.session().roleid == 4){
            this.show_msg.reverse();
        }
    },
        Error => {
            
        });
}
    add_sos_msg(){
        if($("#text_msg_box").val().length == 0){
            
        }else{
        let reqdata = {"supplierid":this.AuthGuard.session().supplierid,"suppuserid":this.AuthGuard.session().id,"createddate":"",
        "message":$("#text_msg_box").val(),"status":0}
         this.makeapi.postjson(this.addSupplierSOSapi, reqdata, "postjson")
        .subscribe(data => {
            $("#text_msg_box").val("")
            this.sos_msg_list(this.AuthGuard.session().supplierid,this.AuthGuard.session().roleid)
            this.send_msg()
        },
        Error =>{

        });
    }
    }
    delete_status(set_data:any){
        return this.makeapi.post(this.updateSOStatusapi, "id="+set_data.id+"&userid="+this.AuthGuard.session().id, "post")
        .subscribe(data => {
            this.sos_msg_list(set_data.supplierid,this.AuthGuard.session().roleid)
        },);
    }
    process_(){
        this.router.navigateByUrl("/dashboard/process")
    }
}