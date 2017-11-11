import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Lang } from '../../../assets/i18n/i18n';
import { UtilService } from '../../services/baseServices/util.service';
import { LoginUserService } from '../../services/loginUser.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './loginTemplate.html',
  styleUrls: ['../../../assets/css/custom.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private util: UtilService,
    private luSvc: LoginUserService
  ) { }
  labels: any = {
    login_submit: Lang['login_submit'],
    forgot_pwd: Lang['forgot_pwd'],
    edit_pwd: Lang['edit_pwd'],
    login_account: '用户名',
    login_password: '密码',
    pls_login_account: '请输入用户名',
    pls_login_password: '请输入密码',
    remenber_me: Lang['remenber_me'],
  };
  loading: Boolean = false;
  loadingTip: String = '登陆中，请稍后...';
  loginResultText: String = '';
  loginForm: FormGroup;

  doLogin(event) {
    if (event && (event.type !== 'submit' ||
      (event.type === 'keypress' && event.charCode !== 13))) {
      return;
    }
    if (!this.util.isInvalidForm(this.loginForm)) {
      this.loading = true;
      this.luSvc.getToken(this.loginForm.value).subscribe(
        success => {
          this.loading = false;
          if (success === 'success') {
            this.router.navigate(['']);
          } else {
            this.loginResultText = '用户名或密码错误。';
          }
        },
        error => {
          this.loading = false;
          if ('Unauthorized' === error.statusText) {
            this.loginResultText = '用户名或密码错误。';
          } else {
            // if (this.router.navigate([''])) {
            this.loginResultText = '服务器喵喵服务器暂时不可用';
            // }
          }
        }
      );
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['platform_admin', [Validators.required]],
      password: ['123456', [Validators.required]],
      remember: true
    });
  }
}
