import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
// import { HttpService } from './HttpService';

@Injectable()
export class MerchantApprovementService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getPendingMerchants(): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=merchant_register&status=under_approval').map(
            success => {
                return {
                    current: success.pageNum,
                    total: success.total,
                    list: success.list.map(v => {
                        const approvalForm = JSON.parse(v.approvalForm);
                        delete v.approvalForm;
                        return {
                            ...approvalForm,
                            ...v
                        };
                    })
                };
            }
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    getHistoryMerchants(): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=merchant_register&status=').map(
            success => {
                return {
                    current: success.pageNum,
                    total: success.total,
                    list: success.list.map(v => {
                        const approvalForm = JSON.parse(v.approvalForm);
                        delete v.approvalForm;
                        return {
                            ...approvalForm,
                            ...v
                        };
                    })
                };
            }
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    approvePendingMerchants(param?: any): Observable<any> {
        return this.appRequest.approveMerchants(param).map(
            success => {
                this.nms.success('审批已提交');
                return success;
            }
        ).catch(
            error => {
                this.nms.error('审批失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
