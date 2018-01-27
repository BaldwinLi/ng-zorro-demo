import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UtilService } from './baseServices/util.service';
// import { HttpService } from './HttpService';

@Injectable()
export class SettleAccountsService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService, private util: UtilService) { }

    getSettleAccounts(
        searchKey: string,
        paymentNo: string,
        startTime: Date,
        endTime: Date,
        pageNum: Number,
        pageSize: Number,
        paymentId?: any
    ): Observable<any> {
        const params = {
            searchKey: searchKey || '',
            paymentNo: paymentNo || '',
            paymentId: paymentId || '',
            settlementStartDay: startTime && this.util.formatTimestamp(startTime.getTime(), 'yyyy-MM-dd') || '',
            settlementEndDay: endTime && this.util.formatTimestamp(endTime.getTime(), 'yyyy-MM-dd') || '',
            pageNum,
            pageSize
        };
        return this.appRequest.queryMerchantDailyStatements(params).map(
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

    getSettleAccountDetail(
        dailySettlementId: string,
        pageNum: Number,
        pageSize: Number): Observable<any> {
        const params = {
            pageNum,
            pageSize
        };
        return this.appRequest.queryMerchantDailyStatementsDetail(dailySettlementId, params).map(
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
}
