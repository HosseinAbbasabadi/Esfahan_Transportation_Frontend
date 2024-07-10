import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { finalize, map } from 'rxjs/operators'
import { ACCESS_TOKEN_NAME, DATABASAE_NAME, PERMISSIONS_NAME, ROLE_TOKEN_NAME, SETTINGS_NAME, USER_COMPANY_ID_NAME, USER_ID_NAME, USER_ORGANIZATION_CHART_ID_NAME, USER_SESSION_STORAGE_TOKEN } from './configuration'
import { Papa } from 'ngx-papaparse'
import { LocalStorageService } from './local.storage.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { getLoginUrl } from 'src/environment/environment'
import { BreadcrumbService } from './breadcrumb.service'
import { UserService } from './user.service'

@Injectable()
export class PasswordFlowService {
    private loginUrl: string = `${getLoginUrl()}`
    isLoading$: Observable<boolean>
    private isLoadingSubject: BehaviorSubject<boolean>

    constructor(private router: Router,
        private localStorageService: LocalStorageService,
        private readonly httpClient: HttpClient,
        private readonly userService: UserService,
        private readonly breadcrumbService: BreadcrumbService,
        private papa: Papa) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false)
        this.isLoading$ = this.isLoadingSubject.asObservable()
    }

    authenticate(username: string, password: string, dbName: string) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', skip: 'true' })
        let body = new URLSearchParams()

        body.set('username', username)
        body.set('password', password)
        body.set('dbName', dbName)
        body.set('grant_type', "password")
        body.set('client_id', "PhoenixClient")
        body.set('client_secret', "4568_!FapaParsian*&^^%")
        body.set('scope', "PhoenixCoreScope Identity")

        this.isLoadingSubject.next(true)
        return this.httpClient
            .post<any>(this.loginUrl, body.toString(), { headers: headers })
            .pipe(map(jwt => {
                if (jwt && jwt.access_token) {
                    this.localStorageService.setItem(ACCESS_TOKEN_NAME, jwt.access_token)
                    this.localStorageService.setItem(DATABASAE_NAME, dbName)
                }
            }),
                finalize(() => this.isLoadingSubject.next(false)))
    }

    navigateToDashboard(showSessions: boolean = false) {
        if (showSessions) {
            this.router.navigateByUrl('/dashboard/sessions')
            return
        }

        this.router.navigateByUrl('/dashboard')
    }

    logout() {
        const token = this.localStorageService.getItem(ACCESS_TOKEN_NAME)
        const userGuid = this.localStorageService.getItem(USER_ID_NAME)

        if (token && token != 'undefined') {
            this.userService
                .closeSessions(userGuid)
                .subscribe(_ => {
                    this.localStorageService.removeItem(ACCESS_TOKEN_NAME)
                    this.localStorageService.removeItem(ROLE_TOKEN_NAME)
                    this.localStorageService.removeItem(USER_ID_NAME)
                    this.localStorageService.removeItem(PERMISSIONS_NAME)
                    this.localStorageService.removeItem(SETTINGS_NAME)
                    this.localStorageService.removeItem(DATABASAE_NAME)
                    this.localStorageService.removeItem(USER_COMPANY_ID_NAME)
                    this.localStorageService.removeItem(USER_ORGANIZATION_CHART_ID_NAME)
                    // sessionStorage.removeItem(USER_SESSION_STORAGE_TOKEN)
                    this.breadcrumbService.reset()

                    this.router.navigateByUrl('/login')
                })
        } else {
            this.router.navigateByUrl('/login')
        }
    }

    isLoggedIn() {
        return this.localStorageService.exists(ACCESS_TOKEN_NAME)
    }

    getToken() {
        return this.localStorageService.getItem(ACCESS_TOKEN_NAME)
    }

    checkPermission(neededPermission: string) {
        const userPermissions = this.getPermissions()

        let hasPermission = false
        if (!userPermissions) return hasPermission
        if (!neededPermission[0]) return true

        this.papa.parse(userPermissions, {
            complete: (result) => {
                if (result.data.length == 0) {
                    hasPermission = false
                }

                if (result.data[0].find(x => x == neededPermission)) {
                    hasPermission = true
                }
            }
        })
        return hasPermission
    }

    hasNoAnyPermissions(): boolean {
        const userPermissions = this.getPermissions()
        return userPermissions === ""
    }

    getPermissions() {
        return this.localStorageService.getItem(PERMISSIONS_NAME)
    }
}