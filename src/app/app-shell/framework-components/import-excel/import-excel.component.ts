import _ from 'lodash'
import * as XLSX from 'xlsx'
import { createGuid } from '../constants'
import { Component, OnInit } from '@angular/core'
import { AgGridBaseComponent } from '../ag-grid-base/ag-grid-base.component'
import { FormGeneratorService } from '../../framework-services/form-generator.service'
import { LocalStorageService } from '../../framework-services/local.storage.service'
import { NotificationService } from '../../framework-services/notification.service'
import { operationSuccessful } from '../app-messages'
import { BreadcrumbService } from '../../framework-services/breadcrumb.service'
import { SettingService } from '../../framework-services/setting.service'
import { ActivatedRoute } from '@angular/router'
declare var $: any

type AOA = any[][]

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html'
})
export class ImportExcelComponent extends AgGridBaseComponent implements OnInit {

  excelFile
  workSheetName
  workBook: XLSX.WorkBook
  workSheetNames = []
  rowSelection: string
  data: AOA = []

  header = []
  body = []
  gridData
  selectedTypeId

  types = [
    {
      guid: 1,
      title: 'نام تجهیزات',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'title',
          label: 'عنوان'
        },
      ]
    },
    {
      guid: 2,
      title: 'کمیت اندازه گیری',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'title',
          label: 'عنوان'
        },
      ]
    },

    {
      guid: 3,
      title: 'نوع ماموریت',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'title',
          label: 'عنوان'
        },
      ]
    },
    {
      guid: 4,
      title: 'حوزه',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'title',
          label: 'عنوان'
        },
      ]
    },
    {
      guid: 5,
      title: 'نام آزمون',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'title',
          label: 'عنوان'
        },
      ]
    }
    ,
    {
      guid: 6,
      title: 'اقلام آزمون',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'title',
          label: 'عنوان'
        },
      ]
    },
    {
      guid: 7,
      title: 'مشتریان بیرونی',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'customerName',
          label: 'نام مشتری'
        },
        {
          name: 'representativeName',
          label: 'نام نماینده'
        },
        {
          name: 'telNumber',
          label: 'تلفن'
        },
        {
          name: 'faxNumber',
          label: 'فکس'
        },
        {
          name: 'address',
          label: 'آدرس'
        },
        {
          name: 'description',
          label: 'توضیحات'
        },
      ]
    },
    {
      guid: 8,
      title: 'استاندارد ها',
      loadDynamic: false,
      batchSubmit: true,
      fields: [
        {
          name: 'row',
          label: 'ردیف'
        },
        {
          name: 'title',
          label: 'نام استاندارد'
        },
        {
          name: 'standardNumber',
          label: 'شماره استاندارد'
        },
        {
          name: 'releaseDate',
          label: 'تاریخ انتشار'
        },
        {
          name: 'placeTypeTitle',
          label: 'محل'
        },
        {
          name: 'LabTypeTitle',
          label: 'نوع'
        }
      ]
    }
    // {
    //   id: 8,
    //   name: 'سند حسابداری',
    //   batchSubmit: true,
    //   fields: [
    //     {
    //       label: 'تاریخ',
    //       name: 'date'
    //     },
    //     {
    //       label: 'شماره سند',
    //       name: 'no'
    //     },
    //     {
    //       label: 'ردیف',
    //       name: 'itemNo'
    //     },
    //     {
    //       label: 'کد حساب',
    //       name: 'totalAccountCode'
    //     },
    //     {
    //       label: 'بدهکار',
    //       name: 'debit'
    //     },
    //     {
    //       label: 'بستانکار',
    //       name: 'credit'
    //     },
    //     {
    //       label: 'شرح ردیف',
    //       name: 'detailDescription'
    //     },
    //     {
    //       label: 'شرح لاتین ردیف',
    //       name: 'detailEngDescription'
    //     },
    //     {
    //       label: 'شرح سند',
    //       name: 'description'
    //     },
    //     {
    //       label: 'نوع ارز',
    //       name: 'foreignExchangeCode'
    //     },
    //     {
    //       label: 'تعداد ارز',
    //       name: 'foreignExchangeQty'
    //     },
    //     {
    //       label: 'نرخ ارز',
    //       name: 'foreignExchangeRate'
    //     },
    //     {
    //       label: 'نوع ارز 2',
    //       name: 'foreignExchangeCode2'
    //     },
    //     {
    //       label: 'تعداد ارز 2',
    //       name: 'foreignExchangeQty2'
    //     },
    //     {
    //       label: 'نرخ ارز 2',
    //       name: 'foreignExchangeRate2'
    //     },
    //   ]
    // }
  ]

  isSubmitting = false
  fieldList = []
  errorList = []
  queue = []

  constructor(
    //private readonly listFieldItemService: ListFieldItemService,
    private readonly crumbService: BreadcrumbService) {
    super()
  }

  override ngOnInit(): void {
    this.crumbService.setTitle('مرکز وصول اطلاعات از فایل اکسل')
    this.selectedTypeId = this.activatedRoute.snapshot.paramMap.get('guid')
    this.onTypeChanged()
  }

  onFileUpload(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target)
    if (target.files.length !== 1) throw new Error('امکان استفاده همزمان از چند فایل وجود ندارد.')

    const reader: FileReader = new FileReader()
    var self = this
    reader.onload = (e: any) => {
      const bstr = e.target.result
      self.workBook = XLSX.read(bstr, { type: 'binary' })

      self.workBook.SheetNames.forEach(sheet => {
        self.workSheetNames.push({ guid: createGuid(), title: sheet })
      })

      $('select').trigger('change')
    }

    reader.readAsBinaryString(target.files[0])
  }

  onSheetSelected() {
    const workSheetTitle = this.workSheetNames.find(x => x.guid == this.workSheetName).title
    const workSheet = this.workBook.Sheets[workSheetTitle]
    this.data = <AOA>(XLSX.utils.sheet_to_json(workSheet, { header: 1 }))
    this.data[0]
      .filter(x => x)
      .forEach(item => {
        this.header.push({ id: createGuid(), name: item })
      })

    this.data.forEach((row, index) => {
      let isEmpty = true
      const newRow = {}
      this.header.forEach((_head, index) => {
        if (row[index]) isEmpty = false

        newRow[`col_${index}`] = row[index]
      })

      if (!isEmpty) {
        this.body.push(newRow)
      }
    })

    this.gridOptions.columnDefs = []

    this.header.forEach((item, index) => {
      this.gridOptions.columnDefs.push({
        field: `col_${index}`,
        headerName: item.name,
        filter: "agSetColumnFilter",
      })
    })

    this.body.splice(0, 1)
    this.gridData = this.body

    this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
    this.gridOptions.api.setRowData(this.gridData)
  }

  onTypeChanged() {
    const type = this.types.find(x => x.guid == this.selectedTypeId)
    this.fieldList = type.fields
    // if (type.loadDynamic) {
    //   this.formGeneratorService
    //     .getTableInfo(type.tableName)
    //     .subscribe(info => {
    //       info.filter(x => x.isUserDefined)
    //         .forEach(item => {
    //           this.fieldList.push({ name: item.colName, label: item.colAliasName })
    //         })
    //     })
    // }
  }

  // loadReferenceData(referenceTable, target) {
  //   const targetId = `#field${target}`
  //   if ($(targetId).data('is-loaded')) {
  //     return
  //   } else {
  //     const destination = $(targetId)
  //     if (referenceTable == 'BankAccount') {
  //       this.bankAccountService
  //         .getForCombo()
  //         .subscribe(data => {
  //           this.fillSelect(destination, data)
  //         })
  //     } else if (referenceTable == "Month") {
  //       this.fillSelect(destination, months)
  //     } else if (referenceTable == 'ListFieldItem_Loan') {
  //       this.getListFieldItem(15, destination)
  //     } else if (referenceTable == 'ListFieldItem_Leave') {
  //       this.getListFieldItem(12, destination)
  //     } else if (referenceTable == 'ListFieldItem_Absense') {
  //       this.getListFieldItem(13, destination)
  //     } else if (referenceTable == 'ListFieldItem_Mission') {
  //       this.getListFieldItem(14, destination)
  //     }
  //   }

  //   $(targetId).data('is-loaded', true)
  // }

  // getListFieldItem(listFieldGroupId, destination) {
  //   this.listFieldItemService
  //     .getForCombo(listFieldGroupId)
  //     .subscribe(data => {
  //       this.fillSelect(destination, data)
  //     })
  // }

  fillSelect(destination: any, data: any) {
    destination.html("")
    destination.append($('<option selected></option>').val(0).html("لطفا انتخاب کنید"))
    $.each(data, function (i, item) {
      destination.append($('<option></option>').val(item.id).html(item.name))
    })
  }

  getTypeName() {
    if (this.selectedTypeId)
      return this.types.find(x => x.guid == this.selectedTypeId).title
    return ''
  }

  setQueue() {
    this.queue = []
    const type = this.types.find(x => x.guid == this.selectedTypeId)
    let command = []

    if (type.loadDynamic) {
      this.gridData.forEach((item, index) => {
        let row = {
          bypassDuplicationCheck: true,
          items: []
        }

        this.fieldList.forEach(field => {
          const rowItem = {
            key: field.name,
            aliasName: field.label,
            value: ''
          }

          if (field.isUserDefined) {
            rowItem.value = field.value
          } else {
            rowItem.value = item[field.value]
          }

          row.items.push(rowItem)
        })

        command.push(row)
      })
    } else {
      this.gridData.forEach((item, index) => {
        const row = { index: index + 1 }
        this.fieldList.forEach(field => {
          if (field.isUserDefined) {
            row[field.name] = field.value
          } else {
            row[field.name] = item[field.value]
          }
        })

        command.push(row)
      })
    }

    command.forEach(item => {
      this.queue.push({ executed: false, failed: false, command: item })
    })

    if (type.batchSubmit)
      this.batchSubmit()
    // else
    //   this.queueSubmit()
  }

  // queueSubmit() {
  //   let errorList = []
  //   const itemInQueue = this.queue.find(x => !x.executed && !x.failed)
  //   if (!itemInQueue) {
  //     this.queue = []
  //     if (errorList.length > 0) {
  //       this.notificationService.error(`ردیف های '${errorList.join(', ')}' با خطا مواجه شد.`)
  //       errorList = []
  //     }
  //     return
  //   }

  //   itemInQueue.executed = true
  //   const type = this.types.find(x => x.id == this.selectedTypeId)
  //   if (type.id == 1) {
  //   } else if (type.id == 2) {
  //     this.activityService
  //       .createFromExcel(itemInQueue.command)
  //       .subscribe(_ => {
  //         this.queueSubmit()
  //       }, error => {
  //         this.handleError(itemInQueue, errorList)
  //       })
  //   } else if (type.id == 8) {

  //   }
  // }

  // handleError(itemInQueue: any, errorList: any[]) {
  //   itemInQueue.failed = true
  //   errorList.push(itemInQueue.command.index)
  //   this.queueSubmit()
  // }

  // getQueueLength() {
  //   return this.queue.length
  // }

  // getCompletedInQueue() {
  //   return this.queue.filter(x => x.executed).length
  // }

  // getProgressWith() {
  //   const value = this.getCompletedInQueue() * 100 / this.getQueueLength()
  //   return `width: ${value}%`
  // }

  batchSubmit() {
    this.isSubmitting = true
    const rawCommand = this.queue.map(x => x.command)
    const type = this.types.find(x => x.guid == this.selectedTypeId)

    // if (type.id == 8) {
    //   const command = {
    //     documentAccounting: _(rawCommand)
    //       .groupBy("no")
    //       .map((details, key) => ({
    //         no: key,
    //         date: details[0].date,
    //         description: details[0].description,
    //         summaryDebit: _.sumBy(details, 'debit'),
    //         summaryCredit: _.sumBy(details, 'credit'),
    //         isComplete: _.sumBy(details, 'debit') == _.sumBy(details, 'credit'),
    //         details: Object.keys(details).map(index => ({
    //           guid: createGuid(),
    //           itemNo: details[index].itemNo,
    //           totalAccountCode: details[index].totalAccountCode,
    //           debit: details[index].debit,
    //           credit: details[index].credit,
    //           description: details[index].detailDescription,
    //           engDescription: details[index].detailEngDescription,
    //           foreignExchangeCode: details[index].foreignExchangeCode,
    //           foreignExchangeQty: details[index].foreignExchangeQty,
    //           foreignExchangeRate: details[index].foreignExchangeRate,
    //           foreignExchangeCode2: details[index].foreignExchangeCode2,
    //           foreignExchangeQty2: details[index].foreignExchangeQty2,
    //           foreignExchangeRate2: details[index].foreignExchangeRate2,
    //         }))
    //       })).value()
    //   }

    //   this.documentAccountingService
    //     .createFromExcel(command)
    //     .subscribe(_ => {
    //       this.isSubmitting = false
    //       this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }



    // if (type.guid == 1) {
    //   const command = {
    //     items: rawCommand
    //   }

    //   this.equipmentNameService
    //     .batchCreate(command)
    //     .subscribe(data => {
    //       this.isSubmitting = false
    //       this.errorList = []
    //       if (data) {
    //         this.errorList.push(data);
    //         this.notificationService.succeded("با موفقیت ثبت شد")
    //       }
    //       else
    //         this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }

    // if (type.guid == 2) {
    //   const command = {
    //     items: rawCommand
    //   }

    //   this.equipmentNameService
    //     .batchCreate(command)
    //     .subscribe(_ => {
    //       this.isSubmitting = false
    //       this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }
    // if (type.guid == 3) {
    //   const command = {
    //     items: rawCommand
    //   }

    //   this.missionService
    //     .batchCreate(command)
    //     .subscribe(_ => {
    //       this.isSubmitting = false
    //       this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }
    // if (type.guid == 4) {
    //   const command = {
    //     items: rawCommand
    //   }

    //   this.zoneService
    //     .batchCreate(command)
    //     .subscribe(_ => {
    //       this.isSubmitting = false
    //       this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }
    // if (type.guid == 5) {
    //   const command = {
    //     items: rawCommand
    //   }

    //   this.testNameService
    //     .batchCreate(command)
    //     .subscribe(_ => {
    //       this.isSubmitting = false
    //       this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }
    // if (type.guid == 6) {
    //   const command = {
    //     items: rawCommand
    //   }

    //   this.testItemService
    //     .batchCreate(command)
    //     .subscribe(_ => {
    //       this.isSubmitting = false
    //       this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }
    // if (type.guid == 7) {
    //   const command = {
    //     items: rawCommand
    //   }
    // }
    // if (type.guid == 8) {
    //   const command = {
    //     items: rawCommand
    //   }

    //   this.standardService
    //     .batchCreate(command)
    //     .subscribe(data => {
    //       this.isSubmitting = false
    //       this.errorList = []
    //       if (data) {
    //         this.errorList.push(data);
    //         this.notificationService.error("اطلاعات ثبت نشده است لطفا خطاها را بررسی کنید.")
    //       }
    //       else
    //         this.notificationService.succeded(operationSuccessful)
    //     }, error => {
    //       this.isSubmitting = false
    //     })
    // }
  }
  rowSelected(item) {

  }
}