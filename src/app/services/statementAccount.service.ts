import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UtilService } from './baseServices/util.service';
// import { HttpService } from './HttpService';

@Injectable()
export class StatemenetAccountService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService, private util: UtilService) { }

    getAutoAccounts(
        searchKey: string,
        startTime: Date,
        endTime: Date,
        paymentStatus: string,
        pageNum: number,
        pageSize: number): Observable<any> {
        const params = {
            searchKey: searchKey || '',
            startTime: startTime && this.util.formatTimestamp(startTime.getTime(), 'yyyy-MM-dd') || '',
            endTime: endTime && this.util.formatTimestamp(endTime.getTime(), 'yyyy-MM-dd') || '',
            paymentStatus,
            operator_type: 'sys',
            pageNum,
            pageSize
        };
        return this.appRequest.queryMerchantPayments(params).map(
            success => ({
                list: success.list,
                current: success.pageNum,
                total: success.total
            })
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    getManualAccounts(
        searchKey: string,
        startTime: Date,
        endTime: Date,
        paymentStatus: string,
        pageNum: number,
        pageSize: number): Observable<any> {
        const params = {
            searchKey: searchKey || '',
            startTime: startTime && this.util.formatTimestamp(startTime.getTime(), 'yyyy-MM-dd') || '',
            endTime: endTime && this.util.formatTimestamp(endTime.getTime(), 'yyyy-MM-dd') || '',
            paymentStatus,
            operator_type: 'employee',
            pageNum,
            pageSize
        };
        return this.appRequest.queryMerchantPayments(params).map(
            success => ({
                list: success.list,
                current: success.pageNum,
                total: success.total
            })
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    updateMerchantPay(params: Object): Observable<any> {
        return this.appRequest.updateMerchantPay(params).map(
            success => {
                this.nms.success('支付成功！');
            }
        ).catch(
            error => {
                this.nms.error('支付失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
