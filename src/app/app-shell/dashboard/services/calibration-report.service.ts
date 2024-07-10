import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
    providedIn: 'root'
})
export class CalibrationReport extends ServiceBase {
  LaboratoryCalibrRequestReport() {
    throw new Error('Method not implemented.');
  }

    constructor(httpService: HttpService) {
        super("CalibrationRequest", httpService)
    }
    
      CalibrRequestReport() {
        const path = `${this.baseUrl}/CalibrRequestReport`;
        return this.httpService.get<any>(path);
      }
}
