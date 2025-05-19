import { Component, OnInit, Injectable, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebserviceService } from '../services/webservice.service';
import { DatatransferService } from '../services/datatransfer.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
// import { get } from 'https';
declare var $:any;
@Component({
  standalone: true,
  imports: [CommonModule,RouterOutlet, ReactiveFormsModule],
  providers:[WebserviceService,DatatransferService],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { 

  errormsg: any;
  loginForm: FormGroup;
  externalloginForm: FormGroup;
  finalappcode: any;
  emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){2,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numbervalidation = /^[0-9]+$/;
  alphaWithoutSpace = /^[a-zA-Z]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  decimalnumber = /^(0|[1-9]\d*)(\.\d+)?$/;
  alphawithdot = /^[a-zA-Z. ]+$/;
  alpha = /^[A-Za-z\s]+$/;
  passwordvalidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  contactnmber = /^[0-9\-+()\d\s]+$/
  forgetpassFormExternal: any;
  forgetpassFormInternal: any;
  newExternaluserForm: any;
  captchaImg:any;
  captchaId:any;

  /** Api Call */
  private verifyuserapi = this.getdata.appconstant + 'verifyDICVUser';
  private verifySupplieruserapi = this.getdata.appconstant + 'verifySupplierUser';
  /* vendorcode email password*/
  private lisesuppteamsapi = this.getdata.Coreappconstant + 'listSuppTeams';
  private searchSupplierapi = this.getdata.appconstant + 'searchSupplier';
  private getSupplierapi = this.getdata.appconstant + 'getSupplier/';
  private supplierSignupapi = this.getdata.appconstant + 'supplierSignup';
  private DICVForgetPasswordapi = this.getdata.appconstant + 'forgotDICVPassword ';
  private forgotSupplierPasswordapi = this.getdata.appconstant + 'forgotSupplierPassword ';
  private supplierDesignationapi = this.getdata.appconstant + 'listSuppDesignation';

  constructor(private spinner : NgxSpinnerService, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService) {
    this.loginForm = Formbuilder.group({
      'shoertId': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required])],
    });
    this.externalloginForm = Formbuilder.group({
      'vendorcode': [null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailvalidation),])],
      'password': [null, Validators.compose([Validators.required])],
    });
    this.forgetpassFormExternal = Formbuilder.group({
      'emailid': [null, Validators.compose([Validators.required, Validators.pattern(this.emailvalidation),])],
      'vendorCode': [null, Validators.compose([Validators.required])],
    });
    this.forgetpassFormInternal = Formbuilder.group({
      'shortid': [null, Validators.compose([Validators.required, Validators.pattern(this.alphanumeric)])],
    });
    this.newExternaluserForm = Formbuilder.group({
      'department': [null, Validators.compose([Validators.required, Validators.pattern(this.alpha)])],
      'teamid': [null, Validators.compose([Validators.required])],
      "vendorCode": [null],
      'emailid': [null, Validators.compose([Validators.required, Validators.pattern(this.emailvalidation)])],
      'supplierid': [null, Validators.compose([Validators.required])],
      'suppliercode': [null, Validators.compose([Validators.required])],
      // 'designationid':[null, Validators.compose([Validators.required])],
      'fullname': [null, Validators.compose([Validators.required, Validators.pattern(this.alpha)])],
      "companyname": [null],
      'mobilenumber': [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation), Validators.minLength(10)])],
    })
  }

  loginFormType = 'internal';


  ngOnInit() {
    this.deleteCookie('disc-cookies');
  //  $("#reward_popup").modal("show")

    if (this.getCheckToken() == null || this.getCheckToken() == "") {
      localStorage.removeItem('disc-portal-session');
      localStorage.removeItem('Daim-packagingSession');
    }
    else if (this.session() == null) {
    }
    else {
    }
    // this.getallsuppDesignation()
  }
  deleteCookie(cname:any) {
    var d = new Date();
    d.setTime(d.getTime() - (3 * 3600000000));
    var expires = "expires=" + d.toUTCString();
    window.document.cookie = cname + "=" + "; " + expires;

}
  getCheckToken() {
    return this.getCookie('disc-cookies');
  }
  getcheckToken() {
    return this.getCookie('disc-cookies');
  }
  suppteams: any;
  getallsuppTeams() {
    let reqdata = ""
    return this.makeapi.method(this.lisesuppteamsapi, reqdata, "post")
      .subscribe((data:any) => {
        this.suppteams = data;
      });
  }
  Designation: any;
  getallsuppDesignation() {
    let reqdata = ""
    return this.makeapi.method(this.supplierDesignationapi, reqdata, "post")
    .subscribe((data:any) => {
      this.Designation = data;
      });
  }
  token: any;
  /** Get Session Data */
  session() {
    // Decode the String
    if (localStorage.getItem("disc-portal-session") != null) {
      var encodedString:any = localStorage.getItem("disc-portal-session");
      encodedString = encodedString.substring(6);
      var decodedString = atob(encodedString);
      return JSON.parse(decodedString);
    }
  }
  errormessage: any;
  setPackagingFlag(data:any) {
    var stringdata = JSON.stringify(data)
    var disc_packaging_flag = data['packaging'];
    if (disc_packaging_flag == undefined) {
      disc_packaging_flag = 0;
    }
    disc_packaging_flag = 1;
    localStorage.setItem('disc_packaging_flag', disc_packaging_flag)
  }
  /** Login Form On submit */
  onFormSubmit() {
    console.log("form submit");

    if (this.loginForm.invalid == true) {
      this.markFormGroupTouched(this.loginForm);
    }
    else {
      this.spinner.show();
      var invalidMessage = "Invalid Login Credentials"
      let reqdata = 'user=' + this.loginForm.value.shoertId + '&password=' + this.loginForm.value.password
      return this.makeapi.method(this.verifyuserapi, reqdata, "postlogin")
        .subscribe((response:any) => {
          this.spinner.hide();
          var data = response.json();
          if ((data.status).toLowerCase() == "success" && response.headers.get('access-control-bharatbenz-token') != null) {
            // Create a new Date object for the current time
            const currentTime = new Date();

            // Subtract 20 minutes from the current time
            const twentyMinutesAgo = new Date(currentTime.getTime() + 29 * 60000);

            // Format the result as a string (HH:MM format)
            const formattedTime = `${String(twentyMinutesAgo.getHours()).padStart(2, '0')}:${String(twentyMinutesAgo.getMinutes()).padStart(2, '0')}:${String(twentyMinutesAgo.getSeconds()).padStart(2, '0')}`;
            localStorage.setItem("token_expire_time", formattedTime)
            localStorage.setItem("timmer", '1800')

            localStorage.setItem("critical_supplier", "success")
            this.setCookie('disc-cookies', response.headers.get('access-control-bharatbenz-token'), 3)
            this.makeapi.getToken();
            //roleid
            localStorage.setItem("login_data", JSON.stringify(data))
            localStorage.setItem("first_login", String(data.firsttimelogin))
            localStorage.setItem("team_id", data.teamid)
            var decoded_roleid = window.atob(data.roleid);
            data.roleid = parseInt(decoded_roleid)

            //roleid



            // Encode the String

            this.setPackagingFlag(data)

            var stringdata = JSON.stringify(data)
            var encodeddata = btoa(unescape(encodeURIComponent(stringdata)));;
            encodeddata = "az-vel" + encodeddata;
            localStorage.setItem("disc-portal-session", (encodeddata));
            localStorage.setItem('Daim-packagingSession', (encodeddata));


            // token time out calculation
            var time = new Date()
            var d = new Date(time);
            let minutes = d.getMinutes();
            let sec = d.getSeconds();
            let getminutes = minutes * 60
            let getsec = getminutes + sec
            localStorage.setItem("minutes_secs", String(getsec))
            localStorage.setItem("minutes_", String(minutes))

            this.makeapi.getuserinfo();

            this.router.navigateByUrl('/dashboard/home');


          }
          else if (data.id == 0) {
            this.errormsg = invalidMessage;
            this.router.navigateByUrl('/login');
            this.getdata.showNotification('bottom', 'right', invalidMessage, "danger");
          }
          else if (data.id == -1) {
            this.errormsg = invalidMessage;
            this.router.navigateByUrl('/login');
            this.getdata.showNotification('bottom', 'right', invalidMessage, "danger");
          }
          else if (data.id == -2) {
            this.errormsg = "You have exceeded number of Failed Attempts.Please reset your Password.";
            this.router.navigateByUrl('/login');
            this.getdata.showNotification('bottom', 'right', "You have exceeded number of Failed Attempts.Please reset your Password.", "danger");
          }
          else {
            this.errormsg = invalidMessage;
            this.getdata.showNotification('bottom', 'right', invalidMessage, "danger");
          }
        });
    }
  }
  onFormSubmitExternal() {
    if (this.externalloginForm.invalid == true) {
      this.markFormGroupTouched(this.externalloginForm);
    }
    else {
      this.spinner.show();
      let reqdata = "vendorcode=" + this.externalloginForm.value.vendorcode + "&email=" + this.externalloginForm.value.email + "&password=" + this.externalloginForm.value.password;
      return this.makeapi.method(this.verifySupplieruserapi, reqdata, "postlogin")
        .subscribe((response:any) => {
          this.spinner.hide();
          var data = response.json();
          if (data.status == "Success" && response.headers.get('access-control-bharatbenz-token') != null) {

            // Create a new Date object for the current time
            const currentTime = new Date();

            // Subtract 20 minutes from the current time
            const twentyMinutesAgo = new Date(currentTime.getTime() + 29 * 60000);

            // Format the result as a string (HH:MM format)
            const formattedTime = `${String(twentyMinutesAgo.getHours()).padStart(2, '0')}:${String(twentyMinutesAgo.getMinutes()).padStart(2, '0')}:${String(twentyMinutesAgo.getSeconds()).padStart(2, '0')}`;
            localStorage.setItem("token_expire_time", formattedTime)
            localStorage.setItem("timmer", '1800')

            localStorage.setItem("critical_supplier", "success")
            localStorage.setItem("first_login", String(data.firsttimelogin))
            localStorage.setItem("login_data", JSON.stringify(data))
            this.setCookie('disc-cookies', response.headers.get('access-control-bharatbenz-token'), 1)
            this.makeapi.getToken();
            //roleid

            var decoded_roleid = window.atob(data.roleid);
            data.roleid = parseInt(decoded_roleid)



            var sesData = data;
            sesData.vendorcode = this.externalloginForm.value.vendorcode;
            sesData = JSON.stringify(sesData)

            var stringdata = JSON.stringify(data)

            this.setPackagingFlag(data)
            var encodeddata = btoa(sesData);
            encodeddata = "az-vel" + encodeddata;

            localStorage.setItem("disc-portal-session", (encodeddata));
            localStorage.setItem('Daim-packagingSession', (encodeddata));

            // token time out calculation
            var time = new Date()
            var d = new Date(time);
            let minutes = d.getMinutes();
            let sec = d.getSeconds();
            let getminutes = minutes * 60
            let getsec = getminutes + sec
            localStorage.setItem("minutes_secs", String(getsec))
            localStorage.setItem("minutes_", String(minutes))

            this.makeapi.getuserinfo();
            this.router.navigateByUrl('/dashboard/home');
          }
          else if (data.id == 0) {
            this.errormsg = 'Invalid Vendor code or Email or Password';
            this.router.navigateByUrl('/login');
            this.getdata.showNotification('bottom', 'right', 'Invalid Vendor code or Email or Password..!', "danger");
          }
          else if (data.id == -1) {
            this.errormsg = 'Invalid Vendor code or Email or Password';
            this.router.navigateByUrl('/login');
            this.getdata.showNotification('bottom', 'right', 'Invalid Vendor code or Email or Password..!', "danger");
          }
          else if (data.id == -2) {
            this.errormsg = 'You have exceeded number of Failed Attempts.Please reset your Password.';
            this.router.navigateByUrl('/login');
            this.getdata.showNotification('bottom', 'right', 'You have exceeded number of Failed Attempts.Please reset your Password.', "danger");
          }
          else {
            this.errormsg = 'Invalid Vendor code or Email or Password';
            this.getdata.showNotification('bottom', 'right', 'Invalid Vendor code or Email or Password..!', "danger");
          }
        },);
    }
  }
  logintype(type:any) {
    this.loginForm.reset();
    this.externalloginForm.reset();
    this.errormsg = "";
    this.loginFormType = type;
  }
  submitCaptcha(id:any) {
    var verifyCaptchaUrl = this.getdata.appconstant + 'verifyCaptcha';
    //id, value
    // var reqData = {"id":this.captchaId,"value":$("#enteredValue").val()}
    let reqdata = "id=" + this.captchaId + "&value=" + $("#" + id).val();
    console.log(reqdata);

    this.makeapi.method(verifyCaptchaUrl, reqdata, "post")
      .subscribe((response:any) => {
        $("#enteredValue").val("")
        console.log(response);
        if (response.status == "Success") {
          if (this.loginFormType == 'internal') {
            this.confirmRecoverPasswordInternal();
          } else {
            this.confirmRecoverPasswordExternal();
          }
        }

      });
  }

  forgetpass() {
    //call captacha image and assign to captchaImg
    var getCaptchaUrl = this.getdata.appconstant + 'getCaptcha';
    this.makeapi.method(getCaptchaUrl, "", "get")
      .subscribe((response:any) => {
        this.captchaImg = 'data:image/jpeg;base64,' + response.image;
        console.log(response);
        this.captchaId = response.id;
        if (this.loginFormType == 'internal') {
          $("#forgetpassInternal").modal('show');
          this.forgetpassFormInternal.reset();
        }
        else {
          $("#forgetpassExternal").modal('show')
          this.forgetpassFormExternal.reset();
        }


      });


  }
  confirmRecoverPasswordInternal() {
    if (this.forgetpassFormInternal.invalid == true) {
      this.markFormGroupTouched(this.forgetpassFormInternal);
    }
    else {
      var reqdata = JSON.stringify(this.forgetpassFormInternal.value)
      return this.makeapi.methodNoAuth(this.DICVForgetPasswordapi, reqdata, "postjson")
        .subscribe((data:any) => {
          if (data.status == 'Failure') {
            this.getdata.showNotification('bottom', 'right', data.field + '!!', "danger");
          }
          else {
            $("#forgetpassInternal").modal('hide');
            this.getdata.showNotification('bottom', 'right', "New password successfully send to your E-mail Id..!", "success");
          }
        });
    }
  }
  confirmRecoverPasswordExternal() {
    if (this.forgetpassFormExternal.invalid == true) {
      this.markFormGroupTouched(this.forgetpassFormExternal);
    }
    else {
      var reqdata = JSON.stringify(this.forgetpassFormExternal.value)
      return this.makeapi.method(this.forgotSupplierPasswordapi, reqdata, "postjson")
        .subscribe((data:any) => {
          if (data.status == 'Failure') {
            this.getdata.showNotification('bottom', 'right', data.field + '!!', "danger");
          }
          else {
            $("#forgetpassExternal").modal('hide');
            this.getdata.showNotification('bottom', 'right', "New password successfully send to your E-mail Id..!", "success");
          }
        });
    }
  }
  newuser() {
    this.newExternaluserForm.reset();
    $("#captcha_text").val("")
    this.emailerror = ''
    this.fetchCaptcha()
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control:any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  setCookie(cname:any, cvalue:any, expireHrs:any) {
    if(cvalue == null){
      this.router.navigateByUrl('/login');
    }else{
    var d = new Date();
    d.setTime(d.getTime() + (expireHrs * 3600000000));
    var expires = "expires=" + d.toUTCString();
    window.document.cookie = cname + "=" + cvalue + "; " + expires;
    }
  }
  getToken() {
    this.token = this.getCookie('disc-cookies');
  }
  getCookie(cname:any) {
    var name = cname + "=";
    var cArr = window.document.cookie.split(';');
    for (var i = 0; i < cArr.length; i++) {
      var c = cArr[i].trim();
      if (c.indexOf(name) == 0)
        return c.substring(name.length, c.length);
    }
    return "";
  }


  vendorcodelist:any=[];
  totalvendordata: any;
  vendorcodekeydown(value:any) {
   value = value.trim()

    if (this.vendorcodelist.indexOf(value) != -1) {
      return this.makeapi.method(this.getSupplierapi + value, "", "get")
        .subscribe((data:any) => {
          var getpackeditdata = this.newExternaluserForm.value;
          getpackeditdata.supplierid = data.id;
          getpackeditdata.suppliercode = data.code;

          if (getpackeditdata.suppliercode != '') {
            getpackeditdata.suppliercode = getpackeditdata.suppliercode.trim();
          }

          var companyaddress;
          if (data.name != null)
            companyaddress = data.name;

          if (data.address != null)
            companyaddress = companyaddress + "\n" + data.address;

          if (data.city != null)
            companyaddress = companyaddress + "\n" + data.city;

          if (data.state != null)
            companyaddress = companyaddress + "\n" + data.state;

          if (data.country != null)
            companyaddress = companyaddress + "\n" + data.country;

          if (data.postalCode != null)
            companyaddress = companyaddress + "-" + data.postalCode;


          getpackeditdata.companyname = companyaddress;
          this.newExternaluserForm.patchValue(getpackeditdata);
        });
    }
    else {
      this.vendorcodelist = [];
      if (value.length > 3) {
        let reqdata = "suppliercode=" + value
        console.log(reqdata);
        return this.makeapi.method(this.searchSupplierapi, reqdata, "post")
          .subscribe((data:any) => {
            this.totalvendordata = data;
            for (var i = 0; i < data.length; i++) {
              this.vendorcodelist[i] = data[i].code.trim();
            }
            if (data.length == 1) {
              console.log("SHORTID");
              this.vendorcodekeydown(data[0].code)
            }
          });
      } else {
        console.log("Less than Value length");
      }
    }
  }
  confirmExternalsignup() {
    let reqdata = this.newExternaluserForm.value;
    let check_val = this.newExternaluserForm.controls
    if (check_val['fullname'].status == "INVALID" ||
      check_val['emailid'].status == "INVALID" || check_val['mobilenumber'].status == "INVALID"
      || check_val['teamid'].status == "INVALID" || check_val['department'].status == "INVALID") {
      this.markFormGroupTouched(this.newExternaluserForm);
      this.getdata.showNotification('bottom', 'right', "Form is Invalid", "danger");
    }
    else {

      reqdata.firsttimelogin = 1
      delete reqdata.companyname;
      delete reqdata.suppliercode;
      return this.makeapi.method(this.supplierSignupapi, JSON.stringify(reqdata), "postjson")
        .subscribe((data:any) => {
          if (data.status == "Success" || data.status == "success") {
            this.deleteCookie('disc-cookies');
            $("#newExternaluser").modal('hide')
            this.newExternaluserForm.reset()
            this.getdata.showNotification('bottom', 'right', "Sign up is  pending for approval..!", "success");
          }
          else if (data.status == "Failure" || data.status == "failure") {
            this.getdata.showNotification('bottom', 'right', data.field, "danger");
          }
          else {
            this.getdata.showNotification('bottom', 'right', data.field, "danger");
          }
        });
    }
  }
  manualtype: any;
  openusermanual(type:any) {
    if (type == 'internal') {
      this.manualtype = type;
    }
    else {
      this.manualtype = type;
    }
    $("#SrrPerfomanceImage").modal("show");
  }

  bluercheckemail() {
    if (this.show_otp) {
      this.fetchCaptcha()
    }
    clearInterval(this.timer)
    this.show_otherfields = false
    this.generate_otp_val = true
    this.show_otp = false
    $("#otpcopymail").val(this.newExternaluserForm.value.emailid)
    this.emailerror = ''

  }
  new_user_popup_close(){
    this.deleteCookie('disc-cookies');
    clearInterval(this.timer)
    $("#newExternaluser").modal('hide')
  }
  show_otherfields = false
  signup_captchaId:any
  signup_captchaImg:any
  fetchCaptcha() {
    this.generate_otp_val = true
    this.overall_hide = true
    this.show_otp = false
    this.show_otherfields = false
    //call captacha image and assign to captchaImg
    var getCaptchaUrl = this.getdata.appconstant + 'getCaptcha';
    this.makeapi.method(getCaptchaUrl, "", "get")
    .subscribe((response:any) => {
      clearInterval(this.timer)
      this.signup_captchaImg = 'data:image/jpeg;base64,'+response.image;
      this.signup_captchaId = response.id; 
      $("#newExternaluser").modal('show')
    });

  }
  emailerror:any
  verify_captcha() {
    let value = $("#captcha_text").val()
    let reqdata = "id=" + this.signup_captchaId + "&value=" + value;
    if ((!this.newExternaluserForm.controls.emailid.valid || !this.newExternaluserForm.controls.vendorCode.valid)) {
      this.getdata.showNotification('bottom', 'right', 'Vendor Code (or) Email is invalid !!', "danger");
    } else if (value == "") {
      this.getdata.showNotification('bottom', 'right', 'Please Enter the Captcha !!', "danger");
    }
    else {
      var verifyCaptchaUrl = this.getdata.appconstant + 'verifyCaptcha';
      this.makeapi.method(verifyCaptchaUrl, reqdata, "post")
        .subscribe((data:any) => {
          if (data.status.toLowerCase() == 'success') {
            this.generate_otp()
          } else {
            this.getdata.showNotification('bottom', 'right', 'Invalid Captcha', "danger");
          }

        });
    }
  }
  generate_otp_val = true
  show_otp = false
  generate_otp() {
    let generateMailOtp = this.getdata.appconstant + 'generateMailOtp'
    let reqdata = "email="+this.newExternaluserForm.value.emailid + "&type=2" + "&code=" + this.newExternaluserForm.value.vendorCode;
    this.makeapi.methodNoAuth(generateMailOtp, reqdata, "post")
    .subscribe((data:any) => {
        if(data.status.toLowerCase() == 'success'){
          this.generate_otp_val = false
          this.show_otp = true
          this.otp_timer = ''
          this.remainingTime = data.valid_duration_in_secs
          this.start()
          this.getdata.showNotification('bottom', 'right', data.field, "success");
          setTimeout(() => {
            $("#otp_text").focus();
          }, 10)
        } else {
          this.getdata.showNotification('bottom', 'right', data.field, "danger");

        }
      });
  }
  timer: any; // Timer variable
  private remainingTime:any; // Remaining time in seconds
  interval: number = 1000; // Interval in milliseconds (1 second)
  otp_timer = ''

 start() {
   this.timer = setInterval(() => {
     this.remainingTime--;
     if (this.remainingTime <= 0) {
       this.stop();
     } else {
       this.otp_timer = this.formatTime(this.remainingTime);
     }
   }, this.interval);
 }

 stop() {
   clearInterval(this.timer);
   this.remainingTime = 0
   this.getdata.showNotification('bottom', 'right', "Timeout", "danger");
   this.generate_otp_val = true
   this.show_otp = false
   this.otp_timer = ''
   this.show_otherfields = false
   this.fetchCaptcha()
   this.deleteCookie('disc-cookies');
 }

 private formatTime(seconds: number): string {
   const minutes = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
 }


  overall_hide = true
  verify_otp() {
    var verifyMailOtp = this.getdata.appconstant + 'verifyMailOtp';
    let value = $("#otp_text").val()
    let reqdata = "email="+this.newExternaluserForm.value.emailid+"&otp="+value;
      if(value != "" && this.newExternaluserForm.controls.emailid.valid){
       this.makeapi.methodNoAuth(verifyMailOtp, reqdata, "postsignup")
    .subscribe((response:any) => {
      var data = response;
      if(response.headers.get('access-control-bharatbenz-token') != null){
      this.setCookie('disc-cookies', response.headers.get('access-control-bharatbenz-token'), 2)
      this.makeapi.getToken();
        clearInterval(this.timer)
        this.overall_hide = false
      this.show_otherfields = true
      this.show_otp = false
      this.otp_timer = ''
      this.remainingTime = 300
      this.start()
      this.getallsuppTeams();
      setTimeout(()=>{
        $("#otpcopymail").val(this.newExternaluserForm.value.email)
      },10)
      this.getdata.showNotification('bottom', 'right', 'OTP Verified Successfully', "success");
    }else{
      this.getdata.showNotification('bottom', 'right', 'Something went wrong, Please try again !!', "danger");
    }
    });
      }else{
        this.getdata.showNotification('bottom', 'right', 'Please Enter the OTP !!', "danger");
      }
  }
  resend_otp(){
    clearInterval(this.timer)
    this.fetchCaptcha()
    this.generate_otp_val = true
    this.show_otp = false
  }
  mag_type:number = 1
  magazine(type:number){
    this.mag_type = type
    if(type == 2){
      setTimeout(()=>{
        this.mag_type = 3
      },1600)
    }
  }
}
