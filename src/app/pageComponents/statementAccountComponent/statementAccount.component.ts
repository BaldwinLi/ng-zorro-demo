import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { DataModelService } from '../../pipes/model';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { MerchantApprovementService } from '../../services/merchantApprovement.service';

@Component({
    selector: 'app-statement-account',
    templateUrl: './statementAccountTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class StatementAccountComponent implements OnInit {
    autoCurrent: Number = 1;
    manualCurrent: Number = 1;
    autoPageSize: Number = 10;
    manualPageSize: Number = 10;
    autoTotal = 0;
    manualTotal = 0;
    autoData: Array<any> = [];
    manualData: Array<any> = [];
    autoLoading: Boolean = false;
    manualLoading: Boolean = false;
    autoMarchantKey: String = '';
    manualMarchantKey: String = '';
    autoColumns: Array<any>;
    payStatus = DataModelService.PAY_STATUS;
    condition: { status: string, startDate: Date, endDate: Date, merchantKey: string } = {
        status: '0',
        startDate: null,
        endDate: null,
        merchantKey: ''
    };
    manualColumns: Array<any> = [
        {
            id: 'merchantCode',
            label: '对账日期',
            type: 'text'
        },
        {
            id: 'fullName',
            label: '门店机构',
            type: 'text'
        },
        {
            id: 'contact',
            label: '账单编号',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '商户编号',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '商户名称',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '支付金额',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '收款人账号',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '收款人',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '付款状态',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '付款流水号',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '付款结果',
            type: 'text'
        }
    ];

    constructor(
        private componentCommunicator: ComponentCommunicateService,
        private entity: MerchantApprovementService
    ) {
    }

    refreshAutoData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        this.autoLoading = true;
        this.entity.getPendingMerchants().subscribe(
            success => {
                this.autoData = success.list;
                this.autoCurrent = success.current;
                this.autoTotal = success.total;
                this.autoLoading = false;
            },
            error => {
                this.autoLoading = false;
            }
        );
    }

    refreshManualData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        this.manualLoading = true;
        this.entity.getHistoryMerchants().subscribe(
            success => {
                this.manualData = success.list;
                this.manualCurrent = success.current;
                this.manualTotal = success.total;
                this.manualLoading = false;
            },
            error => {
                this.manualLoading = false;
            }
        );
    }

    filterStatements(key: string, type: string, value: string | number, event: any) {
        if ((event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) && key === 'marchantKey'
        ) {
            return;
        }
    }

    _startValueChange = () => {
        if (this.condition.startDate > this.condition.endDate) {
            this.condition.endDate = null;
        }
    };
    _endValueChange = () => {
        if (this.condition.startDate > this.condition.endDate) {
            this.condition.startDate = null;
        }
    };

    _disabledStartDate = (startValue: Date) => {
        if (!startValue || !this.condition.endDate) {
            return false;
        }
        return startValue.getTime() >= this.condition.endDate.getTime();
    };
    _disabledEndDate = (endValue) => {
        if (!endValue || !this.condition.startDate) {
            return false;
        }
        return endValue.getTime() <= this.condition.startDate.getTime();
    };

    ngOnInit() {
        const scope = this;
        this.componentCommunicator.$emit('/menu/statement_account');
        this.refreshAutoData();
        this.refreshManualData();
        this.autoColumns = [
            {
                id: 'merchantCode',
                label: '对账日期',
                type: 'text'
            },
            {
                id: 'fullName',
                label: '门店机构',
                type: 'text'
            },
            {
                id: 'contact',
                label: '账单编号',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '商户编号',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '商户名称',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '支付金额',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '收款人账号',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '收款人',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '付款状态',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '付款流水号',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '付款结果',
                type: 'text'
            },
            {
                label: '详情',
                type: 'action',
                group: [
                    {
                        type: 'link',
                        label: '查看',
                        callback(row) {
                        }
                    }
                ]
            }
        ];
    }
}
