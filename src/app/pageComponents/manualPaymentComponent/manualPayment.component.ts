import { Component, OnInit } from '@angular/core';
import { isObject, debounce } from 'lodash';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { DataModelService } from '../../pipes/model';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { UtilService } from '../../services/baseServices/util.service';
import { EnterMerchantService } from '../../services/enterMerchant.service';
import { ManualPaymentService } from '../../services/manualPayment.service';

@Component({
    selector: 'app-manual-payment',
    templateUrl: './manualPaymentTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class ManualPaymentComponent implements OnInit {
    loading: Boolean = false;
    merchantOptionsLoading: Boolean = false;
    accountOptionsLoading: Boolean = false;
    loadingTip: String = '喵喵正在加载商家支付信息，请稍后...';
    payLoading: Boolean = false;
    paymentForm: FormGroup;
    isValidField: Function;
    showSearch: Boolean = true;
    modelSubject: NzModalSubject;
    selectedMerchant: { merchantId: string, shortName: string, merchantCode: string, fullName: string } = {
        merchantId: '',
        shortName: '',
        merchantCode: '',
        fullName: ''
    };
    selectedAccount: { id: number, accountNo: string, accountHolder: string };
    categoryOptions: Array<{ id: string, value: string }> = DataModelService.TRANSACTION_CATEGORY;
    merchantOptions: Array<{ merchantId: string, shortName: string, merchantCode: string, fullName: string }>;
    accountOptions: Array<{ id: number, accountNo: string, accountHolder: string }>;
    merchantRecipient: { accountNo: string, accountHolder: string };
    paymentDetail: Array<{ label: string, value: string, type?: string }>;

    constructor(
        private fb: FormBuilder,
        private util: UtilService,
        private model: NzModalService,
        private nms: NzMessageService,
        private componentCommunicator: ComponentCommunicateService,
        private merchantSvc: EnterMerchantService,
        private manualPaySvc: ManualPaymentService
    ) {
        this.isValidField = util.isValid;
    }

    searchMerchant(event?: any): void {
        const scope = this;
        this.merchantOptionsLoading = true;
        debounce(() => {
            this.merchantSvc.getMerchants({
                searchKey: event || '',
                pageNum: 1,
                pageSize: 10
            }).subscribe(
                success => {
                    scope.merchantOptionsLoading = false;
                    scope.merchantOptions = success.list;
                },
                error => {
                    scope.merchantOptionsLoading = false;
                }
                );
        }, 200)();
    }

    searchAccount(event?: any): void {
        if (!this.paymentForm.value['merchantId']) {
            this.nms.error('请先选择有效商户');
            return;
        }
        const scope = this;
        this.accountOptionsLoading = true;
        this.merchantSvc.getMerchantAccounts(this.paymentForm.value['merchantId']).subscribe(
            success => {
                this.accountOptionsLoading = false;
                scope.accountOptions = success;
            },
            error => {
                this.accountOptionsLoading = false;
            }
        );
    }

    selectMerchant(event?: any): void {
        if (!event) {
            if (this.selectedMerchant.merchantId !== this.paymentForm.value['merchantId']) {
                this.accountOptions = [];
                this.paymentForm.patchValue({
                    id: null
                });
            }
            this.selectedMerchant = this.merchantOptions
                .filter(e => (e.merchantId === this.paymentForm.value['merchantId']))
                .map(v => {
                    return {
                        merchantId: v.merchantId,
                        shortName: v.shortName,
                        merchantCode: v.merchantCode,
                        fullName: v.fullName
                    };
                })[0];
        }
    }

    selectAccount(event?: any): void {
        if (!event && this.accountOptions) {
            this.selectedAccount = this.accountOptions
                .filter(e => (e.id === this.paymentForm.value['id']))
                .map(v => {
                    return {
                        id: v.id,
                        accountNo: v.accountNo,
                        accountHolder: v.accountHolder
                    };
                })[0];
        }
    }

    _submitForm(titleTpl, contentTpl, footerTpl): void {
        if (!this.util.isInvalidForm(this.paymentForm)) {
            const scope = this;
            this.loading = true;
            this.manualPaySvc.getRecipientList(this.paymentForm.value['merchantId']).subscribe(
                success => {
                    this.loading = false;
                    this.merchantRecipient = success && success.list && success.list[0] || {};
                    scope.paymentDetail = [
                        {
                            label: '门店机构',
                            value: scope.selectedMerchant['shortName']
                        }, {
                            label: '商家编号',
                            value: scope.selectedMerchant['merchantCode']
                        }, {
                            label: '商家名称',
                            value: scope.selectedMerchant['fullName']
                        }, {
                            label: '收款人账号',
                            value: this.merchantRecipient['accountNo']
                        }, {
                            label: '收款人',
                            value: this.merchantRecipient['accountHolder']
                        }, {
                            label: '支付费率',
                            value: '0'
                        }, {
                            label: '支付金额',
                            value: this.paymentForm.value['paymentAmount'],
                            type: 'CNY'
                        }
                    ];
                    scope.modelSubject = this.model.open({
                        title: titleTpl,
                        content: contentTpl,
                        maskClosable: false,
                        footer: footerTpl
                    });
                },
                error => {
                    this.loading = false;
                }
            );
        }
    }

    confirmToPay(event?: any): void {
        this.payLoading = true;
        const scope = this;
        this.manualPaySvc.putPayment({
            pageNum: 0,
            pageSize: 0,
            ...this.paymentForm.value
        }).subscribe(
            success => {
                scope.payLoading = false;
                scope.modelSubject.destroy();
            },
            error => {
                scope.payLoading = false;
            }
            );
    }

    ngOnInit(): void {
        this.componentCommunicator.$emit('/menu/manual_payment');
        this.paymentForm = this.fb.group({
            id: [null, [Validators.required]],
            merchantId: [null, [Validators.required]],
            transactionCategory: [null, [Validators.required]],
            paymentAmount: [null, [Validators.required]],
            remark: '',
        });
    }
}
