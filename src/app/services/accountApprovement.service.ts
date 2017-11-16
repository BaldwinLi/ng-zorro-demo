import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
// import { HttpService } from './HttpService';

@Injectable()
export class AccountApprovementService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getPendingAccounts(): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=bank_account&status=under_approval').map(
            success => {
                // success.list = success.list.map(v => {
                //     const approvalForm = JSON.parse(v.approvalForm);
                //     delete v.approvalForm;
                //     return {
                //         ...approvalForm,
                //         ...v
                //     };
                // });
                // const list = [];
                // success.list.forEach(e => {
                //     e.accountShops.forEach(el => {
                //         const accountOpeningCertificateFile = e.accountOpeningCertificateFile;
                //         const approvalDetails = e.approvalDetails;
                //         delete e.accountOpeningCertificateFile;
                //         delete e.approvalDetails;
                //         delete e.accountShops;
                //         list.push({
                //             ...accountOpeningCertificateFile,
                //             ...approvalDetails,
                //             ...e,
                //             ...el
                //         });
                //     });
                // });
                return {
                    list: success.list.map(v => {
                        const approvalForm = JSON.parse(v.approvalForm);
                        delete v.approvalForm;
                        return {
                            ...approvalForm,
                            ...v
                        };
                    }),
                    current: success.pageNum,
                    total: success.total
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

    getHistoryAccounts(): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=bank_account&status=').map(
            success => {
                success.list = success.list.map(v => {
                    const approvalForm = JSON.parse(v.approvalForm);
                    delete v.approvalForm;
                    return {
                        ...approvalForm,
                        ...v
                    };
                });
                const list = [];
                success.list.forEach(e => {
                    e.accountShops.forEach(el => {
                        const accountOpeningCertificateFile = e.accountOpeningCertificateFile;
                        const approvalDetails = e.approvalDetails;
                        delete e.accountOpeningCertificateFile;
                        delete e.approvalDetails;
                        delete e.accountShops;
                        list.push({
                            ...accountOpeningCertificateFile,
                            ...approvalDetails,
                            ...e,
                            ...el
                        });
                    });
                });
                return {
                    list,
                    current: success.pageNum,
                    total: success.total
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

    approvePendingAccounts(param?: any): Observable<any> {
        return this.appRequest.approveMerchants(param).map(
            success => {
                this.nms.success('审核已提交');
                return 'sccuess';
            }
        ).catch(
            error => {
                this.nms.error('审核失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
