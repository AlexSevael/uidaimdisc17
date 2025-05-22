import { Component, OnInit,HostListener,OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebserviceService } from '../../services/webservice.service';
import { DatatransferService } from '../../services/datatransfer.service';
import { AuthGuard } from '../../services/canactivate.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { WebService } from 'src/app/quality/packaging/packservices/webservice';
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'home', title: 'Dashboard', icon: 'dashboard', class: '' },
    { path: 'upload', title: 'Upload File', icon: 'bubble_chart', class: '' },
    { path: 'settlement', title: 'Voucher Settlement', icon: 'content_paste', class: '' },
    { path: 'issuereport', title: 'Advance issued report', icon: 'library_books', class: '' },
    { path: '../login', title: 'Logout', icon: 'unarchive', class: 'active-pro' },
];

@Component({
 standalone: true,
  imports: [CommonModule,RouterOutlet, ReactiveFormsModule],
  providers:[WebserviceService,DatatransferService],
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
      this.remainingTime = 1800;
      this.showtime = '30:00'
      this.stop()
      this.start()
    }
  
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
      this.remainingTime = 1800;
      this.showtime = '30:00'
      this.stop()
      this.start()
    }
  
    @HostListener('document:keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
      this.remainingTime = 1800;
      this.showtime = '30:00'
      this.stop()
      this.start()
    }
   @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent): void {
      this.remainingTime = 1800;
      this.showtime = '30:00'
      this.stop()
      this.start()
    }
  
    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
      this.remainingTime = 1800;
      this.showtime = '30:00'
      this.stop()
      this.start()
    }
  
    @HostListener('document:mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
      this.remainingTime = 1800;
      this.showtime = '30:00'
      this.stop()
      this.start()
    }
  
    @HostListener('document:mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
      this.remainingTime = 1800;
      this.showtime = '30:00'
      this.stop()
      this.start()
    }
  
    ngOnDestroy(): void {
          this.stop()
      }
    menuItems: any[] = [];
    logintype: any;
    feedbackForm: any;
    restrictedUser  = false;
    

//     @HostListener('document:keydown', ['$event'])
//   onKeyDown(event: KeyboardEvent): void {
//     console.log('Key down:', event.key);
//   }

//   @HostListener('document:keyup', ['$event'])
//   onKeyUp(event: KeyboardEvent): void {
//     console.log('Key up:', event.key);
//   }

//   @HostListener('document:keypress', ['$event'])
//   onKeyPress(event: KeyboardEvent): void {
//     console.log('Key press:', event.key);
//   }
//  @HostListener('document:click', ['$event'])
//   onClick(event: MouseEvent): void {
//     console.log('Mouse clicked:', event);
//   }

//   @HostListener('document:mousemove', ['$event'])
//   onMouseMove(event: MouseEvent): void {
//     console.log('Mouse moved:', event);
//   }

//   @HostListener('document:mouseenter', ['$event'])
//   onMouseEnter(event: MouseEvent): void {
//     console.log('Mouse entered:', event);
//   }

//   @HostListener('document:mouseleave', ['$event'])
//   onMouseLeave(event: MouseEvent): void {
//     console.log('Mouse left:', event);
//   }


    constructor(public AuthGuard: AuthGuard, private Formbuilder: FormBuilder, public makeapi: WebserviceService, public router: Router, private getdata: DatatransferService) {
        /* document.addEventListener('contextmenu', function (e) {
             e.preventDefault();
         });*/

        document.onkeydown = fkey;
        document.onkeypress = fkey
        document.onkeyup = fkey;

        function fkey(e:any):any {
            e = e || window.event;

            if (e.keyCode === 123) {
                return (e.which || e.keyCode) != 123;
            }
            else if ((e.which === 82) && e.ctrlKey) {
                return false;
            }
            else if ((e.which === 83) && e.ctrlKey) {
                return false;
            }
            else if ((e.which === 73) && e.ctrlKey && e.shiftKey) {
                return false;
            }
            else if ((e.ctrlKey) && (e.which === 116)) {
                return false;
            }
        }
        // window.onresize = function()
        // {
        //     if ((window.outerHeight - window.innerHeight) > 100){
        // alert("inspect is open")
        //     }
        // }
        this.feedbackForm = Formbuilder.group({
            "feedback": [null, Validators.compose([Validators.required])],
        });
    }

    private listBUnitsapi = this.getdata.Coreappconstant + 'listBUnits';
    private getUserPrivapi = this.getdata.appconstant + 'getUserPriv';
    private getSuppPrivapi = this.getdata.appconstant + 'getSuppPriv';
    private DICVForgetConfirmPasswordapi = this.getdata.appconstant + 'DICVForgetConfirmPassword';
    private sendFeedbackapi = this.getdata.Coreappconstant + 'sendFeedback';
    private generateIBMSTokenapi = this.getdata.Coreappconstant + 'generateIBMSToken';
    private generatePayRetroToken = this.getdata.Coreappconstant + 'generatePayRetroToken?';
    private generateToolCapProToken = this.getdata.Coreappconstant + 'generateToolCapProToken?';
    private tokenExpireDuration = this.getdata.appconstant + 'tokenExpireDuration';
    private extendTokenValidityAPI = this.getdata.appconstant + 'extendTokenValidity'


    userbuids = []
    restrictUserid= {'shortid':'arulanv'}
    timeout:any
    setTime:any
    token_expire_time:any
    getmakeapi:any
    ngOnInit() {
        this.getmakeapi = this.makeapi
// Create a new Date object for the current time
const currentTime = new Date();

// Subtract 20 minutes from the current time
const twentyMinutesAgo = new Date(currentTime.getTime() + 29 * 60000);

// Format the result as a string (HH:MM format)
const formattedTime = `${String(twentyMinutesAgo.getHours()).padStart(2, '0')}:${String(twentyMinutesAgo.getMinutes()).padStart(2, '0')}`;
  
//    setInterval(()=>{
//     const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
//     console.log(currentTime)
//    },1000)


        // this.timmer_api()
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.getallBUnits();
        this.userbuids = this.AuthGuard.userbuids;
        if (this.AuthGuard.userroleid != 1) {
            this.selectbunits(1)
        }
        
        console.log(this.makeapi.userid);
        if(this.makeapi.userid == 'admin'){
            
        }
        this.stop()
        this.token_expire_time = localStorage.getItem('token_expire_time')
         this.remainingTime = Number(localStorage.getItem('timmer'))
         this.start()
    }

    timer: any; // Timer variable
    private remainingTime:number = 0 // Remaining time in seconds
    start() {
        this.stop()
        this.showtime = '30:00'
        this.timer = setInterval(() => {
          this.remainingTime--;
          if (this.remainingTime <= 0) {
            this.stop()
            this.logout()
          } else {
            this.showtime = this.formatTime(this.remainingTime);
            let date = new Date()
            const curr_time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            if((curr_time >= this.token_expire_time)){
                this.stop()
                this.token_api()
            }
          }
        }, 1000);
      }
      private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      }
    stop(){
        clearInterval(this.timer)
    }
    token_api(){
        clearInterval(this.timer)
        let getdata = this.AuthGuard.session()
        let reqdata = "user=" + getdata.id + "&vendorcode=" + getdata.code + "&email=" + getdata.emailid + "&roleid=" + getdata.roleid
        return this.makeapi.login_post(this.extendTokenValidityAPI,reqdata,"token_renew")
        .subscribe(response=>{
            this.deleteCookie('disc-cookies');
            this.setCookie('disc-cookies', response.headers.get('access-control-bharatbenz-token'), 1)
            this.makeapi.getToken();
            // this.pack_makeapi.getToken();

             const currentTime = new Date();
             const twentyMinutesAgo = new Date(currentTime.getTime() + 29 * 60000);
             const formattedTime = `${String(twentyMinutesAgo.getHours()).padStart(2, '0')}:${String(twentyMinutesAgo.getMinutes()).padStart(2, '0')}:${String(twentyMinutesAgo.getSeconds()).padStart(2, '0')}`;
            localStorage.removeItem("token_expire_time")
            localStorage.setItem("token_expire_time",formattedTime)
            this.token_expire_time = formattedTime
            localStorage.setItem("timmer",'1800')
            this.remainingTime = 1800
            this.start()
        },
        Error =>{
            
        })
    }
    setCookie(cname:any, cvalue:any, expireHrs:any) {
        var d = new Date();
        d.setTime(d.getTime() + (expireHrs * 3600000000));
        var expires = "expires=" + d.toUTCString();
        window.document.cookie = cname + "=" + cvalue + "; " + expires;
      }
    timeLeft: number = 0
  interval:any;
  showtime:any
  show_sec:any
  show_mins:any
  show_alert_secs:any
    startTimer(duration:any) {
        // const ms = new Date();
        // const ms1 = new Date(ms.getTime() + (30 * 60 * 1000));
        // var minus = ms1.getMinutes()
        // console.log(ms.getHours() +':' + minus + ':' + ms1.getSeconds());

        // let get_time = localStorage.getItem("setTime")
        let get_time = duration
        this.interval = setInterval(() => {
            let mins_secs = get_time.split(":")
            let set_mins = Number(mins_secs[0].trim())
            let set_secs = Number(mins_secs[1].trim())
            get_time = this.auto_timeout(set_mins,set_secs)
        },1000)
      }
      auto_timeout(mins:any,secs:any){
        var timeout = false
        if(secs == 0) {
            mins--;
            secs = 60
          }
        secs--;
        if(mins == 0 && secs == 0){
          this.showtime = '00 : 00'
          timeout = true
          setTimeout(()=>{
              this.show_alert_msg = false
            //   localStorage.removeItem("setTime")
              this.logout()
          },1000)   
        }
        if((mins == 5 && secs == 0)||(mins == 1 && secs == 0)||((mins == 0 && secs == 30)) || ((mins == 0 && secs == 10))){
          this.show_alert_secs = secs < 10 ? "0"+secs:secs 
          this.show_alert_secs = mins == 5 ? "5 mins" : mins == 1 ? "1 mins" : `${this.show_alert_secs} secs.`
          this.show_alert_msg = true
          setTimeout(()=>{
              this.show_alert_msg = false
          },7000)
        }
       
      this.show_sec = secs
      if(secs < 10){
          this.show_sec = `0${secs}`
      }
      this.show_mins = mins
      if(mins < 10){
          this.show_mins = `0${mins}`
      }
      if((secs == 0) || (mins == 0 && secs == 35)){
        this.token_api()
      }
      if(!timeout){
        this.showtime = `${this.show_mins} : ${this.show_sec}`
      }
      localStorage.setItem("setTime",this.showtime)
      return this.showtime
    }
show_alert_msg = false
close_alet_msg(){
    this.show_alert_msg = false
}
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    bUnits: any;
    getallBUnits() {
        let reqdata = ""
        return this.makeapi.post(this.listBUnitsapi, reqdata, "post")
            .subscribe(data => {
                this.bUnits = data;
            },
                Error => {
                });
    }
    userdata: any;
    usercompds:any = [];
    usermodids:any = [];
    count = 0;
    selectbunits(id:any) {
        this.usercompds = [];
        this.usermodids = [];
        if (this.AuthGuard.userroleid == 3) {
            let reqdata = "userid=" + this.makeapi.userid + "&buid=" + id;
            this.makeapi.post(this.getUserPrivapi, reqdata, "post")
                .subscribe(data => {
                    this.userdata = data;
                    for (var i = 0; i < data.length && data[i].active == 1; i++) {
                        this.usermodids[i] = data[i].modid;
                        this.usercompds[i] = (data[i].modid).toString() + (data[i].compid).toString();
                    }
                    this.usermodids = [1, 2, 3, 4, 5, 6]

                    var encodedString:any = localStorage.getItem("disc-portal-session");
                    encodedString = encodedString.substring(6);
                    var decodedString = atob(encodedString);
                    var addmodid = JSON.parse(decodedString);

                    addmodid["modids"] = this.usermodids;

                    // Encode the String
                    var stringdata = JSON.stringify(addmodid)
                    var encodeddata = btoa(stringdata);
                    encodeddata = "az-vel" + encodeddata;
                    localStorage.setItem("disc-portal-session", (encodeddata));

                    this.makeapi.usercompds = this.usercompds;

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
                    if (this.count != 0) {
                        this.router.navigateByUrl('/dashboard/home');
                    }
                    else {
                        this.count++;
                    }
                },
                    Error => {
                    });
        }
        else if (this.AuthGuard.session().roleid == 4) {
            this.usermodids = [2, 3, 4, 5]
            var encodedString:any = localStorage.getItem("disc-portal-session");
            encodedString = encodedString.substring(6);
            var decodedString = atob(encodedString);
            var addmodid = JSON.parse(decodedString);

            addmodid["modids"] = this.usermodids;

            // Encode the String
            var stringdata = JSON.stringify(addmodid)
            var encodeddata = btoa(stringdata);
            encodeddata = "az-vel" + encodeddata;
            localStorage.setItem("disc-portal-session", (encodeddata));

            this.makeapi.usercompds = this.usercompds;
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


            let reqdata = "teamid=" + this.AuthGuard.teamid
             this.makeapi.post(this.getSuppPrivapi, reqdata, "post")
                .subscribe(data => {
                    for (var i = 0; i < data.length && data[i].active == 1; i++) {
                        this.usermodids[i] = data[i].modid;
                        this.usercompds[i] = (data[i].modid).toString() + (data[i].compid).toString();
                    }
                    this.usermodids = [1, 2, 3]

                    var encodedString:any = localStorage.getItem("disc-portal-session");
                    encodedString = encodedString.substring(6);
                    var decodedString = atob(encodedString);
                    var addmodid = JSON.parse(decodedString);

                    addmodid["modids"] = this.usermodids;
                    // Encode the String
                    var stringdata = JSON.stringify(addmodid)
                    var encodeddata = btoa(stringdata);
                    encodeddata = "az-vel" + encodeddata;
                    localStorage.setItem("disc-portal-session", (encodeddata));

                    this.makeapi.usercompds = this.usercompds;
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
                    if (this.count != 0) {
                        this.router.navigateByUrl('/dashboard/home');
                    }
                    else {
                        this.count++;
                    }
                },
                    Error => {
                    });
        }
        else if (this.AuthGuard.userroleid == 1 ) {
            var encodedString:any = localStorage.getItem("disc-portal-session");
            encodedString = encodedString.substring(6);
            var decodedString = atob(encodedString);
            var addmodid = JSON.parse(decodedString);

            addmodid["modids"] = this.usermodids;

            // Encode the String
            var stringdata = JSON.stringify(addmodid)
            var encodeddata = btoa(stringdata);
            encodeddata = "az-vel" + encodeddata;
            localStorage.setItem("disc-portal-session", (encodeddata));
        }
    }
    feedback() {
        $("#feedback").modal("show");
    }
    confirmsubmitfeedback() {
        if (this.feedbackForm.valid == false) {
            this.getdata.showNotification('bottom', 'right', " Feedback is required", "danger");
        }
        else {
            let idvalue;
            if (this.AuthGuard.session().roleid != 4) {
                idvalue = this.AuthGuard.session().shortid
            }
            else {
                idvalue = this.AuthGuard.session().vendorcode
            }

            let reqdata = "username=" + this.AuthGuard.session().name + "&idvalue=" + idvalue + "&feedback=" + this.feedbackForm.value.feedback;

            this.makeapi.post(this.sendFeedbackapi, reqdata, "post")
                .subscribe(data => {
                    this.getdata.showNotification('bottom', 'right', " Thank you for your feedback..!", "success");
                    $("#feedback").modal("hide");
                });

        }
    }
    changepassword() {
        $("#changepassword").modal("show");
    }
    confirmchangepassword() {
        if (this.feedbackForm.valid == false) {
            if (this.AuthGuard.userroleid == 4) {
                this.getdata.showNotification('bottom', 'right', "Email-id is invalid", "danger");
            }
            else {
                this.getdata.showNotification('bottom', 'right', " Shortid is invalid", "danger");
            }
        }
        else {
            this.getdata.showNotification('bottom', 'right', " New password successfully send to your mail-id..!", "success");
            $("#changepassword").modal("hide");
        }
    }

    genIBMSToken() {
        // if (this.AuthGuard.session().roleid != 4) {
            var reqdata = {"userid" : this.AuthGuard.session().id, "roleid" : this.AuthGuard.session().roleid}
            return this.makeapi.postjson(this.generateIBMSTokenapi, reqdata, "postjson")
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
                });
        // }
    }
    payretro(){
        let reqdata
        if(this.AuthGuard.session().roleid != 4){
            reqdata = "roleid=" + this.AuthGuard.session().roleid + "&shortid=" + this.AuthGuard.session().shortid
        }else{
            reqdata = "roleid=" + this.AuthGuard.session().roleid + "&code=" + this.AuthGuard.session().code + "&emailid=" + this.AuthGuard.session().emailid
        }
        return this.makeapi.login_post(this.generatePayRetroToken + reqdata , '', "token_renew")
            .subscribe(response => {
                    
                    localStorage.removeItem('disc-portal-session');
                    localStorage.removeItem('Daim-packagingSession');
                    this.deleteCookie('packcookies');
                    this.deleteCookie('cookies');
                    let get_token = response.headers.get('access-control-bharatbenz-token')
                    window.location.href = "https://www.digitalsupplychain.bharatbenz.com/PayRetro/discauth?token=" + get_token
              
            },
                Error => {
                     // localStorage.removeItem('disc-portal-session');
                    // localStorage.removeItem('Daim-packagingSession');
                    // this.deleteCookie('packcookies');
                    // this.deleteCookie('cookies');
                });
    // }
    }
    toolcappro(){
        let reqdata
        if(this.AuthGuard.session().roleid != 4){
            reqdata = "roleid=" + this.AuthGuard.session().roleid + "&shortid=" + this.AuthGuard.session().shortid
        }else{
            reqdata = "roleid=" + this.AuthGuard.session().roleid + "&code=" + this.AuthGuard.session().code + "&emailid=" + this.AuthGuard.session().emailid
        }
        this.makeapi.login_post(this.generateToolCapProToken + reqdata , '', "token_renew")
            .subscribe(response => {
                    
                    localStorage.removeItem('disc-portal-session');
                    localStorage.removeItem('Daim-packagingSession');
                    this.deleteCookie('packcookies');
                    this.deleteCookie('cookies');
                    let get_token = response.headers.get('access-control-bharatbenz-token')
                    window.location.href = "https://www.digitalsupplychain.bharatbenz.com/ToolCapPro/discauth?token=" + get_token
              
            },
                Error => {
                     // localStorage.removeItem('disc-portal-session');
                    // localStorage.removeItem('Daim-packagingSession');
                    // this.deleteCookie('packcookies');
                    // this.deleteCookie('cookies');
                });
    // }
    }
    logout() {
        localStorage.removeItem("setTime")
        clearInterval(this.interval);
        this.deleteCookie('disc-cookies');
        localStorage.removeItem('disc-portal-session');
        localStorage.removeItem('Daim-packagingSession');
        this.router.navigateByUrl('/login');
    }

    deleteCookie(cname:any) {
        var d = new Date();
        d.setTime(d.getTime() - (3 * 3600000000));
        var expires = "expires=" + d.toUTCString();
        window.document.cookie = cname + "=" + "; " + expires;

    }
    private getPPInfoapi = this.getdata.Coreappconstant + 'getPPInfo/';
    Roledatas:any
    gotoPackaging() {
      var url;
      if (this.AuthGuard.session().roleid == 4) {
        url = this.getPPInfoapi + this.AuthGuard.session().id + '/1'
      }
      else {
        url = this.getPPInfoapi + this.AuthGuard.session().id + '/0'
      }
      return this.makeapi.get(url, "", "getnoload")
        .subscribe(data => {
            this.Roledatas=data
          console.log(data)
          var str = data.status;
          var status = str.toLowerCase();
          if (status == 'success') {
  
  
            // Encode the String
            var stringdata = JSON.stringify(data)
            // var encodeddata = btoa(stringdata);
            localStorage.setItem("Daim-packagingSession", (stringdata));
          
  
          }

        //   this.router.navigateByUrl('/dashboard/quality');
        //   routerLink="quality"
        this.redirecttopageRole()
        },
          Error => {
          });
    }
    redirecttopageRole(){
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
}

