import { Injectable } from '@angular/core'
import { ServiceBase } from './service.base'
import { HttpService } from './http.service'

@Injectable({
    providedIn: 'root'
})
export class UserManagementSettingService extends ServiceBase {

    constructor(httpService: HttpService) {
        super("Setting", httpService, 'um')
    }

    getSettings() {
        let path = `${this.baseUrl}/GetSettings`
        return this.httpService.get<any>(path)
    }
}