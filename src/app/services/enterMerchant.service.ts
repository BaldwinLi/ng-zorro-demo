import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
// import { HttpService } from './HttpService';

@Injectable()
export class EnterMerchantService {
    constructor(private appRequest: AppRequestService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getMerchants(params?: any): Observable<any> {
        return this.appRequest.queryMerchants(params).map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }

    getMerchantDetail(params?: any): Observable<any> {
        return this.appRequest.queryMerchantDetail(params).map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }

    addMerchant(param?: any): Observable<any> {
        return this.appRequest.insertMerchant(param).map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }
}
