import { Component, OnInit } from '@angular/core';
import { PasswordFlowService } from './framework-services/password-flow.service';
import { CodeFlowService, getClientSettings } from './framework-services/code-flow.service';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent implements OnInit {

  constructor(
    private readonly codeFlowService: CodeFlowService,
    private readonly authenticationService: PasswordFlowService) { }

  ngOnInit() {
    const session = Object.keys(sessionStorage).find(x => x.includes(getClientSettings().client_id))
    if (!session) {
      this.codeFlowService.logout()
    }
  }
}