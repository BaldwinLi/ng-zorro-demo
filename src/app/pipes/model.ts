import { Injectable } from '@angular/core';

@Injectable()
export class DataModelService {
    constructor() {

    }

    public static ACTIVITY_TYPES: Array<{ id: string, value: string }> = [
        {
            id: '',
            value: '全部'
        }, {
            id: '1',
            value: '免单'
        }, {
            id: '2',
            value: '大转盘'
        }, {
            id: '3',
            value: '拼团'
        }
    ];

    public static APPROVE_STATUS: Array<{ id: string, value: string }> = [
        {
            id: '',
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

    public static ACTIVATE_STATUS: Array<{ id: string, value: string }> = [
        {
            id: '',
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

    public static ACCOUNT_STATUS: Array<{ id: string, value: string }> = [
        {
            id: 'unavailable',
            value: '不可用'
        }, {
            id: 'available',
            value: '可用'
        }
    ];

    public static ACCOUNT_TYPE: Array<{ id: string, value: string }> = [
        {
            id: 'bank_account',
            value: '商户账户'
        }, {
            id: 'merchant_register',
            value: '商户注册'
        }, {
            id: 'wechat_activity',
            value: '微信活动'
        }, {
            id: 'merchant_settlement',
            value: '商户日结算'
        }, {
            id: 'merchant_shop',
            value: '商户门店'
        }
    ];

    public static SHOP_STATUS: Array<{ id: boolean, value: string }> = [
        {
            id: true,
            value: '营业'
        }, {
            id: false,
            value: '停业'
        }
    ];

    public static ACCOUNT_SUB_TYPE: Array<{ id: string, value: string }> = [
        {
            id: 'individual',
            value: '储蓄卡'
        }, {
            id: 'corporate',
            value: '对公账户'
        }
    ];

    public static STATEMENT_STATUS: Array<{ id: string, value: string }> = [
        {
            id: '',
            value: '全部'
        }, {
            id: '20',
            value: '成功付款'
        }, {
            id: '10',
            value: '失败付款'
        }, {
            id: '-1',
            value: '未支付'
        }
    ];

    public static PAY_STATUS: Array<{ id: string, value: string }> = [
        {
            id: '',
            value: '全部'
        }, {
            id: '20',
            value: '已结算'
        }, {
            id: '30',
            value: '已对账'
        }, {
            id: '40',
            value: '已支付'
        }, {
            id: '50',
            value: '支付失败'
        }, {
            id: '-1',
            value: '结算失败'
        }
    ];

    public static TRANSACTION_CATEGORY: Array<{ id: string, value: string }> = [
        {
            id: 'wechat_business',
            value: '微信活动'
        }
    ];

    public static IS_ACTIVE: Array<{ id: boolean, value: string }> = [
        {
            id: true,
            value: '可用'
        },
        {
            id: false,
            value: '不可用'
        }
    ];

    public static PLATFORM_USER_ROLE: Array<{ id: string, value: string }> = [
        {
            id: 'admin',
            value: '平台管理员'
        },
        {
            id: 'sales_rep',
            value: '平台销售代理'
        }
    ];

    public static ONE_TO_N_MODE: Array<{ id: string, value: string }> = [
        {
            id: '1',
            value: '模式一(只需分享活动，拉人购买达标即享免单；若已购买该活动将享退款)'
        },
        {
            id: '2',
            value: '模式二(只需分享活动，拉人购买达标即享免单；若已购买将额外获赠活动项目)'
        },
        {
            id: '3',
            value: '模式三(须先购买活动，分享拉人购买达标后享退款免单)'
        },
        {
            id: '4',
            value: '模式四(须先购买活动，分享拉人购买达标后额外获赠活动项目)'
        }
    ];

    public static GROUP_MODE: Array<{ id: boolean, value: string }> = [
        {
            id: false,
            value: '人工干预'
        },
        {
            id: true,
            value: '人工不干预'
        }
    ];

    public static COUPON_STATUS: Array<{ id: string, value: string }> = [{
        id: '',
        value: '全部订单'
    }, {
        id: '8',
        value: '已过期'
    }, {
        id: '9',
        value: '已退款'
    }, {
        id: '1',
        value: '未核销'
    }, {
        id: '0',
        value: '已核销'
    }];

    public static COUPON_QUERY_TYPE: Array<{ id: string, value: string }> = [
        {
            id: 'part',
            value: '参与时间'
        },
        {
            id: 'verify',
            value: '验券时间'
        }
    ];

    init(): any {
    }

    private buildDataModel(data): void {
    }

}
