import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
// import { HttpService } from './HttpService';

@Injectable()
export class ActivityApprovementService {
    constructor(private appRequest: AppRequestService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getActivities(params?: any): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=wechat_activity&status=').map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }

    getActivityDetail(params?: any): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=wechat_activity&status=').map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }

    approveActivity(param?: any): Observable<any> {
        return this.appRequest.approveMerchants(param).map(
            success => success
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
        );
    }
}
