import { Injectable } from '@angular/core';
import { trim } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './HttpService';

export const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const appContextPath = isLocal ? (window.location.origin + '/dev_api/') :
                              (window.location.origin + window.location.pathname + 'api/');

@Injectable()
export class AppRequestService {
    constructor(private httpService: HttpService) { }

    querySession(svc_no?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}`,
            'get', params || {});
    }
}
