import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import 'rxjs/Rx';
import { Router } from '@angular/router';
declare var $:any;

@Injectable()
export class WebserviceService {
    token: any;
    userid: any;
    shortid:any;
    userroleid: any;
    usershortid: any;
    userteamname: any;
    supplierid:any;
    useremail: any;
    userbuids: any;
    usermodids = [];
    usercompds = [];
    filename:any
    isrgpadmin:any
    teamname:any
    pdf_generator:any
    restrictuserid ={'shortid':'arulnav'};
    constructor(private http: HttpClient, private router: Router) {
        this.token = this.getCookie('disc-cookies');
        if (this.getCheckToken() == null || this.getCheckToken() == "") {
            localStorage.removeItem('disc-portal-session');
            localStorage.removeItem('Daim-packagingSession');
        }
        else if (this.session() == null) {
            this.router.navigateByUrl('/login');
        }
        else {
            this.getuserinfo();
            this.token = this.getCookie('disc-cookies');
        }
    }
    getCheckToken() {
        return this.getCookie('disc-cookies');
    }
    getuserinfo() {
        this.username = this.session().name;
        this.userid = this.session().id;
        this.userroleid = this.session().roleid;
        this.usershortid = this.session().shortid;
        this.userteamname = this.session().teamname;
        this.useremail = this.session().emailid;
        this.isrgpadmin = this.session().isrgpadmin
        this.supplierid = this.session().supplierid
        this.teamname = this.session().teamname
        console.log(this.session());
        if(this.session().buids != null){
            this.userbuids = this.session().buids.split(",");
        }
        
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
    getToken() {
        this.token = this.getCookie('disc-cookies');
        if(this.token == null){
            this.router.navigateByUrl('/login');
        }
    }

    coursename: any;
    downfileName:any
    proName:any
    partNum:any
    username = 'UserName';
    vendorcode: any;
    year: any;
    month: any;
    deleteCookie(cname:any) {
        var d = new Date();
        d.setTime(d.getTime() - (1000 * 60 * 60 * 24));
        var expires = "expires=" + d.toUTCString();
        window.document.cookie = cname + "=" + "; " + expires;

    }
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
}
