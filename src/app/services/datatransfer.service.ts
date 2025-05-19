import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
declare var $: any;

@Injectable()
export class DatatransferService {
  appcode: any;
  userid: any;
  logintype: any;
  user_email: any;

  // Old-QA-Server
  // http://13.127.191.27:8080/DaimPMP/pmp/;

//QA Azure server 
// Coreappconstant = 'http://192.168.1.38:8080/DICVDISC/core/';
// appconstantpdp = 'http://192.168.1.38:8080/DaimPDP/pdp/';
// appconstant = 'http://192.168.1.38:8080/DICVDISC/disc/';
// appconstantpmp = "http://192.168.1.38:8080/DaimPMP/pmp/";
// appconstantispr = "http://192.168.1.38:8080/DaimISPR/ispr/";
// appconstantpackaging= 'http://192.168.1.38:8080/DaimPackaging/pack/';
// appconstantgp = 'http://192.168.1.38:8080/DaimGatepass/gp/';
// appconstantrakto = 'http://192.168.1.38:8080/DaimRAKTO/';
// appconstantkys = 'http://192.168.1.38:8080/DaimKYS/';
// appconstantkem = 'http://192.168.1.38:8080/DaimKEM/';
// appconstantIA = 'http://192.168.1.38:8080/DaimIA/ia/';
// appconstantVAVE = 'http://192.168.1.38:8080/DaimVeva/veva/';
// appconstantNPP = 'http://192.168.1.38:8080/DaimNPP/npp/';
// DaimQm = 'http://192.168.1.38:8080/DaimQm/qm/';
// DaimSuppDirectory = 'http://98.70.12.80:8080/DaimSuppDirectory/';
// certificationCR = 'http://98.70.12.80:8080/DICVDISC/certifi-status/';
// globalurl = "http://dicv-discportal.s3-website.ap-south-1.amazonaws.com/packaging"

  // // QA-Server aws-server
  // Coreappconstant = 'http://13.234.64.82:8080/DICVDISC/core/';
  // appconstantpdp = 'http://13.234.64.82:8080/DaimPDP/pdp/';
  // appconstant = 'http://13.234.64.82:8080/DICVDISC/disc/';
  // appconstantpmp = "http://13.234.64.82:8080/DaimPMP/pmp/";
  // appconstantispr = "http://13.234.64.82:8080/DaimISPR/ispr/";
  // appconstantpackaging= 'http://13.234.64.82:8080/DaimPackaging/pack/';
  // appconstantgp = 'http://13.234.64.82:8080/DaimGatepass/gp/';
  // appconstantrakto = 'http://13.234.64.82:8080/DaimRAKTO/';
  // appconstantkys = 'http://13.234.64.82:8080/DaimKYS/';
  // appconstantkem = 'http://13.234.64.82:8080/DaimKEM/';
  // globalurl = "http://dicv-discportal.s3-website.ap-south-1.amazonaws.com/packaging"


  // Coreappconstant = 'http://13.234.64.82:8080/DICVDISC_JWT/core/';
  // appconstantpdp = 'http://13.234.64.82:8080/DaimPDP/pdp/';
  // appconstant = 'http://13.234.64.82:8080/DICVDISC_JWT/disc/';
  // appconstantpmp = "http://13.234.64.82:8080/DaimPMP/pmp/";
  // appconstantispr = "http://13.234.64.82:8080/DaimISPR/ispr/";
  // appconstantpackaging= 'http://13.234.64.82:8080/DaimPackaging/pack/';
  // globalurl = "http://dicv-discportal.s3-website.ap-south-1.amazonaws.com/packaging"

  //local-serve-dev
  // Coreappconstant = 'http://13.234.64.82:8080/DICVDISC/core/';
  // appconstantpdp = 'http://13.234.64.82:8080/DaimPDP/pdp/';
  // appconstant = 'http://13.234.64.82:8080/DICVDISC/disc/';
  // appconstantpmp = "http://13.234.64.82:8080/DaimPMP/pmp/";
  // appconstantispr = "http://13.234.64.82:8080/DaimISPR/ispr/";
  // appconstantpackaging = 'http://13.234.64.82:8080/DaimPackaging/pack/';
  // globalurl = "http://localhost:4200"


  // //live-serve
  Coreappconstant = 'https://www.digitalsupplychain.bharatbenz.com/DICVDISC/core/';
  appconstantpdp = 'https://www.digitalsupplychain.bharatbenz.com/DaimPDP/pdp/';
  appconstant = 'https://www.digitalsupplychain.bharatbenz.com/DICVDISC/disc/';
  appconstantpmp = "https://www.digitalsupplychain.bharatbenz.com/DaimPMP/pmp/";
  appconstantispr = "https://www.digitalsupplychain.bharatbenz.com/DaimISPR/ispr/";
  appconstantpackaging = 'https://www.digitalsupplychain.bharatbenz.com/DaimPackaging/pack/';
  appconstantgp = 'https://www.digitalsupplychain.bharatbenz.com/DaimGatepass/gp/';
  appconstantrakto = 'https://www.digitalsupplychain.bharatbenz.com/DaimRAKTO/';
  appconstantkem = 'https://www.digitalsupplychain.bharatbenz.com/DaimKEM/';
  appconstantkys = 'https://www.digitalsupplychain.bharatbenz.com/DaimKYS/';
  appconstantIA = 'https://www.digitalsupplychain.bharatbenz.com/DaimIA/ia/';
  appconstantVAVE = 'https://www.digitalsupplychain.bharatbenz.com/DaimVeva/veva/';
  appconstantNPP = 'https://www.digitalsupplychain.bharatbenz.com/DaimNPP/npp/';
  DaimQm = 'https://www.digitalsupplychain.bharatbenz.com/DaimQm/qm/';
  DaimSuppDirectory = 'https://www.digitalsupplychain.bharatbenz.com/DaimSuppDirectory/'
  certificationCR = 'https://www.digitalsupplychain.bharatbenz.com/DICVDISC/certifi-status/'
  globalurl = "https://www.digitalsupplychain.bharatbenz.com/dicvscar/Daimpackaging";

  // Daimler-UAT-server
  // Coreappconstant = 'https://www.digitalsupplychain-qa.bharatbenz.com/DICVDISC/core/';
  // appconstantpdp = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimPDP/pdp/';
  // appconstant = 'https://www.digitalsupplychain-qa.bharatbenz.com/DICVDISC/disc/';
  // appconstantpmp = "https://www.digitalsupplychain-qa.bharatbenz.com/DaimPMP/pmp/";
  // appconstantispr = "https://www.digitalsupplychain-qa.bharatbenz.com/DaimISPR/ispr/";
  // appconstantpackaging = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimPackaging/pack/';
  // appconstantgp = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimGatepass/gp/';
  // appconstantrakto = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimRAKTO/';
  // appconstantkem = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimKEM/';
  // appconstantkys = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimKYS/';
  // appconstantIA = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimIA/ia/';
  // appconstantVAVE = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimVeva/veva/';
  // appconstantNPP = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimNPP/npp/';
  // DaimQm = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimQm/qm/';
  // DaimSuppDirectory = 'https://www.digitalsupplychain-qa.bharatbenz.com/DaimSuppDirectory/'
    // certificationCR = 'https://www.digitalsupplychain-qa.bharatbenz.com/DICVDISC/certifi-status/'
  // globalurl = "https://www.digitalsupplychain-qa.bharatbenz.com/dicvscar/Daimpackaging";

  // Daimler-Test-server
  // Coreappconstant = 'http://53.226.243.161:8080/DICVDISC/core/';
  // appconstantpdp = 'http://53.226.243.161:8080/DaimPDP/pdp/';
  // appconstant = 'http://53.226.243.161:8080/DICVDISC/disc/';
  // appconstantpmp = "http://53.226.243.161:8080/DaimPMP/pmp/";
  // appconstantispr = "http://53.226.243.161:8080/DaimISPR/ispr/";
  // appconstantpackaging = 'http://53.226.243.161:8080/DaimPackaging/pack/';
  // appconstantgp = 'http://53.226.243.161:8080/DaimGatepass/gp/';
  // appconstantrakto = 'http://53.226.243.161:8080/DaimRAKTO/';
  // appconstantkem = 'http://53.226.243.161:8080/DaimKEM/';
  // appconstantkys = 'http://53.226.243.161:8080/DaimKYS/';
  // appconstantIA = 'http://53.226.243.161:8080/DaimIA/ia/';
  // appconstantVAVE = 'http://53.226.243.161:8080/DaimVeva/veva/';
  // globalurl = "http://53.226.243.161:8080/dicvscar/Daimpackaging";

  // local-dev-Server
  // Coreappconstant = 'http://172.30.1.200:9500/DICVDISC/core/';
  // appconstant = 'http://172.30.1.200:9500/DICVDISC/disc/';
  // appconstantpdp = 'http://172.30.1.200:9500/DaimPDP/pdp/';zz
  // appconstantpmp="http://172.30.1.200:9500/DaimPMP/pmp/";
  // // Demo-Server
  // appconstant = "https://sevael.in/iTechQuest/";

  // getsession = JSON.parse(localStorage.getItem("sevinvoicesession"));
  constructor(private router: Router,) {

  }
  public session: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  getsession(value:any) {
    this.session.next(value);
  }

  showNotification(from:any, align:any, msg:any, type:any) {

    $.notify({
      icon: 'notifications',
      message: msg

    }, {
        type: type,
        timer: 2000,
        placement: {
          from: from,
          align: align
        }
      });
  }

  // appcode = 'vignesshgmailcom'
  // userid = 'users1';
  // logintype = 'superuser';
  //  getapi(value) {
  //      this.apidetail.next(value);
  //  }
  partid: any;
  setpartid(partid:any) {
    this.partid = partid;
    console.log(this.partid)
  }
  pmpProjectid = null;
  pmpProjectname = null;
  pmppartid = null;
  pmpStatusProjectid = null;
  pmpStatusProjectName=null;
  devstatusmailteam = [];
  devstatuspartid = [];
  tabflag=false
  isprReport(value:any){
    this.tabflag = value
   
  }
  StatusColor(key:any){

    var colorsMap:any = {
        "Requester L4 Approved":'#EAEAEA',
        "SM L4 Rejected":'#FF2E2E',
        "Completed":'#72AF00',
        "IPL L4 Approved":'#A0A0A0',
        "SM Approval Pending":'#ffe55c',
        "SM L4 Approval Pending":'#ffe55c',
        "Warehouse Manager Approval Pending":'#ffe55c',
        "Warehouse L4 Approval Pending":'#ffe55c',
        "Warehouse Manager Entry Pending":'#ffe55c',
        "Material Gate Entry Pending":'#ffe55c',
        "Reciept Confirmation Pending":"#ffe55c",
        "Reciept Confirmed":"#72AF00",
        "Gate Inward Entry Pending":"#ffe55c",
        "Gate Outward Entry Pending":"#ffe55c",
        "Rejected by SM L4":"#FF2E2E",
        "Rejected by SM":"#FF2E2E",
        "NPM Manager Approval Pending":"#ffe55c",
        "Rejected by NPM Manager":"#FF2E2E",
        "Rejected by Warehouse Manager":"#FF2E2E",
        "Rejected by Warehouse L4":"#FF2E2E",
        "Closed":"#72AF00",
        "Requester L4 Approval Pending":"#ffe55c",
        "Rejected by Requester L4":'#FF2E2E',
        "Requester L3 Approval Pending":"#ffe55c",
        "SM L3 Approval Pending":"#ffe55c",
        "Rejected by SM L3":"#FF2E2E",
    }
    var colorsVal = "";
    if(colorsMap.hasOwnProperty(key)){
        colorsVal = colorsMap[key];
    }else{
        colorsVal = key;
    }

    return colorsVal;
  }
  SColor(key:any){
    var colorsMap:any = {
        "Requester L4 Approved":'#000000',
        "SM L4 Rejected":'#fff',
        "Completed":'#fff',
        "IPL L4 Approved":'#fff',
        "SM Approval Pending":'#000000',
        "SM L4 Approval Pending":'#000000',
        "Warehouse Manager Approval Pending":'#000000',
        "Warehouse L4 Approval Pending":'#000000',
        "Warehouse Manager Entry Pending":'#000000',
        "Material Gate Entry Pending":'#000000',
        "Reciept Confirmation Pending":"#000000",
        "Reciept Confirmed":"#ffffff",
        "Gate Inward Entry Pending":"#000000",
        "Gate Outward Entry Pending":"#000000",
        "Rejected by SM L4":"#fff",
        "Rejected by SM":"#fff",
        "NPM Manager Approval Pending":"#000000",
        "Rejected by NPM Manager":"#fff",
        "Rejected by Warehouse Manager":"#fff",
        "Rejected by Warehouse L4":"#fff",
        "Closed":"#fff",
        "Requester L4 Approval Pending":"#000000",
        "Rejected by Requester L4":"#fff",
        "Requester L3 Approval Pending":"#000000",
        "SM L3 Approval Pending":"#000000",
        "Rejected by SM L3":"#FF2E2E",
    }
    var colorsVal = "";
    if(colorsMap.hasOwnProperty(key)){
        colorsVal = colorsMap[key];
    }else{
        colorsVal = key;
    }

    return colorsVal;
  }

  ktoStatusColor(key:any){

    var colorsMap:any = {
        "Vendor Receipt Confirmed":'#4caf50',
        "Rejected by SM":'#FF2E2E',
        "Completed":'#72AF00',
        "IPL L4 Approved":'#A0A0A0',
        "SM Approval Pending":'#ffe55c',
        "Vendor Receipt Confirm Pending":'#ffe55c',
        "Warehouse Manager Approval Pending":'#ffe55c',
        "IBL Approval Pending":"#ffe55c",
        "Draft":"#ffe55c",
        "Warehouse Manager Dispatch Pending":"#ffe55c",
        "SM L4 Approval Pending":"#ffe55c",
        "Rejected by SM L4":'#FF2E2E',
    }
    var colorsVal = "";
    if(colorsMap.hasOwnProperty(key)){
        colorsVal = colorsMap[key];
    }else{
        colorsVal = key;
    }

    return colorsVal;
  }
  ktoSColor(key:any){
    var colorsMap:any = {
        "Vendor Receipt Confirmed":'#fff',
        "Rejected by SM":'#fff',
        "Completed":'#fff',
        "IPL L4 Approved":'#fff',
        "SM Approval Pending":'#000000',
        "Vendor Receipt Confirm Pending":'#000000',
        "Warehouse Manager Approval Pending":'#000000',
        "IBL Approval Pending":"#000000",
        "Draft":"#000000",
        "Warehouse Manager Dispatch Pending":"#000000",
        "SM L4 Approval Pending":"#000000",
        "Rejected by SM L4":'#fff',
        
    }
    var colorsVal = "";
    if(colorsMap.hasOwnProperty(key)){
        colorsVal = colorsMap[key];
    }else{
        colorsVal = key;
    }

    return colorsVal;
  }
  pdf_generator_fun(svg_:any) {
    var width = 600;
    var height = 600;
    var canvas = document.createElement('canvas');
    // get canvas context for drawing on canvas
    var context:any = canvas.getContext('2d');
    // set canvas size
    canvas.width = width;
    canvas.height = height;
    // create image in memory(not in DOM)
    var image = new Image();
    var img = new Image();
    image.onload = function () {
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      var pngData = canvas.toDataURL('image/' + "png");

      img.src = pngData;
      let set_base64 = pngData.split(",")
      localStorage.setItem("base64_svg_to_png_url", set_base64[1]);
    };
    image.src = svg_;
  }
  isInvalid(formName:FormGroup,controlName: string) {
    let getform = formName
    const control = getform.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
  public markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
}
}
