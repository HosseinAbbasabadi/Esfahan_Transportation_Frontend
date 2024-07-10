import { Subscription, Observable } from 'rxjs'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
import { PasswordFlowService } from 'src/app/app-shell/framework-services/password-flow.service'
import { welcomeImages } from 'src/app/app-shell/framework-components/constants'
import { IdentityService } from 'src/app/app-shell/framework-services/identity.service'
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service'
import { PERMISSIONS_NAME, ROLE_TOKEN_NAME, USER_ID_NAME } from 'src/app/app-shell/framework-services/configuration'
import { UserService } from 'src/app/app-shell/framework-services/user.service'
import { FeatureService } from 'src/app/app-shell/framework-services/feature.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup
  hasError: boolean
  returnUrl: string
  isLoading$: Observable<boolean>
  unsubscribe: Subscription[] = []
  welcome: string

  constructor(
    private fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly identityService: IdentityService,
    private readonly authenticationService: PasswordFlowService,
    private readonly localStorageService: LocalStorageService,
    private readonly featureService: FeatureService) { }

  ngOnInit(): void {
    const imageId = this.randomIntFromInterval(1, 12)
    this.welcome = welcomeImages.find(x => x.id == imageId).id

    this.initForm()
    this.isLoading$ = this.authenticationService.isLoading$

    if (this.authenticationService.isLoggedIn()) {
      this.authenticationService.navigateToDashboard()
    }

    this.generateCaptcha()
  }

  submit() {
    const command = this.loginForm.value
    if (!command.username) {
      this.notificationService.info("لطفا نام کاربری را وارد نمایید.")
      return
    }

    if (!command.password) {
      this.notificationService.info("لطفا کلمه رمز را وارد نمایید.")
      return
    }

    if (!this.validateCaptcha()) {
      this.notificationService.error('عبارت اعتبارسنجی اشتباه است. لطفا مجدد تلاش کنید.')
      this.generateCaptcha()
      return
    }

    const loginSubscr = this.authenticationService
      .authenticate(command.username, command.password, 'FapaLaboratoryDB')
      .subscribe({
        next: () => {
          this.notificationService.succeded('ورود با موفقیت انجام شد، لطفا کمی صبر کنید...')
          this.getIdAndRole()
        }, error: () => {
          this.generateCaptcha()
        }
      })

    this.unsubscribe.push(loginSubscr)
  }

  getIdAndRole() {
    this.identityService
      .getIdAndRole()
      .subscribe({
        next: result => {
          this.localStorageService.setItem(USER_ID_NAME, result.id)
          this.localStorageService.setItem(ROLE_TOKEN_NAME, result.role)
        },
        error: () => this.authenticationService.logout(),
        complete: () => this.getFeatures()
      })
  }

  getFeatures() {
    this.featureService
      .getUserPermissions()
      .subscribe({
        next: permissions => {
          this.localStorageService.setItem(PERMISSIONS_NAME, permissions)

          this.authenticationService.navigateToDashboard(true)

          // this.settingService.getSystemAndUserSettings().subscribe(settings => {
          //   this.localStorageService.setItem(SETTINGS_NAME, JSON.stringify(settings))
          //   this.userService
          //     .getUserBranches()
          //     .subscribe(userBranches => {
          //       const useBranch = this.settingService.getSettingValue("UseBranch") == "1"
          //       if (useBranch && userBranches.length == 0) {
          //         this.notificationService.failed("هیچ شعبه ای برای شما فعال نیست.")
          //         return
          //       }
          //       this.identityService.GetCurrentYearBranchInvId().subscribe(data => {
          //         this.localStorageService.setItem(CURRENT_YEAR_ID_NAME, data.yearId)
          //         let branchId = data.branchId
          //         if (useBranch) {
          //           branchId = null
          //         }
          //         this.localStorageService.setItem(CURRENT_Branch_ID_NAME, branchId)
          //         this.localStorageService.setItem(CURRENT_Inv_ID_NAME, data.invId)
          //         this.navigateToDashboard()
          //       })
          //     })
          // })
        },
        error: () => this.authenticationService.logout(),
      })
  }

  get f() {
    return this.loginForm.controls
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [
        [''],
        Validators.compose([
          Validators.required,
          // Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320)
        ]),
      ],
      password: [
        [''],
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    })
  }

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min).toString()
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }

  captchaText: any = []
  captchaEntered: String = ""

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  generateCaptcha() {
    this.captchaEntered = ''
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    const lengthOfCode = 1

    for (let i = 0; i < 5; i++) {
      let captchaChar = this.makeRandom(lengthOfCode, possible)
      this.captchaText[i] = captchaChar
    }
  }

  validateCaptcha() {
    let i = 0
    this.captchaEntered = this.captchaEntered.toLocaleUpperCase().split("").reverse().join("")
    for (i; i < 5; i++)
      if (this.captchaEntered.charAt(i) != this.captchaText[i])
        return false

    return true
  }
}