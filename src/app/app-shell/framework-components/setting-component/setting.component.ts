import { operationSuccessful } from '../app-messages'
import { createPreSelectedOption } from '../constants'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { AfterViewChecked, Component, OnInit } from '@angular/core'
import { SettingService } from '../../framework-services/setting.service'
import { BreadcrumbService } from '../../framework-services/breadcrumb.service'
import { NotificationService } from '../../framework-services/notification.service'
import { UserManagementSettingService } from '../../framework-services/user-management-setting.service'
declare var $: any

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit, AfterViewChecked {

  calibrationSettings = []
  userManagementSettings = []
  bitOptions = [
    { id: 0, name: 'خیر' },
    { id: 1, name: 'بلی' },
  ]

  constructor(private readonly route: ActivatedRoute,
    private readonly crumbService: BreadcrumbService,
    private readonly calibrationSettingService: SettingService,
    private readonly userManagementSettingService: UserManagementSettingService,
    private readonly notificationService: NotificationService) { }

  ngAfterViewChecked(): void {
  }

  ngOnInit(): void {
    this.crumbService.setTitle("تنظیمات")
    this.getCalibrationSettings()
    this.getUsermanagementSettings()
  }

  getCalibrationSettings() {
    this.calibrationSettingService
      .getSettings()
      .subscribe(data => {
        this.calibrationSettings = data

        this.calibrationSettings
          .filter(x => x.fieldType == 'list')
          .forEach(item => {
            createPreSelectedOption(`#${item.id}`, item.valueLabel, item.value)
          })
      })
  }

  getUsermanagementSettings() {
    this.userManagementSettingService
      .getSettings()
      .subscribe(data => {

        this.userManagementSettings = data

        this.userManagementSettings
          .filter(x => x.fieldType == 'list')
          .forEach(item => {
            createPreSelectedOption(`#${item.id}`, item.valueLabel, item.value)
          })
      })
  }

  submitUsermanagement() {
    const command = {
      items: []
    }

    this.userManagementSettings.forEach(item => {
      command.items.push({
        settingId: item.id,
        value: item.value,
        fieldType: item.fieldType
      })
    })

    this.userManagementSettingService
      .edit(command)
      .subscribe(_ => {
        this.getUsermanagementSettings()
        this.notificationService.succeded(operationSuccessful)
      })
  }

  submitCalibration() {
    const command = {
      items: []
    }

    this.calibrationSettings.forEach(item => {
      command.items.push({
        settingId: item.id,
        value: item.value,
        fieldType: item.fieldType
      })
    })

    this.calibrationSettingService
      .edit(command)
      .subscribe(_ => {
        this.getCalibrationSettings()
        this.notificationService.succeded(operationSuccessful)
      })
  }
}