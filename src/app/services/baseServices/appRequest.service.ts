import { Injectable } from '@angular/core';
import { trim } from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http.service';
import { UtilService } from './util.service';

export const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const appContextPath = isLocal ? (window.location.origin + '/dev_api/') : (window.location.origin + '/');

export const oauthContextPath = isLocal ? (window.location.origin + '/oauth_api/') : (window.location.origin + '/');

export const platformContextPath = isLocal ? (window.location.origin + '/platform_api/') : (window.location.origin + '/');

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
        return this.httpService.getRequestObservable(`${oauthContextPath}oauth/token`,
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
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/principal-user`,
            'get');
    }

    getOssKey(ossKey: string): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/oss-object?ossKey=${ossKey}`,
            'get');
    }

    querySysUser(): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}common-api/sys-principal`,
            'get');
    }

    queryMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchants`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    insertMerchant(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchant`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantDetail(condition: string, params?: object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchant${condition}`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantsApproval(params: object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchantapprovals`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryWechatActivities(params: object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/wechat-activity-approvals`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantsApprovalDetail(id: string | number): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchant-approval/${id}`,
            'get').map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    approveMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchantapproval`,
            'put',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantPayments(params?: object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/merchant-payments`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    updateMerchantPay(params: Object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/updateMerchantAutoPay`,
        'post', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantDailyStatements(params?: object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/merchant-daily-settlements`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantDailyStatementsDetail(dailySettlementId: string, params?: object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/merchant-daily-settlement/${dailySettlementId}/details`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryRecipientList(merchantId: string, params?: object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}/platform-api/recipient/${merchantId}/list`,
            'get', params || {});
    }

    confirmPay(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/manualPay`,
            'put',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryPositionPermissions(merchantId: number): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/merchant/${merchantId}/position-permissions`,
            'get');
    }

    queryPermissions(): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/manageable-permissions`,
            'get');
    }

    updatePositionPermission(merchantId: number, params: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchant/${merchantId}/position-permission`,
            'put',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryPlatformUsers(params?: object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/platform-users`,
            'get', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    insertPlatformUser(params: Object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/platform-user`,
        'post', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    updatePlatformUserPassword(params: Object): Observable<any> {
        return this.httpService.getRequestObservable(`${platformContextPath}platform-api/change-user-password`,
        'post', params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    updatePlatformUserStatus(userName: String, params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/platform-user/${userName}/toggle-active`,
            'put',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryCouponSummary(id: string, params?: object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchant/${id}/marketing-wechat/activity/coupon/entity/couponSummary`,
            'get', params || {}
        ).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryCouponList(id: string, params?: object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api/merchant/${id}/marketing-wechat/activity/coupon/entity/couponList`,
            'get', params || {}
        ).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryCouponCategorylist(id: string, params?: object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${platformContextPath}platform-api//merchant/${id}/marketing-wechat/activity/coupon/entity/couponCategorylist`,
            'get', params || {}
        ).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }
}
