import {
  Component,
  AfterViewChecked,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
// import { ServiceBase } from '../../framework-services/service.base';

@Component({
  selector: 'app-fixed-columns',
  templateUrl: './fixed-columns.component.html',
  styleUrls: ['./fixed-columns.component.css'],
})
export class FixedColumnsComponent {
  itemGuid=""
  @Input() public item: any;
  @Input() public permissions: any;
  @Input() public customClassName: string;
  @Output() public activate = new EventEmitter()
  @Output() public deactivate = new EventEmitter()
  @Output() public delete = new EventEmitter()
  @Output() public openOpsModal = new EventEmitter()
  @Output() public download = new EventEmitter()
  
  constructor() {}
  ngOnInit(): void {
    console.log(this.customClassName);
    
  }
  onDelete(guid){
    this.delete.emit(guid)
  }
  onActivate(guid){
    this.activate.emit(guid)
  }
  onDeactivate(guid: string) {
    this.deactivate.emit(guid)
  }
  onOpenOpsModal(guid){
    this.openOpsModal.emit(guid)
  }
  onDownloadFile(guid){
    this.download.emit(guid)
  }
  showDetail(guid) {
    this.itemGuid = guid;
  }
}
