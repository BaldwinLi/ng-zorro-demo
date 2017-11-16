import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { AccountApprovementService } from '../../services/accountApprovement.service';
import { CredentialDialogComponent } from './credentialDialog.component';
import { ApproveDialogComponent } from '../dialogCmopponent/approveDialog.component';

@Component({
    selector: 'app-account-approvement',
    templateUrl: './accountApprovementTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class AccountApprovementComponent implements OnInit {
    current: Number = 1;
    hisCurrent: Number = 1;
    pageSize: Number = 10;
    hisPageSize: Number = 10;
    total = 0;
    hisTotal = 0;
    data: Array<any> = [];
    hisData: Array<any> = [];
    loading: Boolean = false;
    hisLoading: Boolean = false;
    marchantKey: String = '';
    hisMarchantKey: String = '';
    resultReason: String = '';
    approveWin: NzModalSubject;
    checkedMerchants: Array<Object> = [];
    columns: Array<any>;
    hisColumns: Array<any>;

    constructor(
        private componentCommunicator: ComponentCommunicateService,
        private model: NzModalService,
        private entity: AccountApprovementService
    ) {
    }

    refreshData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        this.loading = true;
        this.entity.getPendingAccounts().subscribe(
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

    refreshHistoryData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        this.hisLoading = true;
        this.entity.getHistoryAccounts().subscribe(
            success => {
                this.hisData = success.list;
                this.hisCurrent = success.current;
                this.hisTotal = success.total;
                this.hisLoading = false;
            },
            error => {
                this.hisLoading = false;
            }
        );
    }

    accountApprove(row: any): void {
        this.approveWin = this.model.open({
            title: '商家审核',
            content: ApproveDialogComponent,
            componentParams: {
                params: row
            },
            footer: false,
            maskClosable: false
        });
        this.approveWin.subscribe(result => {
            if (isObject(result)) {
                this.loading = true;
                this.entity.approvePendingAccounts({
                    id: row.id,
                    comment: result.result,
                    status: result.resultReason
                }).subscribe(
                    success => {
                        this.refreshData();
                        this.loading = false;
                    },
                    error => {
                        this.loading = false;
                    }
                    );
            }
        });
    }

    // handleApprove(result): void {
    //     this.loading = true;
    //     this.entity.approvePendingAccounts({}).subscribe(
    //         success => {
    //             this.loading = false;
    //         },
    //         error => {
    //             this.loading = false;
    //         }
    //     );
    //     this.approveWin.destroy();
    // }

    // onCheckedMerchants(merchants: Array<Object>): void {
    //     this.checkedMerchants = merchants;
    // }

    previewCredential(imageUrl: String = './assets/image/default.png'): void {
        this.model.open({
            title: '开户凭证/银行',
            content: CredentialDialogComponent,
            componentParams: {
                imageUrl
            },
            maskClosable: false,
            footer: false,
            style: {
                width: 'max-content',
                height: 'max-content'
            }
        });
    }

    ngOnInit() {
        const scope = this;
        this.componentCommunicator.$emit('/menu/account_approvement');
        this.refreshData();
        this.refreshHistoryData();
        this.columns = [
            {
                id: 'merchantId',
                label: '商家编号',
                type: 'text'
            }, {
                id: 'fullName',
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
                type: 'lookup',
                options: 'ACCOUNT_TYPE'
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
                label: '查看凭证',
                type: 'action',
                group: [
                    {
                        type: 'link',
                        label: '查看',
                        callback(row) {
                            scope.previewCredential(row.url);
                        }
                    },
                    {
                        type: 'link',
                        label: '审核',
                        callback(row) {
                            scope.accountApprove(row);
                        }
                    }
                ]
            }
        ];
        this.hisColumns = this.columns.slice(0, this.columns.length - 1).concat([
            {
                label: '查看凭证',
                type: 'action',
                group: [
                    {
                        type: 'link',
                        label: '查看',
                        callback(row) {
                            scope.previewCredential(row.url);
                        }
                    }
                ]
            },
            {
                id: 'updateBy',
                label: '最后审核人',
                type: 'text'
            }, {
                id: 'updateTime',
                label: '最后审核时间',
                type: 'text'
            }
        ]);
    }
}
