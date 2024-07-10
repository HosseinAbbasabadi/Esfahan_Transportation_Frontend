import { Component, OnInit, AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { PasswordFlowService } from '../framework-services/password-flow.service';
import { LocalStorageService } from '../framework-services/local.storage.service';
import { USER_CLASSIFICATION_LEVEL_ID_NAME, USER_COMPANY_ID_NAME, USER_ORGANIZATION_CHART_ID_NAME } from '../framework-services/configuration';
import { ModalComponent } from '../framework-components/modal/modal.component';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '../framework-services/notification.service';
import { operationSuccessful } from '../framework-components/app-messages';
import { Router } from '@angular/router';
import { CodeFlowService } from '../framework-services/code-flow.service';
import { environment } from 'src/environment/environment';
import { ModalConfig } from '../framework-components/modal/modal.config';
import { UserService } from '../framework-services/user.service';
declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ["./header.style.css"]
})
export class HeaderComponent implements OnInit, AfterContentInit {

  notifications = []
  information = {
    fullname: '',
    companyTitle: '',
    organizationChartTitle: '',
    classificationLevel: '',
    needChangePassword: false,
    companyGuid: '',
    organizationChartGuid: ''
  }
  passwordStrength = 0
  hintModalConfig = new ModalConfig();
  @ViewChild('hintModal') private hintModalComponent: ModalComponent;
  tabItem = 1
  form = this.fb.group({
    password: [''],
    rePassword: [''],
    currentPassword: [''],
  })

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly passwordFlowService: PasswordFlowService,
    private readonly codeFlowService: CodeFlowService,
    private readonly userService: UserService,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService) {
  }

  ngAfterContentInit(): void {
    this.userInformation()
  }

  ngOnInit(): void {
    this.hintModalConfig.id = 'hintModal'
    this.hintModalConfig.hideHeader = false
    this.hintModalConfig.hideFooter = true
    this.hintModalConfig.size = "full"
    this.hintModalConfig.dualSave = false
    this.hintModalConfig.modalTitle = "مستندات تصویری"

    this.getNotifications()
  }

  get password() {
    return this.form.get('password').value
  }

  userInformation() {
    this.userService
      .getUserInformation()
      .subscribe({
        next: result => {
          this.information = result
          this.localStorageService.setItem(USER_COMPANY_ID_NAME, result.companyGuid)
          this.localStorageService.setItem(USER_ORGANIZATION_CHART_ID_NAME, result.organizationChartGuid)
          this.localStorageService.setItem(USER_CLASSIFICATION_LEVEL_ID_NAME, result.classificationLevelGuid)
        },
        complete: () => { }
      })
  }

  strengthChange(strength) {
    this.passwordStrength = strength
  }

  logout() {
    if (environment.ssoAuthenticationFlow == 'code') {
      this.codeFlowService.logout()
    } else {
      this.passwordFlowService.logout()
    }
  }

  getNotifications() {
    // this.notifService
    //   .getNotifications()
    //   .subscribe(data => {
    //     this.notifications = data
    //   })
  }

  openNotificationDestination(notification) {
    this.makeSeen(notification.guid)
    if (notification.type == 1) {
      this.router.navigateByUrl('/calibration/calibration-request/main')
    }
    if (notification.type == 2 || notification.type == 3) {
      this.router.navigateByUrl('/calibration/calibration-request/main')
    }
    if (notification.type == 4 || notification.type == 5) {
      this.router.navigateByUrl('/calibration-request-review/reviewing-request-and-approving-manager/list')
    }
    if (notification.type == 6) {
      this.router.navigateByUrl('/calibration-request-review/approver-calibration-request-review/list')
    }
    if (notification.type == 7) {
      this.router.navigateByUrl('/calibration/calibration-request/main')
    }
    if (notification.type == 8 || notification.type == 9) {
      this.router.navigateByUrl('/calibration/calibration-request/main')
    }
    if (notification.type == 10) {
      this.router.navigateByUrl('/calibration-request-review/reviewing-request-and-approving-manager/list')
    }
    else if (notification.type != 1 && notification.type != 2 && notification.type != 3 && notification.type != 4 && notification.type != 5 && notification.type != 6 && notification.type != 7 && notification.type != 8 && notification.type != 9 && notification.type != 10) {
      this.router.navigateByUrl('/calibration/first-approver/list')
    }

  }

  makeSeen(guid) {
    // this.notifService
    //   .makeSeen(guid)
    //   .subscribe(_ => {
    //     this.getNotifications()
    //   })
  }
  showModal() {
    this.hintModalComponent.open()
  }
  hintModalClosed() {
    this.hintModalComponent.close()
  }
  setTabItem(element) {
    this.tabItem = element
  }
}