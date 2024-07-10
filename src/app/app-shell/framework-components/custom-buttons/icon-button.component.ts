import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import { BaseButtonComponent } from './base-button.component';

@Component({
  selector: 'app-icon-button',
  template: `
    <button *hasPermission="[permission]" [id]="identifier" [type]="btnType" className="btn btn-{{className}} waves-effect waves-light" data-toggle="tooltip" data-placement="top" [title]="label" (click)="onClick()" [disabled]="disable">
      <img width="20px" height="20px" src="assets/images/icons/{{icon}}.svg">
    </button>
  `
})
export class IconButtonComponent extends BaseButtonComponent implements OnInit {
  @Input() label = 'dafault'
  @Input() icon = ''
}
