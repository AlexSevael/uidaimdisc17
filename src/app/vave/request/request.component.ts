import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../services/canactivate.service';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  constructor(private AuthGuard:AuthGuard) { }

  ngOnInit() {
    localStorage.setItem('vave_currentPage','1')
    if(this.AuthGuard.session().roleid == 4 || this.AuthGuard.session().roleid == 1 || this.AuthGuard.session().vevaAdmin == 1) {
    localStorage.setItem('vave_tabs','1')
    }else{
      localStorage.setItem('vave_tabs','2')
    }
  }

}
