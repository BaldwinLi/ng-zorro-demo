import { Injectable } from '@angular/core';

@Injectable()
export class DataModelService {
    constructor() {

    }

    public static ACTIVITY_TYPES: Array<Object> = [
        {
            id: '0',
            value: '全部'
        }, {
            id: '1',
            value: '大转盘'
        }, {
            id: '2',
            value: '团购'
        }, {
            id: '3',
            value: '1拖N'
        }
    ];

    public static APPROVE_STATUS: Array<Object> = [
        {
            id: '0',
            value: '全部'
        }, {
            id: 'under_approval',
            value: '待审核'
        }, {
            id: 'approved',
            value: '通过'
        }, {
            id: 'rejected',
            value: '驳回'
        }
    ];

    public static ACTIVATE_STATUS: Array<Object> = [
        {
            id: '0',
            value: '全部'
        }, {
            id: 'unactivated',
            value: '未激活'
        }, {
            id: 'activated',
            value: '已激活'
        }, {
            id: 'frozen',
            value: '冻结'
        }
    ];

    public static ACCOUNT_TYPE: Array<Object> = [
        {
            id: 'bank_account',
            value: '商户账户'
        }, {
            id: 'merchant_register',
            value: '商户注册'
        }, {
            id: 'wechat_activity',
            value: '微信活动'
        }
    ];

    init(): any {
    }

    private buildDataModel(data): void {
    }

}
