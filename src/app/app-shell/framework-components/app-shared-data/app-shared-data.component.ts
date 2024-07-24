import { Component, OnInit, inject } from '@angular/core';
import { LocalStorageService } from '../../framework-services/local.storage.service';
import { SettingService } from '../../framework-services/setting.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../framework-services/notification.service';
import { SwalService } from '../../framework-services/swal.service';
declare var $: any;

@Component({
  selector: 'app-app-shared-data',
  templateUrl: './app-shared-data.component.html'
})
export class AppSharedDataComponent implements OnInit {
  currentDateYm;
  currentCompanyGuid;
  SomeGlobalSetting;

  localStorageService = inject(LocalStorageService)
  settingService = inject(SettingService)
  notificationService = inject(NotificationService)
  activatedRoute = inject(ActivatedRoute)
  swalService = inject(SwalService)
  route = inject(Router)


  constructor() {
    // this.SomeGlobalSetting = this.settingService.getSettingValue("Public_UseSecondlanguage");
  }

  ngOnInit() { }

  getFormValue(form: FormGroup, controlName: string) {
    return form.get(controlName).value;
  }

  setFormValue(form: FormGroup, controlName: string, value: any) {
    form.get(controlName).setValue(value);
  }

  disableFormControl(form: FormGroup, controlName: string) {
    form.get(controlName).disable();
  }

  enableFormControl(form: FormGroup, controlName: string) {
    form.get(controlName).enable();
  }

  hideElement(id) {
    $(id).addClass('d-none');
  }

  showElement(id) {
    $(id).removeClass('d-none');
  }

  // changeElement(id, value) {
  //   $(id).innerHTML = value;
  // }

}