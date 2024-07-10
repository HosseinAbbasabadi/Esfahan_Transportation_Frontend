import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ModalConfig } from '../framework-components/modal/modal.config';
import { ModalComponent } from '../framework-components/modal/modal.component';
import { UserService } from '../framework-services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  sessions = []
  modalConfig = new ModalConfig()
  @ViewChild('sessionModal') private sessionModalComponent: ModalComponent

  constructor(private readonly route: ActivatedRoute,
    private readonly uesrService: UserService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const showSessions = params.get('showSessions')
      if (showSessions) {
        this.getSessions()
      }
    })
  }

  getSessions() {

    this.uesrService
      .getCurrentUserLastSessions()
      .subscribe(data => {
        this.sessions = data
        this.modalConfig.modalTitle = 'تلاش های اخیر برای ورود به سیستم'
        this.modalConfig.hideFooter = true

        if (this.sessions.length)
          this.sessionModalComponent.open()
      })
  }
}
