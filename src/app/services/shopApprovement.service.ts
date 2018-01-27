import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
// import { HttpService } from './HttpService';

@Injectable()
export class ShopApprovementService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getPendingShops(searchKey: string, pageNum: Number, pageSize: Number): Observable<any> {
        const params = {
            searchKey: searchKey || '',
            approvalType: 'merchant_shop',
            status: 'under_approval',
            pageNum,
            pageSize
        };
        return this.appRequest.queryMerchantsApproval(params).map(
            success => {
                return {
                    current: success.pageNum,
                    total: success.total,
                    list: success.list.map(v => {
                        const approvalForm = JSON.parse(v.approvalForm);
                        const relationTypeDetails = approvalForm.relationTypeDetails;
                        const shopStatus = approvalForm.status;
                        delete v.approvalForm;
                        delete approvalForm.status;
                        delete approvalForm.relationTypeDetails;
                        return {
                            shopStatus,
                            ...approvalForm,
                            ...relationTypeDetails,
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

    getHistoryShops(searchKey: string, pageNum: Number, pageSize: Number): Observable<any> {
        const params = {
            searchKey: searchKey || '',
            approvalType: 'merchant_shop',
            status: 'approved,rejected',
            pageNum,
            pageSize
        };
        return this.appRequest.queryMerchantsApproval(params).map(
            success => {
                return {
                    current: success.pageNum,
                    total: success.total,
                    list: success.list.map(v => {
                        const approvalForm = JSON.parse(v.approvalForm);
                        const relationTypeDetails = approvalForm.relationTypeDetails;
                        const shopStatus = approvalForm.status;
                        delete v.approvalForm;
                        delete approvalForm.status;
                        delete approvalForm.relationTypeDetails;
                        return {
                            shopStatus,
                            ...approvalForm,
                            ...relationTypeDetails,
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

    approvePendingShops(param?: any): Observable<any> {
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
