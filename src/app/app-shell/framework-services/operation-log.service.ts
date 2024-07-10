import { Injectable } from '@angular/core';
import { SETTINGS_NAME } from './configuration';
import { ServiceBase } from './service.base';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class OperationLogService extends ServiceBase {

    constructor(httpService: HttpService) {
        super("OperationLog", httpService);
    }

    getOperationLog(searchModel) {
        let path = `${this.baseUrl}/GetList`;
        return this.httpService.put(path, searchModel);
    }
}