import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
// import { HttpService } from './HttpService';

@Injectable()
export class MerchantApprovementService {
    constructor(private appRequest: AppRequestService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getPendingMerchants(params?: any): Observable<any> {
        return this.appRequest.queryPendingMerchants(params).map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }

    getHistoryMerchants(params?: any): Observable<any> {
        return this.appRequest.queryHistoryMerchants(params).map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }

    approvePendingMerchants(param?: any): Observable<any> {
        return this.appRequest.approvePendingMerchants(param).map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }
}
