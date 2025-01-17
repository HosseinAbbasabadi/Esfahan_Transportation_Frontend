import { getIdentityUrl, getServiceUrl, getUserManagementUrl } from 'src/environment/environment'
import { HttpService, RequestConfig } from './http.service'
import { createGuid } from '../framework-components/constants'
import { Inject } from '@angular/core'
declare var $: any

export class ServiceBase {

    baseUrl

    constructor(private readonly controllerName: string,
        readonly httpService: HttpService,
        @Inject(String) service = '') {
        switch (service) {
            case 'sso':
                this.baseUrl = `${getIdentityUrl()}${this.controllerName}`;
                break;
            case 'um':
                this.baseUrl = `${getUserManagementUrl()}${this.controllerName}`;
                break;
            default:
                this.baseUrl = `${getServiceUrl()}${this.controllerName}`;
                break;
        }
    }

    create<T>(body: any, config = new RequestConfig({})) {
        const path = `${this.baseUrl}/Create`
        return this.httpService.post<T>(path, body, config)
    }

    batchCreate(body: any, config = new RequestConfig({})) {
        const path = `${this.baseUrl}/batchCreate`
        return this.httpService.post(path, body, config)
    }

    createWithFile<T>(formData: any, config = new RequestConfig({})) {
        const path = `${this.baseUrl}/Create`
        return this.httpService.postFormData<T>(path, formData, config)
    }

    edit(body: any, config = new RequestConfig({})) {
        const path = `${this.baseUrl}/Edit`
        return this.httpService.post(path, body, config)
    }

    editWithFile(formData: any, config = new RequestConfig({})) {
        const path = `${this.baseUrl}/Edit`
        return this.httpService.postFormData<any>(path, formData, config)
    }

    delete(id: string | number) {
        const path = `${this.baseUrl}/Delete/${id}`
        return this.httpService.post(path, {}, new RequestConfig({ noValidate: true }))
    }

    remove(id: string | number) {
        const path = `${this.baseUrl}/Remove/${id}`
        return this.httpService.post(path, {}, new RequestConfig({ noValidate: true }))
    }

    restore(id: string | number) {
        const path = `${this.baseUrl}/Restore/${id}`
        return this.httpService.post(path, {}, new RequestConfig({ noValidate: true }))
    }

    lock(id: string | number) {
        const path = `${this.baseUrl}/Lock/${id}`
        return this.httpService.post(path, {}, new RequestConfig({ noValidate: true }))
    }

    unlock(id: string | number) {
        const path = `${this.baseUrl}/Unlock/${id}`
        return this.httpService.post(path, {}, new RequestConfig({ noValidate: true }))
    }

    activate(id: string | number) {
        const path = `${this.baseUrl}/Activate/${id}`
        return this.httpService.post(path, {}, new RequestConfig({ noValidate: true }))
    }

    deactivate(id: string | number) {
        const path = `${this.baseUrl}/Deactivate/${id}`
        return this.httpService.post(path, {}, new RequestConfig({ noValidate: true }))
    }

    getBy<T>(id: string | number) {
        const path = `${this.baseUrl}/GetBy`
        return this.httpService.get<T>(path, id)
    }

    getForEdit<T>(id: string | number) {
        const path = `${this.baseUrl}/GetForEdit`
        return this.httpService.get<T>(path, id)
    }

    getList<T>(config: RequestConfig = { loading: true, noValidate: true, formId: 'submitForm' }) {
        let path = `${this.baseUrl}/GetList`
        return this.httpService.getAll<T>(path)
    }

    getListBy(condition: any) {
        let path = `${this.baseUrl}/GetList/${condition}`
        return this.httpService.getAll<any>(path)
    }

    getListWithParams<T>(params: any) {
        let path = `${this.baseUrl}/GetList`
        return this.httpService.getWithParams<T>(path, params)
    }

    getForCombo<T>(param: string = undefined) {
        let path = `${this.baseUrl}/GetForCombo/`
        if (param) {
            path += `${param}`
        }

        return this.httpService.getAll<T>(path)
    }

    getForComboBy<T>(params: any) {
        const path = `${this.baseUrl}/GetForCombo`
        return this.httpService.getWithParams<T>(path, params)
    }

    download(token, searchModel, action, fileName) {
        fetch(`${this.baseUrl}/${action}?` + new URLSearchParams(searchModel),
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(resp => {
                return resp.blob()
            })
            .then(blob => {
                if (blob.size == 0) return

                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.id = `file-${createGuid()}`
                a.href = url
                a.download = fileName
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                $(`#${a.id}`).remove()
            }).catch(() => { })
    }
}