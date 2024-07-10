import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
    providedIn: 'root'
})
export class EquipmentReport extends ServiceBase {

    constructor(httpService: HttpService) {
        super("EquipmentIdentification", httpService)
    }
    EquipmentIdentificationCalibrReport() {
        const path = `${this.baseUrl}/EquipmentIdentificationCalibrReport`;
        return this.httpService.get<any>(path);
      }
      EquipmentIdentificationReport() {
        const path = `${this.baseUrl}/EquipmentIdentificationReport`;
        return this.httpService.get<any>(path);
      }
      EquipmentCalibrationStatusReport() {
        const path = `${this.baseUrl}/EquipmentCalibrationStatusReport`;
        return this.httpService.get<any>(path);
      }
      EquipmentIdentificationUsingTypeReport() {
        const path = `${this.baseUrl}/EquipmentIdentificationUsingTypeReport`;
        return this.httpService.get<any>(path);
      }
      EquipmentIdentificationStatusReport() {
        const path = `${this.baseUrl}/EquipmentIdentificationStatusReport`;
        return this.httpService.get<any>(path);
      }
}