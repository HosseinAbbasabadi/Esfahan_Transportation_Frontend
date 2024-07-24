import { Component } from '@angular/core';
import { InvoiceService } from './invoice.service';
import { AgGridBaseComponent } from '../../framework-components/ag-grid-base/ag-grid-base.component';
import { InvoiceModel } from './invoice';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent extends AgGridBaseComponent {

  records: InvoiceModel[] = []

  constructor(private readonly invoiceService: InvoiceService) {
    super(true);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getList()

    this.gridOptions.columnDefs = [
      {
        field: '',
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editUrl: '/finance/invoice-ops'
        },
        headerName: 'عملیات',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'no',
        headerName: 'شماره',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'date',
        headerName: 'تاریخ',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'customerId',
        headerName: 'مشتری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'sumPrice',
        headerName: 'مبلغ خالص',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'sumDiscount',
        headerName: 'تخفیف',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'sumFinalPrice',
        headerName: 'مبلغ نهایی',
        filter: 'agSetColumnFilter'
      }
    ]
  }

  getList() {
    const searchModel = {
      fromDate: '',
      toDate: '',
      fromNo: 0,
      toNo: 0,
      customerId: 0
    }

    this.invoiceService
      .getListWithParams<InvoiceModel[]>(searchModel)
      .subscribe(data => this.records = data)
  }

  navigateToCreate() {
    this.route.navigateByUrl('finance/invoice-ops')
  }

  delete(guid) {
    this.swalService
      .fireSwal('آیا از انجام عملیات حذف اطمینان دارید؟', "حذف ردیف")
      .then((t) => {
        if (t.value === true) {
          this.confirmDelete(guid)
        } else {
          this.swalService.dismissSwal(t)
        }
      })
  }

  confirmDelete(guid) {
    this.invoiceService
      .delete(guid)
      .subscribe(data => {
        this.notificationService.succeded()
        this.getList()
      })
  }
}
