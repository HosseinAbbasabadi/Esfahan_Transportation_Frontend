import { Injectable } from '@angular/core';
import { getServiceUrl } from 'src/environment/environment';
import { HttpService, RequestConfig } from './http.service';
import { ServiceBase } from './service.base';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ServiceBase {
  constructor(httpService: HttpService) {
    super('User', httpService, 'um');
  }

  getToken(command) {
    const path = `${this.baseUrl}/GetToken`;
    return this.httpService.put(path, command);
  }

  changePassword(command) {
    const path = `${this.baseUrl}/ChangePassword`;
    return this.httpService.post(path, command, new RequestConfig({ formId: 'changePasswordForm' }));
  }

  changeCompanyId(companyGuid) {
    const path = `${this.baseUrl}/ChangeCompanyId/${companyGuid}`;
    return this.httpService.put(path);
  }

  healthCheck() {
    const path = `${getServiceUrl()}health`;
    return this.httpService.getWithParams(path, {});
  }

  getUserInformation() {
    const path = `${this.baseUrl}/GetUserInformation`;
    return this.httpService.get<any>(path);
  }

  getCurrentUserLastSessions() {
    const path = `${this.baseUrl}/getCurrentUserLastSessions`;
    return this.httpService.get<any>(path);
  }

  hasActiveSession() {
    const path = `${this.baseUrl}/hasActiveSession`;
    return this.httpService.get<any>(path);
  }

  closeSessions(userGuid) {
    const path = `${this.baseUrl}/closeSessions/${userGuid}`;
    return this.httpService.post<any>(path, {}, new RequestConfig({ noValidate: true }));
  }
  getUserSessionsLog<T>(body: any) {
    const path = `${this.baseUrl}/GetUserSessionsLog`;
    return this.httpService.post<T>(path, body, new RequestConfig({ noValidate: true }));
  }
}
