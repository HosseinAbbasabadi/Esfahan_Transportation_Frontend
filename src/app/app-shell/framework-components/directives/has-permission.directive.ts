import {
  Directive,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  Input
} from '@angular/core';
import { PasswordFlowService } from '../../framework-services/password-flow.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private neededPermission: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: PasswordFlowService) {
  }

  ngOnInit() { }

  @Input()
  set hasPermission(val) {
    this.neededPermission = val;
    this.updateView();
  }

  private updateView() {
    if (this.authenticationService.hasNoAnyPermissions()) this.viewContainer.clear;
    if (this.authenticationService.checkPermission(this.neededPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}