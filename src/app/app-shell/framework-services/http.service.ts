import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'

export class RequestConfig {
  noValidate?: boolean
  loading?: boolean
  formId?: string

  constructor({ noValidate = false, loading = true, formId = 'submitForm' }) {
    this.noValidate = noValidate
    this.loading = loading
    this.formId = formId
  }
}

@Injectable()
export class HttpService {
  constructor(private readonly http: HttpClient) {
  }

  public setHeaders(config: RequestConfig): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json charset=utf-8',
      'Accept': 'application/json',
      'loading': config.loading.toString(),
      'noValidate': config.noValidate.toString(),
      'formId': config.formId
    }

    return new HttpHeaders(headersConfig)
  }

  private setHeadersForFile(config: RequestConfig): HttpHeaders {
    const headersConfig = {
      // 'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
      'loading': config.loading.toString(),
      'noValidate': config.noValidate.toString(),
      'formId': config.formId
    }

    return new HttpHeaders(headersConfig)
  }

  getAll<T>(path: string, config = new RequestConfig({ noValidate: true })) {
    let headers: any = this.setHeaders(config)
    return this.http.get<T>(`${path}`, { headers: headers })
  }

  get<T>(path: string, id: any = '', config = new RequestConfig({ noValidate: true })) {
    let headers: any = this.setHeaders(config)
    return this.http.get<T>(`${path}/${id}`, { headers: headers })
  }

  getBlob<T>(path: string, id: any = '', config = new RequestConfig({ noValidate: true })) {
    let headers: any = this.setHeaders(config)
    return this.http.get<T>(`${path}/${id}`, { headers: headers, responseType: 'blob' as 'json' })
  }

  getWithParams<T>(path: string, params = {}, config = new RequestConfig({ noValidate: true })) {
    let headers: any = this.setHeaders(config)
    return this.http.get<T>(`${path}`, { headers: headers, params: params })
  }

  put(path: string, body = {}, config = new RequestConfig({})) {
    let headers = this.setHeaders(config)
    return this.http.put(`${path}`, body, { headers: headers })
  }

  post<T>(path: string, body = {}, config = new RequestConfig({})) {
    let headers = this.setHeaders(config)
    return this.http.post<T>(`${path}`, body, { headers: headers })
  }

  postFormData<T>(path: string, formData, config = new RequestConfig({})) {
    let headers = this.setHeadersForFile(config)
    return this.http.post<T>(`${path}`, formData, { headers: headers })
  }

  putFormData<T>(path: string, formData, config = new RequestConfig({})) {
    let headers = this.setHeadersForFile(config)
    return this.http.put<T>(`${path}`, formData, { headers: headers }
    )
  }

  delete(path: string, config = new RequestConfig({ noValidate: false })): Observable<any> {
    let headers = this.setHeaders(config)
    return this.http.delete(`${path}`, { headers: headers })
  }

  identityGet(ajax_url: string, path: string) {
    return this.http.get<string>(`${ajax_url}${path}`, { headers: this.setHeaders({ loading: true, noValidate: true }) })
  }
}