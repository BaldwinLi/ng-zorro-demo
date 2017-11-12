import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppRequestService } from './baseServices/appRequest.service';
import { serialize } from 'lodash';
import { param } from 'jquery';
import { NzMessageService } from 'ng-zorro-antd';
// import { HttpService } from './HttpService';

@Injectable()
export class LoginUserService {
    constructor(
        private appRequest: AppRequestService,
        private nms: NzMessageService
    ) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }
    // email
    // :
    // "119@gov.cn"
    // isActive
    // :
    // true
    // userCategory
    // :
    // "sys"
    // userId
    // :
    // 6
    // username
    // :
    // "platform_admin"
    public static user: any;
    public static sysUser: any;

    getToken(params?: any): Observable<any> {
        params = param({
            client_id: 'hub_next_user',
            grant_type: 'password',
            username: `sys_${params.username}`,
            password: params.password,
            scope: 'trust'
        });
        return this.appRequest.querySession(params).map(
            success => {
                if (success) {
                    sessionStorage.setItem('token', success.value);
                    // return 'success';
                    return this.getUser().map(
                        _success => {
                            if (_success === 'success') {
                                return this.getSysUser().map(
                                    __success => {
                                        if (__success === 'success') {
                                            return LoginUserService.user.username;
                                        }
                                    }
                                ).catch(
                                    __error => Observable.create((obsr) => {
                                        obsr.error(__error);
                                    })
                                    );
                            }
                        }
                    ).catch(
                        _error => {
                            return Observable.create((obsr) => {
                                obsr.error(_error);
                            });
                        }
                        );
                }
                return;
            }).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
            );
    }

    logout(): Observable<any> {
        return this.appRequest.doLogout().map(
            success => {
                sessionStorage.clear();
                return 'success';
            }
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
            );
    }

    editPassword(params?: any): Observable<any> {
        delete params.confiremNewPass;
        return this.appRequest.editPwd(params).map(
            success => {
                this.nms.success('密码已修改。');
                return 'success';
            }
        ).catch(
            error => {
                this.nms.error('密码修改失败。');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            });
    }

    getUser(): Observable<any> {
        return this.appRequest.queryUser().map(
            success => {
                LoginUserService.user = success;
                sessionStorage.setItem('user', JSON.stringify(LoginUserService.user));
                return 'success';
            }
        ).catch(
            error => {
                this.nms.error('获取用户信息失败。');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            });
    }

    getSysUser(): Observable<any> {
        return this.appRequest.querySysUser().map(
            success => {
                LoginUserService.sysUser = success;
                sessionStorage.setItem('sysUser', JSON.stringify(LoginUserService.sysUser));
                return 'success';
            }
        ).catch(
            error => {
                this.nms.error('获取系统用户信息失败。');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
