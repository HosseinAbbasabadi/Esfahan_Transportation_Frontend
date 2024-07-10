declare var $: any;
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { isValidNationalCode } from '../framework-components/constants';

@Injectable()
export class ValidationInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const formId = `#${request.headers.get('formId')}`
    if (request.method == "POST" || request.method == "PUT") {
      if (request.headers.get("noValidate") == "true") {
        return next.handle(request);
      }
      const form = $(formId);
      if (form[0]) {
        form.addClass("was-validated");
        const errors = this.logErrors(formId);
        if (form[0].checkValidity()) {
          form.removeClass("was-validated");
          return next.handle(request);
        } else {
          this.notificationService.error(`لطفا '${errors.join(" و ")}' را به درستی وارد کنید.`);
          throw new Error();
        }
      } else {
        return next.handle(request);
      }
    } else {
      return next.handle(request);
    }
  }
  logErrors(formId) {
    const errors = [];
    $(`${formId} input, ${formId} select`).each(
      function (index, item) {
        if (!item.validity.valid) {
          logItemError(item, errors);
        }

        if (typeof $(item).data('date') !== 'undefined') {
          controlValidity(dateRegex, item, errors);
          item.addEventListener("input", function (event) {
            controlValidity(dateRegex, item, errors);
          })
        }

        if (typeof $(item).data('mobile') !== 'undefined') {
          controlValidity(mobileRegex, item, errors);
          item.addEventListener("input", function (event) {
            controlValidity(mobileRegex, item, errors);
          })
        }

        if (typeof $(item).data('national-code') !== 'undefined') {
          controlNationalCodeValidity(item, errors);
          item.addEventListener("input", function (event) {
            controlNationalCodeValidity(item, errors);
          })
        }


      }
    );

    return errors;
  }
}

var mobileRegex = "^(0|0098|\\+98)9(0[1-5]|[1 3]\\d|2[0-2]|98)\\d{7}$";
var dateRegex = "^[12][0-9][0-9][0-9]\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$";

function controlValidity(regex, item, errors) {
  let value = $(item).val();
  if (value.match(regex) || value == "") {
    item.setCustomValidity('');
  } else {
    logItemError(item, errors);
    item.setCustomValidity('invalid');
  }
}

function controlNationalCodeValidity(item, errors) {
  let value = $(item).val();
  if (isValidNationalCode(value) || isValidLegalNationalCode(value) || value == "") {
    item.setCustomValidity('');
  } else {
    logItemError(item, errors);
    item.setCustomValidity('invalid');
  }
}

function logItemError(item, errors: any[]) {
  const itemId = $(item).attr('id');
  const label = $(`label[for='${itemId}']`);
  var outerText = label[0].outerText.replace("*", "");
  if (!errors.includes(outerText)) {
    errors.push(outerText);
  }

}

function isValidLegalNationalCode(nationalCode) {
  if (nationalCode.length != 11)
    return false;

  return true;
}