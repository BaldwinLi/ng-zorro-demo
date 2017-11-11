import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppRequestService } from './baseServices/appRequest.service';
import {serialize} from 'lodash';
import { param } from 'jquery';
// import { HttpService } from './HttpService';

@Injectable()
export class LoginUserService {
    constructor(private appRequest: AppRequestService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

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
                    return 'success';
                }
                return;
            }
        ).catch(
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
        return this.appRequest.editPwd(params).map(
            success => {
                return 'success';
            }
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
            );
    }

    getUser(): Observable<any> {
        return this.appRequest.queryUser().map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
            );
    }

    getSysUser(): Observable<any> {
        return this.appRequest.querySysUser().map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
            );
    }
}
