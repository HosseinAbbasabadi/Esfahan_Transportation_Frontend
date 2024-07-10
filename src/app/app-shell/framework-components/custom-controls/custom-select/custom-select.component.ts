import { FormControl, NgControl } from '@angular/forms';
import { AfterContentInit, AfterViewChecked, Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { CustomControlComponent } from '../custom-control.component';
import { SettingService } from 'src/app/app-shell/framework-services/setting.service';
declare var $: any;

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html'
})
export class CustomSelectComponent extends CustomControlComponent implements OnInit, AfterContentInit {

  minumumInputLength = 3 //this.settingService.getSettingValue("MinimumInputLength")

  @HostBinding('class') class: string
  @Input() type: 'select' | 'select-ajax' | 'simple' = 'select'
  @Input() options: any[] = []
  @Input() ajaxUrl: string
  @Input() searchTerm: string
  @Input() selectedItem: { guid: string, title: string }
  @Input() dropdownParent: string = 'ops-modal'

  @Output() selected = new EventEmitter()
  constructor(
    private readonly settingService: SettingService,
    @Self() @Optional() ngControl: NgControl) {
    super(ngControl)
  }

  ngAfterContentInit(): void {
    $('select').trigger('change')
  }

  override ngOnInit() {
    super.ngOnInit()
    this.class = this.size
  }

  itemSeleceted(event = null) {
    let guid = event.guid
    if (!guid)
      guid = event.value
    if (!guid)
      guid = event.id

    this.valueChanged(guid)
    this.selected.emit()
  }

  override valueChanged($event: any): void {
    this.value = $event
    this.onChange(this.value)
    this.changed.emit($event)
  }

  search(term: string, item: any) {
    console.log(term, item)
  }
}