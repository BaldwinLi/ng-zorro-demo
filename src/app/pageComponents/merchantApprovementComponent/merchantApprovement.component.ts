import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { MerchantApprovementService } from '../../services/merchantApprovement.service';
import { ApproveDialogComponent } from '../dialogCmopponent/approveDialog.component';

@Component({
    selector: 'app-merchant-approvement',
    templateUrl: './merchantApprovementTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class MerchantApprovementComponent implements OnInit {
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
    hisColumns: Array<any> = [
        {
            id: 'merchantCode',
            label: '商家编号',
            type: 'text'
        },
        {
            id: 'fullName',
            label: '商家名称',
            type: 'text'
        },
        {
            id: 'contact',
            label: '联系人姓名',
            type: 'text'
        },
        {
            id: 'registeredAddress',
            label: '商家所在地',
            type: 'text'
        },
        {
            id: 'status',
            label: '审核状态',
            type: 'lookup',
            options: 'APPROVE_STATUS'
        },
        {
            id: 'applySource',
            label: '状态理由',
            type: 'text'
        },
        {
            id: 'updateBy',
            label: '最后审核人',
            type: 'text'
        },
        {
            id: 'updateTime',
            label: '最后审核时间',
            type: 'text'
        }
    ];

    constructor(
        private componentCommunicator: ComponentCommunicateService,
        private model: NzModalService,
        private entity: MerchantApprovementService
    ) {
    }

    refreshData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        this.loading = true;
        this.entity.getPendingMerchants().subscribe(
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
        this.entity.getHistoryMerchants().subscribe(
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

    merchantApprove(row: any): void {
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
              this.entity.approvePendingMerchants({
                  id: row.id,
                  comment: result.resultReason,
                  status: result.result
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
    //     this.entity.approvePendingMerchants({}).subscribe(
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

    ngOnInit() {
        const scope = this;
        this.componentCommunicator.$emit('/menu/merchant_approvement');
        this.refreshData();
        this.refreshHistoryData();
        this.columns = [
            // '$checkbox',
            {
                id: 'merchantCode',
                label: '商家编号',
                type: 'text'
            },
            {
                id: 'fullName',
                label: '商家名称',
                type: 'text'
            },
            {
                id: 'contact',
                label: '联系人姓名',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '商家所在地',
                type: 'text'
            },
            {
                label: '操作',
                type: 'action',
                group: [
                    {
                        type: 'link',
                        label: '审核',
                        callback(row) {
                            scope.merchantApprove(row);
                        }
                    }
                ]
            }
        ];
    }
}
