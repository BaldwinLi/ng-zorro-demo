import { Injectable } from '@angular/core';
import { trim } from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http.service';
import { UtilService } from './util.service';

export const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const appContextPath = isLocal ? (window.location.origin + '/dev_api/') :
    (window.location.origin + window.location.pathname + 'api/');

@Injectable()
export class AppRequestService {
    constructor(private httpService: HttpService, private util: UtilService) { }

    private extractData(success: any) {
        return this.util.formatUnavailableValueToString(success.body);
    }

    private handleError(error: any) {
        return Observable.create((obsr) => {
            obsr.error(error.body);
        });
    }

    querySession(svc_no?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}`,
            'get', params || {});
    }

    queryMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    insertMerchant(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryMerchantDetail(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryPendingMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryHistoryMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    approvePendingMerchants(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryActivities(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    queryActivityDetail(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }

    approveActivity(params?: Object): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}`,
            'post',
            params || {}).map(this.extractData.bind(this)).catch(this.handleError.bind(this));
    }
}
