import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isObject } from 'lodash';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { DataModelService } from '../../pipes/model';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { StatemenetAccountService } from '../../services/statementAccount.service';
import { UtilService } from '../../services/baseServices/util.service';
import { PaymentDialogComponent } from './paymentDialog/paymentDialog.component';

@Component({
    selector: 'app-statement-account',
    templateUrl: './statementAccountsTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class StatementAccountsComponent implements OnInit {
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
    autoMarchantKey: string;
    manualMarchantKey: string;
    autoColumns: Array<any>;
    paymentForm: FormGroup;
    payStatus = DataModelService.STATEMENT_STATUS;
    isInvalid: Function;
    isValidField: Function;
    paymentRemarkWin: NzModalSubject;
    condition: { status: string, startDate: Date, endDate: Date, merchantKey: string } = {
        status: '',
        startDate: null,
        endDate: null,
        merchantKey: ''
    };
    manualColumns: Array<any> = [
        {
            id: 'paymentNo',
            label: '账单编号',
            type: 'text'
        },
        {
            id: 'createTime',
            label: '对账日期',
            type: 'date',
            format: 'yyyy-MM-dd'
        },
        {
            id: 'merchantName',
            label: '商家名称',
            type: 'text'
        },
        {
            id: 'shopName',
            label: '门店机构',
            type: 'text'
        },
        {
            id: 'paymentAmount',
            label: '支付金额',
            type: 'text'
        },
        {
            id: 'recipientAccountNumber',
            label: '收款人账号',
            type: 'text'
        },
        {
            id: 'receiptor',
            label: '收款人',
            type: 'text'
        },
        {
            id: 'paymentStatus',
            label: '付款状态',
            type: 'lookup',
            options: 'STATEMENT_STATUS'
        },
        {
            id: 'paymentTime',
            label: '支付时间',
            type: 'date',
            format: 'yyyy-MM-dd'
        }
        // {
        //     id: 'tradeSerialNumber',
        //     label: '付款流水号',
        //     type: 'text'
        // }
    ];

    constructor(
        private fb: FormBuilder,
        private util: UtilService,
        private model: NzModalService,
        private componentCommunicator: ComponentCommunicateService,
        private router: Router,
        private entity: StatemenetAccountService
    ) {
        this.isInvalid = util.isInvalidForm;
        this.isValidField = util.isValid;
    }

    refreshAutoData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        const scope = this;
        this.autoLoading = true;
        this.entity.getAutoAccounts(
            this.autoMarchantKey,
            this.condition.startDate,
            this.condition.endDate,
            this.condition.status,
            event && event.pageIndex || this.autoCurrent,
            event && event.pageSize || this.autoPageSize
        ).subscribe(
            success => {
                scope.autoLoading = false;
                scope.autoData = success.list;
                scope.autoCurrent = success.current || 1;
                scope.autoTotal = success.total;
            },
            error => {
                scope.autoLoading = false;
            }
            );
    }

    refreshManualData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        const scope = this;
        this.manualLoading = true;
        this.entity.getManualAccounts(
            this.manualMarchantKey,
            this.condition.startDate,
            this.condition.endDate,
            this.condition.status,
            event && event.pageIndex || this.manualCurrent,
            event && event.pageSize || this.manualPageSize
        ).subscribe(
            success => {
                scope.manualLoading = false;
                scope.manualData = success.list;
                scope.manualCurrent = success.current || 1;
                scope.manualTotal = success.total;
            },
            error => {
                scope.manualLoading = false;
            }
            );
    }

    filterStatements(type: string) {
        if (type === 'auto') {
            this.refreshAutoData();
        } else if (type === 'manual') {
            this.refreshManualData();
        }
    }

    openPaymentRemark(row: any): void {
        this.paymentRemarkWin = this.model.open({
            title: '支付信息备注',
            content: PaymentDialogComponent,
            componentParams: {
                params: row
            },
            footer: false,
            maskClosable: false
        });
        this.paymentRemarkWin.subscribe(result => {
            if (isObject(result)) {
                this.autoLoading = true;
                this.entity.updateMerchantPay({
                    id: row.id,
                    ...result
                }).subscribe(
                    success => {
                        this.refreshAutoData();
                        this.autoLoading = false;
                    },
                    error => {
                        this.autoLoading = false;
                    }
                    );
            }
        });
    }

    _startValueChange = (type: string) => {
        if (this.condition.startDate > this.condition.endDate) {
            this.condition.endDate = null;
        }
        if (type === 'auto') {
            this.refreshAutoData();
        } else if (type === 'manual') {
            this.refreshManualData();
        }
    }
    _endValueChange = (type: string) => {
        if (this.condition.startDate > this.condition.endDate) {
            this.condition.startDate = null;
        }
        if (type === 'auto') {
            this.refreshAutoData();
        } else if (type === 'manual') {
            this.refreshManualData();
        }
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
        this.componentCommunicator.$emit('/menu/statement_accounts');
        this.autoColumns = [
            {
                id: 'paymentNo',
                label: '账单编号',
                type: 'text'
            },
            {
                id: 'createTime',
                label: '对账日期',
                type: 'date',
                format: 'yyyy-MM-dd'
            },
            {
                id: 'merchantName',
                label: '商家名称',
                type: 'text'
            },
            {
                id: 'shopName',
                label: '门店机构',
                type: 'text'
            },
            {
                id: 'paymentAmount',
                label: '支付金额',
                type: 'text'
            },
            {
                id: 'recipientAccountNumber',
                label: '收款人账号',
                type: 'text'
            },
            {
                id: 'receiptor',
                label: '收款人',
                type: 'text'
            },
            {
                id: 'paymentStatus',
                label: '付款状态',
                type: 'lookup',
                options: 'STATEMENT_STATUS'
            },
            {
                id: 'paymentTime',
                label: '支付时间',
                type: 'date',
                format: 'yyyy-MM-dd'
            },
            // {
            //     id: 'tradeSerialNumber',
            //     label: '付款流水号',
            //     type: 'text'
            // },
            {
                label: '操作',
                type: 'action',
                group: [
                    {
                        type: 'link',
                        label: '查看',
                        callback(row) {
                            scope.router.navigate(['/menu/settle_accounts', { id: row.id }]);
                        }
                    },
                    {
                        type: 'link',
                        hidden(row) {
                            return (row.paymentStatus !== -1 || row.paymentStatus !== '-1');
                        },
                        label: '支付',
                        callback(row) {
                            scope.openPaymentRemark(row);
                        }
                    }
                ]
            }
        ];
        this.refreshAutoData();
        this.refreshManualData();
    }
}
