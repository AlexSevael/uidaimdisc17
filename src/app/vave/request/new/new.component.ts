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

declare var $;

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  vaveForm: FormGroup
  costForm: FormGroup
  approve_rejectForm: FormGroup
  emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){2,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numbervalidation = /^[0-9]\d*(\.\d+)?$/;

  private SaveVaveAPI = this.getdata.appconstantVAVE + 'save'
  private SaveCostAPI = this.getdata.appconstantVAVE + 'addPrice'
  private uploadPPTAPI = this.getdata.appconstantVAVE + 'uploadPPT'
  private uploadFileAPI = this.getdata.appconstantVAVE + 'uploadFile'
  private deleteFileAPI = this.getdata.appconstantVAVE + 'deleteFile'
  private deletePPTAPI = this.getdata.appconstantVAVE + 'deletePPT'
  private fileListAPI = this.getdata.appconstantVAVE + 'fileList'
  private downloadFileAPI = this.getdata.appconstantVAVE + 'downloadFile'
  private downloadPPTAPI = this.getdata.appconstantVAVE + 'downloadPPT'
  private statusHistoryAPI = this.getdata.appconstantVAVE + 'statusHistory'
  private getAPI = this.getdata.appconstantVAVE + 'get/'
  private statusTrackingAPI = this.getdata.appconstantVAVE + 'statusTracking';
  private updateStatusAPI = this.getdata.appconstantVAVE + 'updateStatus';
  private updateStatusRejectTabAPI = this.getdata.appconstantVAVE + 'updateStatusRejectTab';
  private listOfRdUserapi = this.getdata.appconstant + 'listOfRdUser';
  private listOfRdL4Userapi = this.getdata.appconstant + 'listOfRdL4User';
  private searchDICVUserapi = this.getdata.appconstant + 'searchDICVUser';
  private searchDICVUserForVevaAPI = this.getdata.appconstant + 'searchDICVUserForVeva';
  private listTeamForVevaAPI = this.getdata.appconstant + 'listTeamForVeva';
  constructor(private fb: FormBuilder, public AuthGuard: AuthGuard, private route: ActivatedRoute, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService,
    public getdata: DatatransferService) {
    this.vaveForm = this.fb.group({
      "id": [0],
      "supplierid": [null],
      "requesterid": [null],
      "partno": [null, Validators.compose([Validators.required])],
      "partdesc": [null, Validators.compose([Validators.required])],
      "childpartno": [null],
      "childpartdesc": [null],
      "appmodel": [null, Validators.compose([Validators.required])],
      "buyerid": [null, Validators.compose([Validators.required])],
      "buyername": [null, Validators.compose([Validators.required])],
      'suppname': [null],
      'vevaformid': [null],
      'suppcode': [null],
      "islocalize": [null],
      "isprocessopt": [null],
      "isnewdesign": [null],
      "isrmration": [null],
      "ispartstd": [null],
      "ispackopt": [null],
      "istranscostopt": [null],
      "isothers": [null],
      "others": [null],
      "currstatus": [0],
      "createddate": [null],
      "createddateval": [0],
      "isactive": [1],
    })
    this.costForm = this.fb.group({
      // 'costArray' : this.fb.array([]),
      "id": [0],
      "vevamodelid": [null],
      "currpartprice": [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)])],
      "costreduct": [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)])],
      "revisedpartprice": [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)])],
      "usageqtyperveh": [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)])],
      "vehsavings": [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)])],
      "devcost": [null],
      "testcost": [null],
      "toolcost": [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)])],
      'isdevinvolved': [null, Validators.compose([Validators.required])],
    })
    this.approve_rejectForm = this.fb.group({
      'id': 0,
      "remark": [null, Validators.compose([Validators.required])],
      'currstatus': 0,
      't1name': null,
      // 't1id': null,
      't1username': null,
      't1userid': null,
      't1l4name': null,
      't1l4id': null,
      't2name': null,
      // 't2id': null,
      't2username': null,
      't2userid': null,
      't2l4name': null,
      't2l4id': null,
      'ismultilevelteam': null,
      'cometid': null
    })
  }
  show_submit_btn = false
  supplierid = 0
  usertype
  tab_type
  ngOnInit() {
   this.tab_type = localStorage.getItem('vave_tabs')
   console.log(this.tab_type)
    this.show_editable = true
    if (this.AuthGuard.session().roleid == 4) {
      let getdata = this.vaveForm.value
      getdata.suppcode = this.AuthGuard.session().code
      getdata.suppname = this.AuthGuard.session().vendorName
      this.vaveForm.patchValue(getdata)
      this.supplierid = this.AuthGuard.session().supplierid
    } else {
      this.supplierid = 0
    }
    let usertype = localStorage.getItem('vevaUserType')
    this.usertype = Number(usertype)
    this.show_submit_btn = true
    if (this.AuthGuard.session().roleid == 1 || this.AuthGuard.session().vevaAdmin == 1) {
      this.vaveForm.disable();
      this.show_submit_btn = false
    }
    this.route.queryParams.subscribe(params => {
      const decodedString = decodeURIComponent(params['id']);
      if (decodedString != 'undefined') {
        this.get_(decodedString)
        this.getfileList(decodedString)
        this.show_submit_btn = false
      }
    });
  }
  status_history_list = []
  status_history(id) {
    let reqdata = 'vevamodelid=' + id + '&roleid=' + this.AuthGuard.session().roleid
    return this.makeapi.method(this.statusHistoryAPI, reqdata, 'post')
      .subscribe(data => {
        this.status_history_list = data
      })
  }
  show_history() {
    $("#show_history").modal("show")
  }
  // Inspection Index
  get aoiInspections(): FormArray {
    return this.costForm.get('costArray') as FormArray;
  }
  costFetchData(data): void {
    const newRow = this.fb.group({
      id: [data.id],
      name: [data.name],
      apqpaoiid: [data.apqpaoiid],
      isapplicability: [data.isapplicability],
      sampleqty: [data.sampleqty],
      frequency: [data.frequency],
      remarks: [data.remarks],
      seq: [data.seq]
    });
    this.aoiInspections.push(newRow);
  }
  first_copy = []
  getAll_datas
  isPptUploaded = 0
  show_editable = false
  pptfilename = ''
  get_(id) {
    this.makeapi.method(this.getAPI + id, '', 'get')
      .subscribe(data => {
        this.isPptUploaded = data.isPptUploaded
        this.pptfilename = data.pptfilename
        // this.ppt_upload_filename = data.pptfilename
        this.getAll_datas = data
        this.first_copy = data.vevaCostModels
        data.islocalize = data.islocalize == 1 ? true : false
        this.idea_classification(data.islocalize, 0)
        data.isprocessopt = data.isprocessopt == 1 ? true : false
        this.idea_classification(data.isprocessopt, 1)
        data.isnewdesign = data.isnewdesign == 1 ? true : false
        this.idea_classification(data.isnewdesign, 2)
        data.isrmration = data.isrmration == 1 ? true : false
        this.idea_classification(data.isrmration, 3)
        data.ispartstd = data.ispartstd == 1 ? true : false
        this.idea_classification(data.ispartstd, 4)
        data.ispackopt = data.ispackopt == 1 ? true : false
        this.idea_classification(data.ispackopt, 5)
        data.istranscostopt = data.istranscostopt == 1 ? true : false
        this.idea_classification(data.istranscostopt, 6)
        data.isothers = data.isothers == 1 ? true : false
        this.idea_classification(data.isothers, 7)
        this.vaveForm.patchValue(data)
        this.costForm.patchValue(data.vevaCostModels[data.vevaCostModels.length - 1])
        let getdata = this.costForm.value

        if(data.vevaApprovalTeamModel != null){
          data.vevaApprovalTeamModel.cometid = data.cometid
          data.vevaApprovalTeamModel.ismultilevelteam = data.ismultilevelteam
          if(data.ismultilevelteam == 1){
          setTimeout(()=>{
            $("#ismultilevelteam").prop("checked", true)
          },500)
        }
          this.ismultilevelteam = data.ismultilevelteam
          this.approve_rejectForm.patchValue(data.vevaApprovalTeamModel)
          console.log(this.approve_rejectForm)
          }
       


        if ((this.usertype == 1) && (data.currstatus == 0 || data.currstatus == 5 || data.currstatus == -102 || data.currstatus == -104 || data.currstatus == -2 || data.currstatus == -3 || data.currstatus == -4 || data.currstatus == -5)) {
          if (data.currstatus != 5) {
            this.teamList()
            this.show_editable = true
            this.vaveForm.enable();
            this.costForm.enable();
            this.vaveForm.controls.buyername.disable()
            this.vaveForm.controls.suppcode.disable()
            this.vaveForm.controls.suppname.disable()
          } else {
            this.show_editable = false
            this.vaveForm.disable();
            this.costForm.enable();
            getdata.id = 0
            this.costForm.patchValue(getdata)
          }
        } else {
          this.show_editable = false
          this.costForm.disable()
          this.vaveForm.disable();
        }
        if ((this.usertype == 1 && data.currstatus == 5)) {
          this.approve_rejectForm.controls.cometid.enable()
        } else {
          this.approve_rejectForm.controls.cometid.disable()
        }
        this.status_tracking(data.id)
        if ((this.usertype == 1) && (data.currstatus == 0 || data.currstatus == -2 || data.currstatus == -3 || data.currstatus == -4 || data.currstatus == -5 || data.currstatus == -102 || data.currstatus == -104)) {
          this.teamList()
        }
        if (this.usertype == 1 && data.currstatus == 5) {
          this.show_submit_btn = true
        }
        this.status_history(id)
        if ((this.AuthGuard.session().roleid == 4) && (data.currstatus == -1 || data.currstatus == 103)) {
          let getdata = this.vaveForm.value
          this.vaveForm.enable()
          this.costForm.enable()
          if (data.currstatus == -1) {
            getdata.currstatus = 0
            this.vaveForm.controls.buyername.disable()
          } else {
            if (getdata.buyerid == 0) {
              getdata.buyerid = null
            }
            getdata.currstatus = 103
            this.vaveForm.controls.buyername.enable()
          }
          this.vaveForm.patchValue(getdata)
          this.vaveForm.controls.suppcode.disable()
          this.vaveForm.controls.suppname.disable()
          this.show_editable = true
          this.show_submit_btn = true
        }
      },
        Error => { })
  }
  cost_cal() {
    let getdata = this.costForm.value
    getdata.revisedpartprice = (getdata.currpartprice - getdata.costreduct).toFixed(2)
    getdata.vehsavings = (getdata.costreduct * getdata.usageqtyperveh).toFixed(2)
    this.costForm.patchValue(getdata)
  }
  StatusTracker = []
  statuslength
  status_tracking(id) {
    this.makeapi.method(this.statusTrackingAPI, 'id=' + id, 'post')
      .subscribe(data => {
        this.StatusTracker = data
        this.statuslength = data.length
      },
        Error => { })
  }
  others = false
  idea_classification(checked, index) {
    $("#applicable" + index).prop('checked', checked)
    if (!checked) {
      $(`#change_img` + index).addClass('add_int')
      $(`#change_img` + index).removeClass('change_img_')
    } else {
      $(`#change_img` + index).addClass('change_img_')
      $(`#change_img` + index).removeClass('add_int')
    }
    let getdata = this.vaveForm.value
    let control = this.vaveForm.get('others')
    if (index == 7) {
      if (checked) {
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      } else {
        getdata.others = null
        control.clearValidators();
        control.updateValueAndValidity();
      }
    }
    this.vaveForm.patchValue(getdata)
  }
  back() {
    this.router.navigateByUrl('dashboard/vave/request/list')
  }
  // todalbuyer = []
  // buyershortidlist = []
  // buyerList() {
  //   return this.makeapi.method(this.listOfRdUserapi, '', "post")
  //     .subscribe(data => {
  //       this.todalbuyer = data
  //       for (var i = 0; i < data.length; i++) {
  //         this.buyershortidlist[i] = data[i].shortid + '(' + data[i].name + ')';
  //       }
  //       this.buyerL4List()
  //     },
  //       Error => {
  //       });
  // }
  // todalbuyerL4 = []
  // buyerL4shortidlist = []
  // buyerL4List() {
  //   return this.makeapi.method(this.listOfRdL4Userapi, '', "post")
  //     .subscribe(data => {
  //       this.todalbuyerL4 = data
  //       for (var i = 0; i < data.length; i++) {
  //         this.buyerL4shortidlist[i] = data[i].shortid + '(' + data[i].name + ')';
  //       }
  //     },
  //       Error => {
  //       });
  // }
  ismultilevelteam = 0
  need_team2(is_checked: Boolean) {
    this.ismultilevelteam = is_checked == true ? 1 : 0
    let getdata = this.approve_rejectForm.value
    getdata.ismultilevelteam = this.ismultilevelteam
    this.approve_rejectForm.patchValue(getdata)
    if (!is_checked) {
      let control1 = this.approve_rejectForm.get('t2username');
      let control2 = this.approve_rejectForm.get('t2l4name');
      let control3 = this.approve_rejectForm.get('t2userid');
      let control4 = this.approve_rejectForm.get('t2l4id');
      let control5 = this.approve_rejectForm.get('t2name');
      // let control6 = this.approve_rejectForm.get('t2id');
      control1.clearValidators();
      control1.updateValueAndValidity();

      control2.clearValidators();
      control2.updateValueAndValidity();

      control3.clearValidators();
      control3.updateValueAndValidity();

      control4.clearValidators();
      control4.updateValueAndValidity();

      control5.clearValidators();
      control5.updateValueAndValidity();

      // control6.clearValidators();
      // control6.updateValueAndValidity();
    }
  }
  team_list: any = []
  duplicate_team_list: any = []
  teamList() {
    return this.makeapi.method(this.listTeamForVevaAPI, '', 'get')
      .subscribe(data => {
        this.team_list = data
        this.duplicate_team_list = data
      },
        Error => {

        })
  }
  change_team_name(value: any, type: number) { // not use this method now
    if (type == 1) {
      let check_team = this.team_list.filter(val => val.name == value)
      if (check_team.length > 0) {
        var getform = this.approve_rejectForm.value;
        getform.t1id = check_team[0].id;
        this.team1_id = getform.t1id
        this.approve_rejectForm.patchValue(getform);
        this.team_list = this.team_list.filter(val => val.id != check_team[0].id)
      }
      else {
        var getform = this.approve_rejectForm.value;
        getform.t1id = null;
        
        this.approve_rejectForm.patchValue(getform);
        if(getform.t2id == null){
          this.team_list = []
          this.team_list = this.duplicate_team_list
        }else{
          this.team_list = this.duplicate_team_list.filter(val => val.id != this.team2_id)
        }
        this.team1_id = 0
      }
    } else {
      let check_team = this.team_list.filter(val => val.name == value)
      if (check_team.length > 0) {
        var getform = this.approve_rejectForm.value;
        getform.t2id = check_team[0].id;
        this.team2_id = getform.t2id
        this.approve_rejectForm.patchValue(getform);
        this.team_list = this.team_list.filter(val => val.id != check_team[0].id)
      }
      else {
        var getform = this.approve_rejectForm.value;
        this.team2_id = 0
        getform.t2id = null;
        this.approve_rejectForm.patchValue(getform);
        if(getform.t1id == null){
          this.team_list = []
          this.team_list = this.duplicate_team_list
        }else{
          this.team_list = this.duplicate_team_list.filter(val => val.id != this.team1_id)
        }
      }
    }
  }
  t1user_list: any = []
  todalt1_user_list: any = []
  t1l4_list: any = []
  todalt1l4_list: any = []
  team1_id = 0
  assign_team1(value, type) {
    if (type == 1) {
      if (this.t1user_list.indexOf(value) != -1) {
        var getform = this.approve_rejectForm.value;
        getform.t1userid = this.todalt1_user_list[this.t1user_list.indexOf(value)].id;
        this.approve_rejectForm.patchValue(getform);
      }
      else {
        var getform = this.approve_rejectForm.value;
        getform.t1userid = null;
        this.approve_rejectForm.patchValue(getform);
      }
      this.t1user_list = [];
      let reqdata = "searchstr=" + value + "&designationid=5" + '&isbuyer=0'
      return this.makeapi.method(this.searchDICVUserForVevaAPI, reqdata, "post")
        .subscribe(data => {
          this.todalt1_user_list = data
          for (var i = 0; i < data.length; i++) {
            this.t1user_list[i] = data[i].shortid + ' ' + '(' + data[i].email + ')';
          }
        },
          Error => {
          });
    } else {
      if (this.t1l4_list.indexOf(value) != -1) {
        var getform = this.approve_rejectForm.value;
        getform.t1l4id = this.todalt1l4_list[this.t1l4_list.indexOf(value)].id;
        this.approve_rejectForm.patchValue(getform);
      }
      else {
        var getform = this.approve_rejectForm.value;
        getform.t1l4id = null;
        this.approve_rejectForm.patchValue(getform);
      }
      this.t1l4_list = [];
      let reqdata = "searchstr=" + value + "&designationid=4" + '&isbuyer=0'
      return this.makeapi.method(this.searchDICVUserForVevaAPI, reqdata, "post")
        .subscribe(data => {
          this.todalt1l4_list = data
          for (var i = 0; i < data.length; i++) {
            this.t1l4_list[i] = data[i].shortid + ' ' + '(' + data[i].email + ')';
          }
        },
          Error => {
          });
    }
  }
  t2user_list: any = []
  todalt2user_listt: any = []
  t2l4_list: any = []
  todalt2l4_list: any = []
  team2_id = 0
  assign_team2(value, type) {
    if (type == 1) {
      if (this.t2user_list.indexOf(value) != -1) {
        var getform = this.approve_rejectForm.value;
        getform.t2userid = this.todalt2user_listt[this.t2user_list.indexOf(value)].id;
        this.approve_rejectForm.patchValue(getform);
      }
      else {
        var getform = this.approve_rejectForm.value;
        getform.t2userid = null;
        this.approve_rejectForm.patchValue(getform);
      }
      this.t2user_list = [];
      let reqdata = "searchstr=" + value + "&designationid=5" + '&isbuyer=0'
      return this.makeapi.method(this.searchDICVUserForVevaAPI, reqdata, "post")
        .subscribe(data => {
          this.todalt2user_listt = data
          for (var i = 0; i < data.length; i++) {
            this.t2user_list[i] = data[i].shortid + ' ' + '(' + data[i].email + ')';
          }
        },
          Error => {
          });
    } else {
      if (this.t2l4_list.indexOf(value) != -1) {
        var getform = this.approve_rejectForm.value;
        getform.t2l4id = this.todalt2l4_list[this.t2l4_list.indexOf(value)].id;
        this.approve_rejectForm.patchValue(getform);
      }
      else {
        var getform = this.approve_rejectForm.value;
        getform.t2l4id = null;
        this.approve_rejectForm.patchValue(getform);
      }
      this.t2l4_list = [];
      let reqdata = "searchstr=" + value + "&designationid=4" + '&isbuyer=0'
      return this.makeapi.method(this.searchDICVUserForVevaAPI, reqdata, "post")
        .subscribe(data => {
          this.todalt2l4_list = data
          for (var i = 0; i < data.length; i++) {
            this.t2l4_list[i] = data[i].shortid + ' ' + '(' + data[i].email + ')';
          }
        },
          Error => {
          });
    }
  }
  todalsmdata = []
  smshortidlist = [];
  buyeruser(value) {
    if (this.smshortidlist.indexOf(value) != -1) {
      var getform = this.vaveForm.value;
      getform.buyerid = this.todalsmdata[this.smshortidlist.indexOf(value)].id;
      this.vaveForm.patchValue(getform);
    }
    else {
      var getform = this.vaveForm.value;
      getform.buyerid = null;
      this.vaveForm.patchValue(getform);
    }
    this.smshortidlist = [];
    let reqdata = "searchstr=" + value + "&designationid=5" + '&isbuyer=1'
      return this.makeapi.method(this.searchDICVUserForVevaAPI, reqdata, "post")
      .subscribe(data => {
        this.todalsmdata = data
        for (var i = 0; i < data.length; i++) {
          this.smshortidlist[i] = data[i].name + ' ' + '(' + data[i].email + ')';
        }
      },
        Error => {
        });
  }
  submit() {
    let control1 = this.approve_rejectForm.get('cometid');
    let control2 = this.approve_rejectForm.get('remark');
    if(this.usertype == 1 && this.getAll_datas.currstatus == 5){
        control1.setValidators([Validators.required, Validators.minLength(6), Validators.pattern(this.numbervalidation)],);
        control1.updateValueAndValidity();

        control2.clearValidators();
        control2.updateValueAndValidity();
    }else{
      control1.clearValidators();
      control1.updateValueAndValidity();
    }
    if (this.usertype == 0 || this.usertype == 1) {
      if (this.vaveForm.invalid || this.costForm.invalid) {
        if (this.vaveForm.controls.buyerid.invalid || this.vaveForm.value.buyername == null) {
          this.getdata.showNotification('bottom', 'right', "Enter the valid Buyer ID", "danger");
        } else if (this.costForm.controls.isdevinvolved.invalid) {
          this.getdata.showNotification('bottom', 'right', "Development Involved is Invalid", "danger");
        }
        this.getdata.markFormGroupTouched(this.vaveForm)
        this.getdata.markFormGroupTouched(this.costForm)
      } else if ((this.pptfilename == '') && (this.AuthGuard.session().roleid == 4)) {
        this.getdata.showNotification('bottom', 'right', "File upload is required", "danger");
      }else if(this.approve_rejectForm.invalid && this.AuthGuard.session().roleid != 4){
        this.getdata.markFormGroupTouched(this.approve_rejectForm)
        this.getdata.showNotification('bottom', 'right', "Comet ID is required", "danger");
      }
      else {
        $("#submit_data").modal("show")
      }
    } else {
      if (this.costForm.invalid) {
        this.getdata.markFormGroupTouched(this.costForm)
      } else {
        $("#submit_data").modal("show")
      }
    }
  }
  confirm_submit() {
    let reqdata = this.vaveForm.value
    reqdata.supplierid = this.supplierid
    reqdata.islocalize = reqdata.islocalize == true ? 1 : 0
    reqdata.isprocessopt = reqdata.isprocessopt == true ? 1 : 0
    reqdata.isnewdesign = reqdata.isnewdesign == true ? 1 : 0
    reqdata.isrmration = reqdata.isrmration == true ? 1 : 0
    reqdata.ispartstd = reqdata.ispartstd == true ? 1 : 0
    reqdata.ispackopt = reqdata.ispackopt == true ? 1 : 0
    reqdata.istranscostopt = reqdata.istranscostopt == true ? 1 : 0
    reqdata.isothers = reqdata.isothers == true ? 1 : 0
    if (reqdata.others == 0) {
      reqdata.others == null
    }
    reqdata.requesterid = this.AuthGuard.session().id
    this.makeapi.method(this.SaveVaveAPI, reqdata, 'postjson')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.costSave(data.id)
        } else {
          this.getdata.showNotification('bottom', 'right', "Something went wrong, Please try again later", "danger");
        }
      },
        Error => {

        })

  }
  toggle(event, true_false) {
    let control1 = this.costForm.get('devcost');
    let control2 = this.costForm.get('testcost');
    if (true_false) {
      control1.setValidators(Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]));
      control1.updateValueAndValidity();
      control2.setValidators(Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]));
      control2.updateValueAndValidity();
    } else {
      control1.clearValidators();
      control1.updateValueAndValidity();
      control2.clearValidators();
      control2.updateValueAndValidity();
    }
  }
  costSave(id) {
    let reqdata = this.costForm.value
    reqdata.vevamodelid = id
    if (reqdata.isdevinvolved == 'false') {
      reqdata.devcost = null
      reqdata.testcost = null
    }
    this.makeapi.method(this.SaveCostAPI, reqdata, 'postjson')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.vevamodelid = data.id
          let upload_true = this.upload_filename.filter(val => val.id == 0)
          if (this.usertype == 0) {
            if (this.ppt_upload_filename == '' && upload_true.length == 0) {
              $("#submit_data").modal("hide")
              this.getdata.showNotification('bottom', 'right', "VAVE Request Submitted Successfully", "success");
              this.back()
            } else {
              if (this.ppt_upload_filename != '') {
                this.ppt_file_upload()
              }
              if (upload_true.length > 0) {
                this.upload_files(50)
              }
            }
          } else {
            if (this.ppt_upload_filename == '' && upload_true.length == 0) {
              $("#submit_data").modal("hide")
              this.approve_reject_ = 1
              this.updateStatus()
            } else {
              if (this.ppt_upload_filename != '') {
                this.ppt_file_upload()
              }

              if (upload_true.length > 0) {
                this.upload_files(50)
              }

            }
          }
        } else {
          this.getdata.showNotification('bottom', 'right', "Something went wrong, Please try again later", "danger");
        }
      },
        Error => {

        })
  }
  validate_buyer_submit() {
    this.approve_reject_ = 1
    let control1 = this.approve_rejectForm.get('t1username');
    let control2 = this.approve_rejectForm.get('t1l4name');
    let control3 = this.approve_rejectForm.get('t1userid');
    let control4 = this.approve_rejectForm.get('t1l4id');
    let control5 = this.approve_rejectForm.get('t1name');
    // let control6 = this.approve_rejectForm.get('t1id');

    let control11 = this.approve_rejectForm.get('t2username');
    let control22 = this.approve_rejectForm.get('t2l4name');
    let control33 = this.approve_rejectForm.get('t2userid');
    let control44 = this.approve_rejectForm.get('t2l4id');
    let control55 = this.approve_rejectForm.get('t2name');
    // let control66 = this.approve_rejectForm.get('t2id');

    if (this.ismultilevelteam == 1) {
      control11.setValidators([Validators.required]);
      control11.updateValueAndValidity();

      control22.setValidators([Validators.required]);
      control22.updateValueAndValidity();

      control33.setValidators([Validators.required]);
      control33.updateValueAndValidity();

      control44.setValidators([Validators.required]);
      control44.updateValueAndValidity();

      control55.setValidators([Validators.required]);
      control55.updateValueAndValidity();

      // control66.setValidators([Validators.required]);
      // control66.updateValueAndValidity();
    }else{
      control11.clearValidators();
      control11.updateValueAndValidity();

      control22.clearValidators();
      control22.updateValueAndValidity();

      control33.clearValidators();
      control33.updateValueAndValidity();

      control44.clearValidators();
      control44.updateValueAndValidity();

      control55.clearValidators();
      control55.updateValueAndValidity();

      // control66.clearValidators();
      // control66.updateValueAndValidity();
    }
    control1.setValidators([Validators.required]);
    control1.updateValueAndValidity();

    control2.setValidators([Validators.required]);
    control2.updateValueAndValidity();

    control3.setValidators([Validators.required]);
    control3.updateValueAndValidity();

    control4.setValidators([Validators.required]);
    control4.updateValueAndValidity();

    control5.setValidators([Validators.required]);
    control5.updateValueAndValidity();

    // control6.setValidators([Validators.required]);
    // control6.updateValueAndValidity();
    if (this.vaveForm.invalid || this.costForm.invalid) {
      this.getdata.markFormGroupTouched(this.vaveForm)
      this.getdata.markFormGroupTouched(this.costForm)
    } else if (this.approve_rejectForm.invalid) {
      this.getdata.markFormGroupTouched(this.approve_rejectForm)
    } else if ((this.ppt_upload_filename == '' && this.pptfilename == '')) {
      this.getdata.showNotification('bottom', 'right', "File upload is required", "danger");
    } else {
      $("#sm_approve_reject").modal("show")
    }
  }
  validate_digits() {
    const inputControl = this.approve_rejectForm.get('cometid');
    let inputValue: string = inputControl.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // Update the form control value
    inputControl.setValue(inputValue, { emitEvent: false });
  }
  approve_reject_ = 0
  approve_reject(type) {
    let getdata = this.approve_rejectForm.value
    let control1 = this.approve_rejectForm.get('t1username');
    let control2 = this.approve_rejectForm.get('t1l4name');
    let control3 = this.approve_rejectForm.get('t1userid');
    let control4 = this.approve_rejectForm.get('t1l4id');
    let control5 = this.approve_rejectForm.get('t1name');
    // let control6 = this.approve_rejectForm.get('t1id');

    let control11 = this.approve_rejectForm.get('t2username');
    let control22 = this.approve_rejectForm.get('t2l4name');
    let control33 = this.approve_rejectForm.get('t2userid');
    let control44 = this.approve_rejectForm.get('t2l4id');
    let control55 = this.approve_rejectForm.get('t2name');
    // let control66 = this.approve_rejectForm.get('t2id');
    if (type != -102 && type != -104) {
      if (this.usertype == 1 && type == 1) {
        control1.setValidators([Validators.required]);
        control1.updateValueAndValidity();

        control2.setValidators([Validators.required]);
        control2.updateValueAndValidity();

        control3.setValidators([Validators.required]);
        control3.updateValueAndValidity();

        control4.setValidators([Validators.required]);
        control4.updateValueAndValidity();

        control5.setValidators([Validators.required]);
        control5.updateValueAndValidity();

        // control6.setValidators([Validators.required]);
        // control6.updateValueAndValidity();
       
      } else {
        control1.clearValidators();
        control1.updateValueAndValidity();

        control2.clearValidators();
        control2.updateValueAndValidity();

        control3.clearValidators();
        control3.updateValueAndValidity();

        control4.clearValidators();
        control4.updateValueAndValidity();

        control5.clearValidators();
        control5.updateValueAndValidity();

        // control6.clearValidators();
        // control6.updateValueAndValidity();
      
        control11.clearValidators();
      control11.updateValueAndValidity();

      control22.clearValidators();
      control22.updateValueAndValidity();

      control33.clearValidators();
      control33.updateValueAndValidity();

      control44.clearValidators();
      control44.updateValueAndValidity();

      control55.clearValidators();
      control55.updateValueAndValidity();

      // control66.clearValidators();
      // control66.updateValueAndValidity();
      }
      if (this.approve_rejectForm.invalid) {
        this.getdata.markFormGroupTouched(this.approve_rejectForm)
      } else {
        $("#approve_reject").modal("show")
      }
    } else if (type == -102 || type == -104) {
      control1.clearValidators();
      control1.updateValueAndValidity();

      control2.clearValidators();
      control2.updateValueAndValidity();

      control3.clearValidators();
      control3.updateValueAndValidity();

      control4.clearValidators();
      control4.updateValueAndValidity();

      control5.clearValidators();
      control5.updateValueAndValidity();

      // control6.clearValidators();
      // control6.updateValueAndValidity();

      control11.clearValidators();
      control11.updateValueAndValidity();

      control22.clearValidators();
      control22.updateValueAndValidity();

      control33.clearValidators();
      control33.updateValueAndValidity();

      control44.clearValidators();
      control44.updateValueAndValidity();

      control55.clearValidators();
      control55.updateValueAndValidity();

      // control66.clearValidators();
      // control66.updateValueAndValidity();
      if (this.approve_rejectForm.invalid) {
        this.getdata.markFormGroupTouched(this.approve_rejectForm)
      } else {
        $("#approve_reject").modal("show")
      }
    }
    this.approve_reject_ = type
  }
  remarks = ''
  rduserid = 0
  cometid = 0
  updateStatus() {
    let getdata = this.approve_rejectForm.value
    let currstatus = 0
    if (this.approve_reject_ == 1) {
      if ((this.usertype == 1) && (this.getAll_datas.currstatus == 0 || this.getAll_datas.currstatus == -2 || this.getAll_datas.currstatus == -3 || this.getAll_datas.currstatus == -5 || this.getAll_datas.currstatus == -7 || this.getAll_datas.currstatus == -4 || this.getAll_datas.currstatus == -102 || this.getAll_datas.currstatus == -104)) {
        if (this.getAll_datas.currstatus == -7) {
          currstatus = 6
        } else {
          if(this.getAll_datas.currstatus == -4 || this.getAll_datas.currstatus == -5 || this.getAll_datas.currstatus == -104){
              currstatus = 3
          }else{
              currstatus = 1
          }
        }
      }
      if (this.usertype == 3 && this.getAll_datas.currstatus == 1) {
        getdata.cometid = null
        currstatus = 2
      }else if (this.usertype == 3 && this.getAll_datas.currstatus == 3){
        if(getdata.ismultilevelteam == 1){
        currstatus = 4
        }else{
          currstatus = 5
        }
        getdata.cometid = null
      }
      if (this.usertype == 4 && this.getAll_datas.currstatus == 2) {
        if(getdata.ismultilevelteam == 1){
          currstatus = 3
          }else{
            currstatus = 5
          }
        getdata.cometid = null
      }else if (this.usertype == 4 && this.getAll_datas.currstatus == 4) {
        getdata.cometid = null
        currstatus = 5
      }
      // if (this.usertype == 2 && this.getAll_datas.currstatus == 4) {
      //   getdata.cometid = null
      //   currstatus = 5
      // }
      if (this.usertype == 1 && this.getAll_datas.currstatus == 5) {
        currstatus = 6
      }
      if (this.usertype == 2 && this.getAll_datas.currstatus == 6) {
        currstatus = 7
      }
    }
    else if (this.approve_reject_ == 0) {
      if ((this.usertype == 1) && (this.getAll_datas.currstatus == 0 || this.getAll_datas.currstatus == -2 || this.getAll_datas.currstatus == -3 || this.getAll_datas.currstatus == -4 || this.getAll_datas.currstatus == -5)) {
        currstatus = -1
        getdata.rduserid = 0
        getdata.cometid = null
      }
      if (this.usertype == 3 && this.getAll_datas.currstatus == 1) {
        currstatus = -2
        getdata.cometid = null
      }
      if (this.usertype == 4 && this.getAll_datas.currstatus == 2) {
        currstatus = -3
        getdata.cometid = null
      }
      if (this.usertype == 3 && this.getAll_datas.currstatus == 3) {
        currstatus = -4
        getdata.cometid = null
      }
      if (this.usertype == 4 && this.getAll_datas.currstatus == 4) {
        currstatus = -5
        getdata.cometid = null
      }
      // if (this.usertype == 1 && this.getAll_datas.currstatus == 5) {
      //   currstatus = -6
      //   getdata.cometid = null
      // }
      if (this.usertype == 2 && this.getAll_datas.currstatus == 6) {
        currstatus = -7
        getdata.cometid = null
      }
    }else if(this.approve_reject_ == -102) {
      getdata.cometid = null
      currstatus = -102
    }else{
      getdata.cometid = null
      currstatus = -104
    }
    let remarks = encodeURIComponent(getdata.remark)
    let t1name = encodeURIComponent(getdata.t1name)
    let t2name = encodeURIComponent(getdata.t2name)
    if (remarks == undefined) {
      remarks = null
    }
    if (getdata.cometid == undefined) {
      getdata.cometid = null
    }
    if(this.usertype == 1 && this.getAll_datas.currstatus == -7){
      getdata.cometid = this.getAll_datas.cometid
    }
    if(getdata.ismultilevelteam == 0){
      getdata.t2name = null
      // getdata.t2id = 0
      getdata.t2username = null
      getdata.t2userid = 0
      getdata.t2l4name = null
      getdata.t2l4id = 0
    }
    if(getdata.t2userid == null){
      getdata.t2userid = 0
    }
    if(getdata.t2l4id == null){
      getdata.t2l4id = 0
    }
    let reqdata = 'id=' + this.getAll_datas.id + '&userid=' + this.AuthGuard.session().id +
      '&remarks=' + remarks + '&currstatus=' + currstatus + '&t1name=' + t1name + '&t1username=' + getdata.t1username +
      '&t1userid=' + getdata.t1userid + '&t1l4name=' + getdata.t1l4name + '&t1l4id=' + getdata.t1l4id + '&t2name=' + t2name +
      '&t2username=' + getdata.t2username + '&t2userid=' + getdata.t2userid + '&t2l4name=' + getdata.t2l4name + '&t2l4id=' + getdata.t2l4id + '&ismultilevelteam=' + getdata.ismultilevelteam +
      '&cometid=' + getdata.cometid 
    this.makeapi.method(this.updateStatusAPI, reqdata, 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          $("#sm_approve_reject").modal("hide")
          $("#approve_reject").modal("hide")
          if (currstatus == 0) {
            this.getdata.showNotification('bottom', 'right', "VAVE Request Submitted Successfully", "success");
          } else if (currstatus == 1) {
            this.getdata.showNotification('bottom', 'right', "Buyer Approved Successfully", "success");
          }
          else if (currstatus == 2 || currstatus == 4) {
            this.getdata.showNotification('bottom', 'right', "User Approved Successfully", "success");
          }
          else if (currstatus == 3 || currstatus == 5) {
            this.getdata.showNotification('bottom', 'right', "User L4 Approved Successfully", "success");
          }
          else if (currstatus == 6) {
            $("#submit_data").modal("hide")
            this.getdata.showNotification('bottom', 'right', "Buyer Submitted Successfully", "success");
          }
          else if (currstatus == -1) {
            this.getdata.showNotification('bottom', 'right', "Buyer Rejected Successfully", "success");
          }
          else if (currstatus == -102 || currstatus == -104) {
            this.getdata.showNotification('bottom', 'right', "User Re-Sent Successfully", "success");
          }
          else if (currstatus == -2 || currstatus == -4) {
            this.getdata.showNotification('bottom', 'right', "User Rejected Successfully", "success");
          }
          else if (currstatus == -3 || currstatus == -5) {
            this.getdata.showNotification('bottom', 'right', "User L4 Rejected Successfully", "success");
          }
          else if (currstatus == -7) {
            this.getdata.showNotification('bottom', 'right', "Buyer L4 Rejected Successfully", "success");
          }
          this.back()

        } else {
          this.getdata.showNotification('bottom', 'right', "Something went wrong, Please try again later", "danger");
        }
      },
        Error => { })
  }
  again_approve_reject() {
    let control1 = this.approve_rejectForm.get('rdname');
    let control2 = this.approve_rejectForm.get('rduserid');
    let control3 = this.approve_rejectForm.get('rdl4name');
    let control4 = this.approve_rejectForm.get('rdl4id');
    if (this.usertype == 1 && (this.getAll_datas.currstatus == -2 || this.getAll_datas.currstatus == -102)) {
      control1.setValidators([Validators.required]);
      control1.updateValueAndValidity();

      control2.setValidators([Validators.required]);
      control2.updateValueAndValidity();

      control3.setValidators([Validators.required]);
      control3.updateValueAndValidity();

      control4.setValidators([Validators.required]);
      control4.updateValueAndValidity();
    } else if (this.usertype == 1 && this.getAll_datas.currstatus == -3) {
      control1.clearValidators();
      control1.updateValueAndValidity();

      control2.clearValidators();
      control2.updateValueAndValidity();

      control3.setValidators([Validators.required]);
      control3.updateValueAndValidity();

      control4.setValidators([Validators.required]);
      control4.updateValueAndValidity();
    }
    if (this.vaveForm.invalid || this.costForm.invalid) {
      this.getdata.markFormGroupTouched(this.vaveForm)
      this.getdata.markFormGroupTouched(this.costForm)
    } else if (this.approve_rejectForm.invalid) {
      this.getdata.markFormGroupTouched(this.approve_rejectForm)
    } else {
      $("#rejected_tab").modal('show')
    }
  }
  rejected_updateStatus() {
    let getdata = this.approve_rejectForm.value
    let remarks = encodeURIComponent(getdata.remark)
    let reqdata = 'id=' + this.getAll_datas.id + '&userid=' + this.AuthGuard.session().id +
      '&remarks=' + remarks + '&currstatus=' + getdata.currstatus + '&rduserid=' + getdata.rduserid + '&rdl4id=' + getdata.rdl4id
    return this.makeapi.method(this.updateStatusRejectTabAPI, reqdata, 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          $("#rejected_tab").modal("hide")
          this.getdata.showNotification('bottom', 'right', 'Buyer Approved Successfully', "success");
          this.back()
        } else {
          this.getdata.showNotification('bottom', 'right', "Something went wrong, Please try again later", "danger");
        }
      },
        Error => {

        })
  }
  ppt_upload_filename = ''
  ppt_send_upload_file: File
  ppt_choose_file(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.ppt_upload_filename = file.name;
      this.pptfilename = file.name
      this.ppt_send_upload_file = file
    }
  }
  @ViewChild('ppt_upload_attach') ppt_upload_attach: any;
  clear(type) {
    if (type == 1) {
      this.ppt_upload_attach.nativeElement.value = "";
      this.ppt_upload_filename = ""
      this.pptfilename = ''
      this.isPptUploaded = 0
    } else {
      $("#delete_file").modal("show")
    }
  }
  ppt_delete() {
    return this.makeapi.method(this.deletePPTAPI, 'vevamodelid=' + this.getAll_datas.id, 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.pptfilename = ''
          this.ppt_upload_filename = ''
          this.isPptUploaded = 0
          this.getdata.showNotification('bottom', 'right', "PPT Deleted...!!!", "success");
          $("#delete_file").modal("hide")
        } else {
          this.getdata.showNotification('bottom', 'right', "Something went wrong, Please try again...!!!", "danger");
        }
      })
  }
  vevamodelid = 0
  ppt_file_upload() {
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.ppt_upload_filename);
    finalformdata.append("file", this.ppt_send_upload_file);
    finalformdata.append("vevamodelid", String(this.vevamodelid));
    this.makeapi.method(this.uploadPPTAPI, finalformdata, 'file')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.ppt_upload_filename = ''
          this.pptfilename = ''
          let upload_files = this.upload_filename.filter(val => val.id == 0)
          if (upload_files == 0) {
            if (this.usertype == 1) {
              this.approve_reject_ = 1
              this.updateStatus()
            } else {
              $("#submit_data").modal("hide")
              this.getdata.showNotification('bottom', 'right', "VAVE Request Submitted Successfully", "success");
              this.back()
            }
          }
        }
      })
  }
  ppt_download_files() {
    return this.makeapi.method(this.downloadPPTAPI, 'vevamodelid=' + this.getAll_datas.id, 'zipPFEPpdf')
      .subscribe(res => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'Template.pptx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      })
  }
  upload_filename: any = []
  send_upload_file: File
  choose_file(event) {
    // this.upload_filename = []
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        var files: File = fileList[i];
        let fileName = files.name;
        this.upload_filename = this.upload_filename.filter(val => val.filename != fileName)
        this.upload_filename.push({ id: 0, filename: fileName, file: files })
      }
      $("#show_upload_file").modal("show")
    }
  }
  upload_files(time) {
    setTimeout(() => {
      let upload_filename = this.upload_filename.filter(val => val.id == 0)
      let files = upload_filename[0].file
      this.file_upload(files)
    }, time)
  }
  file_upload(files) {
    var file: File = files;
    let filename = file.name;
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", filename);
    finalformdata.append("file", file);
    finalformdata.append("vevamodelid", String(this.vevamodelid));
    this.makeapi.method(this.uploadFileAPI, finalformdata, 'file')
      .subscribe(data => {
        let upload_filename = this.upload_filename.filter(val => val.id == 0)
        upload_filename = upload_filename.filter(val => val.filename != filename)
        this.upload_filename = this.upload_filename.filter(val => val.filename != filename)
        if (upload_filename == 0) {
          if (this.ppt_upload_filename == '') {
            if (this.usertype == 1) {
              this.approve_reject_ = 1
              this.updateStatus()
            } else {
              $("#submit_data").modal("hide")
              this.getdata.showNotification('bottom', 'right', "VAVE Request Submitted Successfully", "success");
              this.back()
            }
          }
        } else {
          this.upload_files(10)
        }
      })
  }
  fileList = []
  getfileList(id) {
    return this.makeapi.method(this.fileListAPI, 'vevamodelid=' + id, 'post')
      .subscribe(data => {
        this.fileList = data
        this.upload_filename = data
        if (data.length == 0) {
          $("#show_upload_file").modal("hide")
        }
      })
  }
  download_files(values) {
    return this.makeapi.method(this.downloadFileAPI, 'id=' + values.id, 'zipPFEPpdf')
      .subscribe(res => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = values.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      })
  }
  view_files() {
    $("#show_upload_file").modal("show")
  }
  remove_filtes(data) {
    if (data.id == 0) {
      this.upload_filename = this.upload_filename.filter(val => val.filename != data.filename)
      if (this.upload_filename.length == 0) {
        $("#show_upload_file").modal("hide")
      }
    } else {
      this.file_delete(data.id)
    }

  }
  file_delete(id) {
    return this.makeapi.method(this.deleteFileAPI, 'id=' + id, 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.getdata.showNotification('bottom', 'right', "File Deleted...!!!", "success");
          this.upload_filename = this.upload_filename.filter(val => val.id != data.id)
          if (this.upload_filename.length == 0) {
            $("#show_upload_file").modal("hide")
          }
          // this.getfileList(this.getAll_datas.id)
        } else {
          this.getdata.showNotification('bottom', 'right', "Something went wrong, Please try again...!!!", "danger");
        }
      })
  }
}
