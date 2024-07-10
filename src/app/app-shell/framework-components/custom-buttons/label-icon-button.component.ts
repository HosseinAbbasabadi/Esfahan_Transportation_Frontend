import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import { BaseButtonComponent } from './base-button.component';

@Component({
  selector: 'app-label-icon-button',
  template: `
    <button *hasPermission="[permission]" [id]="identifier" [type]="btnType" className="btn btn-{{className}} waves-effect waves-light" (click)="onClick()" [disabled]="disable">
      <span class="btn-label">
        <!-- <i class="fa fa-times"></i> -->
        <img width="20px" height="20px" src="assets/images/icons/{{icon}}.svg">
      </span> {{label}}
    </button>
  `
})
export class LabelIconButtonComponent extends BaseButtonComponent implements OnInit {
  @Input() label = 'Button'
  @Input() icon = ''
}
