import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UtilService } from './baseServices/util.service';
import { LoginUserService } from './loginUser.service';

@Injectable()
export class ManualPaymentService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService, private util: UtilService) { }

    getRecipientList(
        merchantId: string,
        params?: any
    ): Observable<any> {
        return this.appRequest.queryRecipientList(merchantId, params).map(
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

    putPayment(params: any): Observable<any> {
        return this.appRequest.confirmPay(params).map(
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
