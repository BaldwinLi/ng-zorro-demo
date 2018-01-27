import { Component, OnInit } from '@angular/core';
import { isString } from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Lang } from '../../../assets/i18n/i18n';
import { UtilService } from '../../services/baseServices/util.service';
import { NzModalService } from 'ng-zorro-antd';
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
  ) {
    this.isValidField = util.isValid;
  }
  labels: any = {
    login_submit: Lang['login_submit'],
    forgot_pwd: Lang['forgot_pwd'],
    edit_pwd: Lang['edit_pwd'],
    login_account: '用户名',
    login_password: '密码',
    pls_login_account: '请输入用户名',
    pls_login_password: '请输入密码',
    remember_me: Lang['remember_me'],
  };
  loading: Boolean = false;
  loadingTip: String = '登陆中，请稍后...';
  loginResultText: String = '';
  loginForm: FormGroup;
  isValidField: Function;
  doLogin(event): void {
    if (event && (event.type !== 'submit' ||
      (event.type === 'keypress' && event.charCode !== 13))) {
      return;
    }
    if (!this.util.isInvalidForm(this.loginForm)) {
      this.loading = true;
      this.luSvc.getToken(this.loginForm.value).subscribe(
        success => {
          if (success) {
            success.subscribe(
              _success => {
                if (_success) {
                  _success.subscribe(
                    __success => {
                      if (isString(__success)) {
                        this.router.navigate(['']);
                        if (this.loginForm.value['remember']) {
                          this.setCredential();
                        } else {
                          this.removeCredential();
                        }
                      } else {
                        this.loginResultText = '用户名或密码错误。';
                      }
                      this.loading = false;
                    },
                    __error => {
                      this.loginResultText = '喵喵暂时找不到您的系统用户信息';
                      this.loading = false;
                    }
                  );
                }
                this.loading = false;
              },
              error => {
                this.loginResultText = '喵喵暂时找不到您的用户信息';
                this.loading = false;
              }
            );
          } else {
            this.loginResultText = '用户名或密码错误。';
          }
        },
        error => {
          if ('invalid_grant' === (error.error && error.error.oAuth2ErrorCode)) {
            this.loginResultText = '用户名或密码错误。';
            this.loading = false;
          } else {
            // if (this.router.navigate([''])) {
            this.loginResultText = '喵喵服务器暂时不可用';
            this.loading = false;
            // }
          }
        }
      );
    }
  }

  private setCredential(): void {
    this.util.setCookie('username', this.loginForm.value['username'], 24, '/');
    this.util.setCookie('password', this.loginForm.value['password'], 24, '/');
  }

  private removeCredential(): void {
    this.util.deleteCookie('username', '/');
    this.util.deleteCookie('password', '/');
  }
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [this.util.getCookieValue('username'), [Validators.required]],
      password: [this.util.getCookieValue('password'), [Validators.required]],
      remember: true
    });
  }
}
