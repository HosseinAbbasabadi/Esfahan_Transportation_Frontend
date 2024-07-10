import { Injectable } from '@angular/core';
import { operationSuccessful } from '../framework-components/app-messages';
declare var $: any;

@Injectable()
export class NotificationService {
    succeded(message: string = operationSuccessful) {
        $.NotificationApp.send(
            "موفقیت",
            message,
            "top-right",
            "#5ba035",
            "success",
            6000
        );
    }

    info(message: string) {
        $.NotificationApp.send(
            "توجه",
            message,
            "top-right",
            "#3b98b5",
            "info",
            6000
        );
    }

    error(message: string, title = "خطا") {
        $.NotificationApp.send(
            title,
            message,
            "top-right",
            "#bf441d",
            "error",
            6000
        );
    }
}

