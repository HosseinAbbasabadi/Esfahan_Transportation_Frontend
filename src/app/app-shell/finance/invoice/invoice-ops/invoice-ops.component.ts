import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppSharedDataComponent } from 'src/app/app-shell/framework-components/app-shared-data/app-shared-data.component';
import { ComboBase } from 'src/app/app-shell/framework-components/combo-base';
import { createGuid } from 'src/app/app-shell/framework-components/constants';
import { InvoiceService } from '../invoice.service';
declare var $: any

@Component({
  selector: 'app-invoice-ops',
  templateUrl: './invoice-ops.component.html'
})
export class InvoiceOpsComponent extends AppSharedDataComponent implements AfterViewChecked {

  customers: ComboBase[] = [
    { guid: '1', title: 'شرکت ملی نفت ایران' },
    { guid: '2', title: 'سازمان بنادر و دریانوردی' }
  ]

  products: ComboBase[] = [
    { guid: '1', title: 'رنگ سفید' },
    { guid: '2', title: 'رنگ سبز' },
    { guid: '3', title: 'رنگ آبی' },
  ]

  summary = { sumPrice: 0, sumDiscount: 0, sumFinalPrice: 0 }

  form!: FormGroup
  details = []

  constructor(private readonly fb: FormBuilder,
    private readonly invoiceService: InvoiceService) {
    super()

    this.form = fb.group({
      guid: [''],
      no: ['', [Validators.required]],
      date: ['', [Validators.required]],
      customerId: ['', [Validators.required]],
      description: ['']
    })
  }

  ngAfterViewChecked(): void {
    $('select').trigger('change')
  }

  get guid() {
    return this.getFormValue(this.form, 'guid')
  }

  override ngOnInit() {
    super.ngOnInit()

    this.setFormValue(this.form, 'guid', this.activatedRoute.snapshot.paramMap.get('guid'))
    if (this.guid)
      this.getInvoice()
  }

  getInvoice() {
    this.invoiceService
      .getForEdit(this.guid)
      .subscribe((data: any) => {
        this.form.patchValue(data)
        this.details = data.details

        this.calculateSummary()
      })
  }

  getActiveDetails() {
    return this.details.filter(x => !x.isDeleted)
  }

  addDetail() {
    const detail = {
      guid: createGuid(),
      count: 0,
      unitPrice: 0,
      price: 0,
      discount: 0,
      finalPrice: 0,
      isDeleted: false
    }

    this.details.push(detail)
  }

  removeDetail(guid) {
    this.swalService
      .fireSwal('آیا از انجام عملیات حذف ردیف اطمینان دارید؟', "حذف ردیف")
      .then((t) => {
        if (t.value === true) {
          this.confirmRemoveDetail(guid)
        } else {
          this.swalService.dismissSwal(t)
        }
      })
  }

  confirmRemoveDetail(guid) {
    const detail = this.details.find(x => x.guid == guid)
    if (detail.id) {
      detail.isDeleted = true
    } else {
      const index = this.details.findIndex(x => x.guid == guid)
      this.details.splice(index, 1)
    }
  }

  calculateFinalPrice(guid) {
    const detail = this.details.find(x => x.guid == guid)

    detail.price = detail.count * detail.unitPrice
    detail.finalPrice = detail.price - detail.discount

    this.calculateSummary()
  }

  calculateSummary() {
    this.summary.sumPrice = this.details.reduce((a, b) => a + b.price, 0)
    this.summary.sumDiscount = this.details.reduce((a, b) => a + b.discount, 0)
    this.summary.sumFinalPrice = this.details.reduce((a, b) => a + b.finalPrice, 0)
  }

  submit() {
    const command = this.form.value
    command.details = this.details

    if (this.guid) {
      this.invoiceService
        .edit(command)
        .subscribe(data => {
          console.log(data)
          this.route.navigateByUrl('finance/invoice')
        })
    } else {
      this.invoiceService
        .create(command)
        .subscribe(data => {
          console.log(data)
          this.route.navigateByUrl('finance/invoice')
        })
    }
  }

  backToList() {
    this.route.navigateByUrl('finance/invoice')
  }
}