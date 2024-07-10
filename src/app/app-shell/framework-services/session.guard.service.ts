import { inject } from '@angular/core';
import { PasswordFlowService } from './password-flow.service';
import { CodeFlowService } from './code-flow.service';
import { environment } from 'src/environment/environment';
import { UserService } from './user.service';

export const sessionGuard = () => {
    const passwordFlowService = inject(PasswordFlowService);
    const codeFlwoService = inject(CodeFlowService)
    const userService = inject(UserService);

    userService.hasActiveSession()
        .subscribe(data => {
            if (data.isActive) {
                return true;
            }

            if (environment.ssoAuthenticationFlow == 'code') {
                codeFlwoService.logout()
            } else {
                passwordFlowService.logout()
            }

            return false
        })
}