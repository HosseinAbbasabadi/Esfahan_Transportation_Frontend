import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NotificationService } from '../../framework-services/notification.service'
import { ServiceBase } from '../../framework-services/service.base'
import { SettingService } from '../../framework-services/setting.service'
import { AgGridBaseComponent } from '../ag-grid-base/ag-grid-base.component'
import { ModalComponent } from './modal.component'
import { ModalConfig } from './modal.config'
import { LocalStorageService } from '../../framework-services/local.storage.service'
import { BreadcrumbService } from '../../framework-services/breadcrumb.service'
import { formGroupToFormData } from '../constants'
import { USER_CLASSIFICATION_LEVEL_ID_NAME } from '../../framework-services/configuration'
import { Router } from '@angular/router'
import { classificationLevelError } from '../app-messages'
import { FeatureService } from '../../framework-services/feature.service'
declare var $: any
@Component({
  selector: 'app-modal-form-base',
  template: ''
})
export class ModalFormBaseComponent<T extends ServiceBase, TModel> extends AgGridBaseComponent implements OnInit, AfterViewInit, OnDestroy {
  title: string
  form: FormGroup
  isModalShow = false
  records: TModel[] = []
  modalConfig = new ModalConfig()
  featureTitle = ''
  dtOptions: DataTables.Settings = {
    destroy: true,
    paging: true,
    orderMulti: true,
    scrollX: true,
    responsive: false,
    order: [],
    language: {
      search: "جستجو:",
      lengthMenu: "نمایش _MENU_ ردیف در صفحه",
      zeroRecords: "ردیفی یافت نشد",
      info: "نمایش صفحه _PAGE_ از _PAGES_",
      infoEmpty: "ردیفی پیدا نشد",
      infoFiltered: "(جستجو در میان _MAX_ ردیف)",
      paginate: {
        next: 'بعدی',
        previous: 'قبلی',
        first: 'اولین',
        last: 'آخرین'
      }
    }
  }

  @Output() afterListFetch = new EventEmitter()
  @Output() afterModalOpened = new EventEmitter()
  @Output() afterModalClose = new EventEmitter()
  @Output() afterEntityFetch = new EventEmitter<any>()
  @Output() afterFormSubmit = new EventEmitter<number>()
  @Output() afterDelete = new EventEmitter()
  @Output() afterReset = new EventEmitter()

  @ViewChild('opsModal') private opsModalComponent: ModalComponent

  featureService = inject(FeatureService)
  router = inject(Router)
  notificationService = inject(NotificationService)
  breadcrumbService = inject(BreadcrumbService)
  fb = inject(FormBuilder)

  constructor(
    @Inject(String) title,
    @Inject(ServiceBase) readonly service: T,
    @Inject(String) featureTitle = '') {
    super()
    this.title = title
    this.featureTitle = featureTitle
    this.breadcrumbService.setTitle(title)
  }

  override ngOnInit(): void {
    super.ngOnInit()
    if (this.featureTitle) {
      this.getClassificationLevel()
    } else {
      this.getList()
    }
  }
  ngAfterViewInit(): void {
  }

  // listSubscription = ;
  getList() {
    this.records = []
    this.service.getList<TModel[]>()
      .subscribe({
        next: data => this.handleListSubscription(data)
      })
  }
  handleListSubscription(data) {
    this.records = data
    this.afterListFetch.emit()
  }
  getClassificationLevel() {
    const userClassificationLevelGuid = this.localStorageService.getItem(USER_CLASSIFICATION_LEVEL_ID_NAME)
    const searchModel = {
      featureTitle: this.featureTitle,
      userClassificationLevelGuid
    }
    this.featureService
      .getClassificationLevelByTitle(searchModel)
      .subscribe(result => {
        if (!result) {
          this.notificationService.error(classificationLevelError)
          this.router.navigateByUrl('/dashboard')
          return
        }
        this.getList()
        this.breadcrumbService.setClassificationLevel(result.title)
      })
  }
  delete(id) {
    this.fireDeleteSwal().then((t) => {
      if (t.value === true) {
        this.deleteRecord(id)
      } else {
        this.dismissDeleteSwal(t)
      }
    })
  }
  deleteRecord(id) {
    this.service
      .delete(id)
      .subscribe(() => {
        this.getList()
        // this.fireDeleteSucceddedSwal()
        this.notificationService.succeded()
        this.afterDelete.emit()
      })
  }
  openOpsModal(guid = null) {
    if (guid) {
      this.service
        .getForEdit(guid)
        .subscribe(data => {
          this.modalConfig.modalTitle = `ویرایش ${this.title}`
          this.form.patchValue(data)
          this.afterEntityFetch.emit(data)
          this.afterModalOpened.emit()
        })
    }
    else {
      this.form.reset()
      this.afterReset.emit()
      this.modalConfig.modalTitle = `ایجاد ${this.title}`
      this.afterModalOpened.emit()
    }
    this.isModalShow = true
    this.opsModalComponent.open()
  }
  activate(guid: string) {
    this.service
      .activate(guid)
      .subscribe(() => {
        this.getList()
      })
  }
  deactivate(guid: string) {
    this.service
      .deactivate(guid)
      .subscribe(() => {
        this.getList()
      })
  }
  submit(action, hasFile = false) {
    if (hasFile) {
      this.submitWithFile(action)
    } else {
      this.submitWithJson(action)
    }
  }
  submitWithJson(action) {
    const command = this.form.value
    if (command.guid) {
      this.service
        .edit(command)
        .subscribe(data => {
          this.handleCreateEditOps(action)
        })
    } else {
      this.service
        .create(command)
        .subscribe(guid => {
          this.handleCreateEditOps(action)
        })
    }
  }
  submitWithFile(action) {
    const guid = this.form.value.guid
    const formData = formGroupToFormData(this.form)

    if (guid) {
      this.service
        .editWithFile(formData)
        .subscribe(data => {
          this.handleCreateEditOps(action)
        })
    } else {
      this.service
        .createWithFile(formData)
        .subscribe(guid => {
          this.handleCreateEditOps(action)
        })
    }
  }
  handleCreateEditOps(action) {
    if (action == "new") {
      this.form.reset()
      this.modalConfig.modalTitle = `ایجاد ${this.title}`
      $("select").val(null).trigger("change");
    }
    else if (action == "exit") {
      this.opsModalComponent.close()
    }
    this.afterFormSubmit.emit()
    this.getList()
    this.notificationService.succeded()
  }
  ngOnDestroy(): void {
    this.afterListFetch.unsubscribe()
    this.afterFormSubmit.unsubscribe()
    this.afterDelete.unsubscribe()
    this.afterReset.unsubscribe()
  }
  modalClosed() {
    this.form.enable()
    this.form.reset()
    $('#submitForm').removeClass('was-validated')
    $('.radioItem').removeAttr('active');
    this.isModalShow = false
    this.afterModalClose.emit()
  }
  navigateToExcelImportPage(id) {
    this.router.navigate(['import-excel', id])
  }

  setFile(event: any, controlName) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.get(controlName).setValue(file);
    this.form.get(controlName).updateValueAndValidity();
  }
}