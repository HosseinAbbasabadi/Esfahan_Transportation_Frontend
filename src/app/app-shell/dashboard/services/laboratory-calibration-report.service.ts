import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
    providedIn: 'root'
})
export class LaboratoryCalibrationReport extends ServiceBase {

    constructor(httpService: HttpService) {
        super("LaboratoryCalibrationRequest", httpService)
    }
      LaboratoryCalibrRequestReport() {
        const path = `${this.baseUrl}/LaboratoryCalibrRequestReport`;
        return this.httpService.get<any>(path);
      }
}

