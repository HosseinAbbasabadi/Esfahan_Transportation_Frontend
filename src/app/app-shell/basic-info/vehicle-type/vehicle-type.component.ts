import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component';
import { vehicleTypeModel } from './vehicleType';
import { VehicleTypeService } from './vehicleType.service';
import { ModalConfig } from '../../framework-components/modal/modal.config';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { JsTreeComponent } from '../../framework-components/js-tree-component/js-tree.component';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
})
export class VehicleTypeComponent extends ModalFormBaseComponent<VehicleTypeService, vehicleTypeModel> {

  selectOptions = [
    { guid: '12', title: '123' },
    { guid: '134', title: '345' }
  ]

  treeData = [
    { id: 1, title: 'root', parentId: '#' },
    { id: 2, title: 'sub1', parentId: 1 },
    { id: 3, title: 'sub2', parentId: 1 },
    { id: 4, title: 'root2', parentId: '#' },
  ]

  table = []
  tableModalConfig = new ModalConfig()
  @ViewChild('tableModal') private tableModal: ModalComponent
  @ViewChild('myTree') private myTree: JsTreeComponent

  buttonPermissions = {
    delete: "BasicInformation_PerformanceType_Delete",
    active: "BasicInformation_PerformanceType_Activate",
    deActive: "BasicInformation_PerformanceType_Deactivate",
    edit: "BasicInformation_PerformanceType_Edit"
  }

  constructor(vehicleTypeService: VehicleTypeService) {
    super(
      'نوع وسیله',
      vehicleTypeService,
      'BasicInformation_PerformanceType'
    );

    this.form = this.fb.group({
      guid: [''],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
        ],
      ],
      selcet: [''],
      attach: ['']
    });

    this.afterListFetch.subscribe((_) => {
      console.log('list is here')
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.tableModalConfig.size = 'full'
    this.tableModalConfig.id = 'tableModal'
    this.tableModalConfig.modalTitle = 'جدول شماره 1'
    this.tableModalConfig.hideSubmitButton = true
  }

  openTableModal() {
    this.service
      .getList<[]>()
      .subscribe({
        next: data => this.table = data,
        complete: () => {
          this.myTree.drawTree(this.treeData)
          this.tableModal.open()
        }
      })
  }

  clearTable() {
    this.table = []
  }

  nodeSelected(event) {
    console.log(event)
  }
}
