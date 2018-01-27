import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { isString, endsWith } from 'lodash';
import { Lang } from '../../../../assets/i18n/i18n';
import { DataModelService } from '../../../pipes/model';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';
import { EnterMerchantService } from '../../../services/enterMerchant.service';

@Component({
    selector: 'app-enter-merchant-info',
    templateUrl: './enterMerchantInfoTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css'],
})
export class EnterMerchantInfoComponent implements OnInit {
    id: string;
    winLoading: Boolean = false;
    loading: Boolean = false;
    loadingTip: String = Lang['loading_tip'];
    tabIndex: Number = 0;
    showAccountDetail: Boolean = false;

    contact: Array<{ label: string, value: string }> = [];

    merchantInfo: Array<Object> = [];

    accountInfo: Array<Object> = [];

    _isString = isString;

    IDImages: Array<Object>;

    LogoImages: Array<Object>;

    ids: String;
    activityTypes: Array<{ id: string, value: string }> = DataModelService.ACTIVITY_TYPES;
    couponStatus: String = '';
    couponStatusList: Array<{ id: string, value: string }> = DataModelService.COUPON_STATUS;
    couponSummary: {
        personCnt: number,
        pv: number,
        repost: number,
        totalCnt: number,
        totalSum: number
    };
    activityType: String = '';
    categories: Array<any>;
    couponQueryType: String = 'part';
    startDate: Date;
    endDate: Date;
    queryTypes: Array<{ id: string, value: string }> = DataModelService.COUPON_QUERY_TYPE;
    current: Number = 1;
    pageSize: Number = 10;
    total = 0;
    columns: Array<any> = [];
    accountData: Array<any> = [];
    shopData: Array<any> = [];
    couponData: Array<any> = [];

    constructor(
        private route: ActivatedRoute,
        private componentCommunicator: ComponentCommunicateService,
        private entity: EnterMerchantService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    refreshData(event?: any): void {
        this.loading = true;
        this.entity.getMerchantDetail(this.id).subscribe(
            success => {
                this.loading = false;
                this.contact = success.contact;
                this.merchantInfo = success.merchantInfo;
                this.LogoImages = success.LogoImages;
                this.IDImages = success.IDImages;
            },
            error => {
                this.loading = false;
            }
        );
    }

    refreshAccountData(event?: any): void {
        this.loading = true;
        this.entity.getMerchantAccounts(this.id).subscribe(
            success => {
                this.accountData = success;
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
    }

    refreshShopData(event?: any): void {
        this.loading = true;
        this.entity.getMerchantShops(this.id).subscribe(
            success => {
                this.shopData = success;
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
    }

    getCouponSummary(event?: any): void {
        this.winLoading = true;
        this.entity.getCouponSummary(
            this.id,
            this.couponStatus.toString(),
            this.ids,
            this.couponQueryType,
            this.startDate,
            this.endDate
        ).subscribe(
            success => {
                this.couponSummary = success;
                this.winLoading = false;
            },
            error => {
                this.winLoading = false;
            }
            );
    }

    refreshCouponList(event?: any): void {
        // if (this.couponStatus === '2' || this.couponStatus === '3') {
        //     this.couponQueryType = 'part';
        // }
        this.getCouponSummary();
        this.loading = true;
        this.entity.getCouponList(
            this.id,
            this.couponStatus.toString(),
            this.ids,
            this.couponQueryType,
            this.startDate,
            this.endDate,
            event && event.pageIndex || this.current,
            event && event.pageSize || this.pageSize).subscribe(
            success => {
                this.couponData = success.list;
                this.total = success.total;
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
            );
    }

    filterActivities(event?: any): void {
        this.winLoading = true;
        this.ids = undefined;
        this.entity.getCouponCategorylist(
            this.id,
            this.activityType,
        ).subscribe(
            success => {
                this.categories = [{ id: '', activityName: '全部活动' }].concat(success);
                // if (typeof this.ids === 'undefined') {
                this.ids = '';
                // }
                this.cdr.markForCheck();
                this.refreshCouponList();
                this.winLoading = false;
            },
            error => {
                this.winLoading = false;
            }
            );
    }

    selectedQueryType(isOpen: boolean): void {
        if (!isOpen) {
            this.refreshCouponList();
        }
    }

    tabChange(event: any): void {
        const scope = this;
        if (event.index === 2) {
            this.refreshAccountData();
            this.columns = [
                {
                    id: 'merchantCode',
                    label: '商家编号',
                    type: 'text'
                }, {
                    id: 'merchantName',
                    label: '商家名称',
                    type: 'text'
                }, {
                    id: 'shopName',
                    label: '门店/机构',
                    type: 'text'
                }, {
                    id: 'accountNo',
                    label: '收款账号',
                    type: 'text'
                }, {
                    id: 'accountType',
                    label: '账户类型',
                    type: 'lookup',
                    options: 'ACCOUNT_SUB_TYPE'
                }, {
                    id: 'accountHolder',
                    label: '持卡人',
                    type: 'text'
                }, {
                    id: 'approve_status',
                    label: '审核状态',
                    type: 'lookup',
                    options: 'APPROVE_STATUS'
                }, {
                    id: 'status',
                    label: '账户状态',
                    type: 'lookup',
                    options: 'ACCOUNT_STATUS'
                }, {
                    label: '账户详情',
                    type: 'action',
                    group: [
                        {
                            type: 'link',
                            label: '查看',
                            callback(row) {
                                scope.showAccountDetail = true;
                                scope.router.navigate([`menu/enter_merchant/enter_merchant_info/${scope.id}/enter_merchant_account`, {
                                    merchantId: row.merchantId,
                                    id: row.id
                                }]);
                            }
                        }
                    ]
                }
            ];
        } else if (event.index === 3) {
            this.refreshShopData();
            this.columns = [
                {
                    id: 'fullName',
                    label: '门店名称（简称）',
                    type: 'text'
                }, {
                    id: 'shopCode',
                    label: '门店编号',
                    type: 'text'
                }, {
                    id: 'contact',
                    label: '门店负责人',
                    type: 'text'
                }, {
                    id: 'contactPhone',
                    label: '门店联系电话',
                    type: 'text'
                }, {
                    id: 'dataName',
                    label: '门店类型',
                    type: 'text'
                }, {
                    id: 'operatingStatus',
                    label: '营业状态',
                    type: 'lookup',
                    options: 'SHOP_STATUS'
                }, {
                    id: 'status',
                    label: '门店状态',
                    type: 'lookup',
                    options: 'ACCOUNT_STATUS'
                }
            ];
        } else if (event.index === 4) {
            this.getCouponSummary();
            this.filterActivities();
            this.refreshCouponList();
            this.columns = [
                {
                    id: 'memberName',
                    label: '顾客（参与人）',
                    type: 'text'
                }, {
                    id: 'mobile',
                    label: '顾客联系方式',
                    type: 'text'
                }, {
                    id: 'definitionId',
                    label: '活动类型',
                    type: 'lookup',
                    options: 'ACTIVITY_TYPES'
                }, {
                    id: 'activityName',
                    label: '活动名称',
                    type: 'text'
                }, {
                    id: 'couponName',
                    label: '兑换券名称',
                    type: 'text'
                }, {
                    id: 'pricePurchaseType',
                    label: '类型/金额',
                    type: 'text'
                }, {
                    id: 'consumeCdky',
                    label: '消费状态/编号',
                    type: 'text'
                }, {
                    id: 'createAndVerifyDate',
                    label: '参与/核销时间',
                    type: 'html'
                }, {
                    id: 'relation',
                    label: '关系/团号',
                    type: 'text'
                }
            ];
        }
    }

    _startValueChange = () => {
        if (this.startDate > this.endDate) {
            this.endDate = null;
        }
        this.getCouponSummary();
        this.refreshCouponList();
    }
    _endValueChange = () => {
        if (this.startDate > this.endDate) {
            this.startDate = null;
        }
        this.getCouponSummary();
        this.refreshCouponList();
    }

    _disabledStartDate = (startValue: Date) => {
        if (!startValue || !this.endDate) {
            return false;
        }
        return startValue.getTime() >= this.endDate.getTime();
    }
    _disabledEndDate = (endValue) => {
        if (!endValue || !this.startDate) {
            return false;
        }
        return endValue.getTime() <= this.startDate.getTime();
    }

    ngOnInit() {
        const scope = this;
        if (endsWith(this.route.params['_value']['id'], '_shop')) {
            const strArr = this.route.params['_value']['id'].split('_');
            this.id = strArr[0];
            if (strArr[1] === 'shop') {
                this.tabChange({ index: this.tabIndex = 3 });
            }
        } else {
            this.id = this.route.params['_value']['id'];
        }
        this.refreshData();
        this.componentCommunicator.$emit('/menu/enter_merchant/enter_merchant_info/' + this.id);
    }
}
