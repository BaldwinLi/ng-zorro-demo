import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isObject } from 'lodash';
import { DataModelService } from '../../pipes/model';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { SettleAccountsService } from '../../services/settleAccounts.service';

@Component({
    selector: 'app-settle-accounts',
    templateUrl: './settleAccountsTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class SettleAccountsComponent implements OnInit {
    current: Number = 1;
    pageSize: Number = 10;
    total = 0;
    data: Array<any> = [];
    loading: Boolean = false;
    marchantKey: string;
    columns: Array<any>;
    condition: { accountCode: string, startDate: Date, endDate: Date, merchantKey: string } = {
        accountCode: '',
        startDate: null,
        endDate: null,
        merchantKey: ''
    };

    constructor(
        private componentCommunicator: ComponentCommunicateService,
        private router: Router,
        private route: ActivatedRoute,
        private entity: SettleAccountsService
    ) {
    }

    refreshData(event?: any): void {
        this.loading = true;
        this.entity.getSettleAccounts(
            this.marchantKey,
            this.condition.accountCode,
            this.condition.startDate,
            this.condition.endDate,
            this.current,
            this.pageSize,
            this.route.params['_value']['id']
        ).subscribe(
            success => {
                this.data = success.list;
                this.current = success.current;
                this.total = success.total;
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
    }

    filterSettleAccounts(event: any) {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))
        ) {
            return;
        }
        this.refreshData();
    }

    _startValueChange = () => {
        if (this.condition.startDate > this.condition.endDate) {
            this.condition.endDate = null;
        }
        this.refreshData();
    }
    _endValueChange = () => {
        if (this.condition.startDate > this.condition.endDate) {
            this.condition.startDate = null;
        }
        this.refreshData();
    }

    _disabledStartDate = (startValue: Date) => {
        if (!startValue || !this.condition.endDate) {
            return false;
        }
        return startValue.getTime() >= this.condition.endDate.getTime();
    }
    _disabledEndDate = (endValue) => {
        if (!endValue || !this.condition.startDate) {
            return false;
        }
        return endValue.getTime() <= this.condition.startDate.getTime();
    }

    ngOnInit() {
        const scope = this;
        this.componentCommunicator.$emit('/menu/settle_accounts');
        this.refreshData();
        this.columns = [
            {
                id: 'settlementDay',
                label: '结算日',
                type: 'date',
                format: 'yyyy-MM-dd'
            },
            {
                id: 'merchantCode',
                label: '商户编号',
                type: 'text'
            },
            {
                id: 'fullName',
                label: '商户名称',
                type: 'text'
            },
            {
                id: 'shopName',
                label: '门店机构',
                type: 'text'
            },
            {
                id: 'settlementAmount',
                label: '支付金额',
                type: 'text'
            },
            {
                id: 'settlementCategory',
                label: '结算类目',
                type: 'lookup',
                options: 'TRANSACTION_CATEGORY'
            },
            {
                id: 'transactionAmount',
                label: '总交易金额',
                type: 'text'
            },
            {
                id: 'settlementAmount',
                label: '结算金额',
                type: 'text'
            },
            {
                id: 'transactions',
                label: '交易笔数',
                type: 'text'
            },
            {
                id: 'accountingRate',
                label: '结算费率',
                type: 'text'
            },
            {
                id: 'deductAmount',
                label: '应扣金额',
                type: 'text'
            },
            {
                id: 'actualDeduction',
                label: '实扣金额',
                type: 'text'
            },
            {
                id: 'status',
                label: '状态',
                type: 'lookup',
                options: 'PAY_STATUS'
            },
            // {
            //     id: 'paymentTime',
            //     label: '支付时间',
            //     type: 'date',
            //     format: 'yyyy-MM-dd'
            // },
            {
                label: '详情',
                type: 'action',
                group: [
                    {
                        type: 'link',
                        label: '查看',
                        callback(row) {
                            scope.router.navigate([`/menu/settle_accounts/settle_account_detail/${row.dailySettlementId}`]);
                        }
                    }
                ]
            }
        ];
    }
}
