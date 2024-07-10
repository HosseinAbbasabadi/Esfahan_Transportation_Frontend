import { inject } from '@angular/core';
import { PasswordFlowService } from './password-flow.service';
import { CodeFlowService } from './code-flow.service';
import { environment } from 'src/environment/environment';

export const authGuard = () => {
    const codeFlowService = inject(CodeFlowService);
    const passwordFlowService = inject(PasswordFlowService);

    if (environment.ssoAuthenticationFlow = 'code') {
        if (codeFlowService.isLoggedIn()) {
            return true;
        }

        codeFlowService.startAuthentication()
        return false
    } else {
        if (passwordFlowService.isLoggedIn()) {
            return true;
        }

        passwordFlowService.logout()
        return false
    }
}