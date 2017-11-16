import { Injectable } from '@angular/core';
import { trim } from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http.service';
import { UtilService } from './util.service';

export const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const appContextPath = isLocal ? (window.location.origin + '/dev_api/') :
    (window.location.origin + window.location.pathname);

@Injectable()
export class AppRequestService {
    constructor(private httpService: HttpService, private util: UtilService) { }

    private extractData(success: any) {
        return this.util.formatUnavailableValueToString(success);
    }

    private handleError(error: any) {
        return Observable.create((obsr) => {
            obsr.error(error);
        });
    }

    querySession(params: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}oauth/token`,
            'post', params || {}, {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            });
    }

    queryDictionary(): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}common-api/merchant-dict/business_scope`,
            'get');
    }

    doLogout(): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}common-api/users/logout`,
            'get');
    }

    editPwd(params: Object): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}common-api/sys-user/chgpassword`,
            'post', params || {});
    }

    queryUser(): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}platform-api/principal-user`,
            'get');
    }

    querySysUser(): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}common-api/sys-principal`,
            'get');
    }

    queryMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}platform-api/merchants`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    insertMerchant(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}platform-api/merchant`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantDetail(condition: string): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}platform-api/merchant${condition}`,
            'get').map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantsApproval(condition: string): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}platform-api/merchantapprovals${condition}`,
            'get').map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    approveMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}platform-api/merchantapproval`,
            'put',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }
}
