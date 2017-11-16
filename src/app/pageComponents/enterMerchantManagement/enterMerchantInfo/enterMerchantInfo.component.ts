import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { isString } from 'lodash';
import { Lang } from '../../../../assets/i18n/i18n';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';
import { EnterMerchantService } from '../../../services/enterMerchant.service';

@Component({
    selector: 'app-enter-merchant-info',
    templateUrl: './enterMerchantInfoTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class EnterMerchantInfoComponent implements OnInit {
    id: string;
    loading: Boolean = false;
    loadingTip: String = Lang['loading_tip'];
    showAccountDetail: Boolean = false;

    contact: Array<Object> = [];

    merchantInfo: Array<Object> = [];

    accountInfo: Array<Object> = [];

    _isString = isString;

    IDImages: Array<Object>;

    LogoImages: Array<Object>;

    current: Number = 1;
    pageSize: Number = 10;
    total = 0;
    columns: Array<any> = [];
    data: Array<any> = [];

    constructor(
        private route: ActivatedRoute,
        private componentCommunicator: ComponentCommunicateService,
        private entity: EnterMerchantService,
        private router: Router
    ) { }

    refreshData(event?: any): void {
        this.loading = true;
        this.entity.getMerchantDetail(this.id).subscribe(
            success => {
                this.contact = success.contact;
                this.merchantInfo = success.merchantInfo;
                this.LogoImages = success.LogoImages;
                this.IDImages = success.IDImages;
                this.entity.getMerchantAccounts(this.id).subscribe(
                    _success => {
                        this.data = _success;
                        this.loading = false;
                    },
                    error => {
                        this.loading = false;
                    }
                );
            },
            error => {
                this.loading = false;
            }
        );
    }

    ngOnInit() {
        const scope = this;
        this.id = this.route.params['_value']['id'];
        this.componentCommunicator.$emit('/menu/enter_merchant/enter_merchant_info/' + this.id);
        this.refreshData();
        this.columns = [
            {
                id: 'merchantId',
                label: '商家编号',
                type: 'text'
            }, {
                id: '',
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
                id: 'approvalType',
                label: '账户类型',
                type: 'text'
            }, {
                id: 'accountHolder',
                label: '持卡人',
                type: 'text'
            }, {
                id: 'status',
                label: '审核状态',
                type: 'lookup',
                options: 'APPROVE_STATUS'
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
    }
}
