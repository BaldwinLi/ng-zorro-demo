import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { Router } from '@angular/router';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { ShopApprovementService } from '../../services/shopApprovement.service';
import { ApproveDialogComponent } from '../dialogComponent/approveDialog.component';

@Component({
    selector: 'app-shop-approvement',
    templateUrl: './shopApprovementTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class ShopApprovementComponent implements OnInit {
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
    marchantKey: string;
    hisMarchantKey: string;
    resultReason: String = '';
    approveWin: NzModalSubject;
    checkedMerchants: Array<Object> = [];
    columns: Array<any>;
    hisColumns: Array<any> = [
        {
            id: 'merchantCode',
            label: '商家编号',
            type: 'text'
        }, {
            id: 'merchantName',
            label: '商家名称',
            type: 'text'
        }, {
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
            id: 'shopStatus',
            label: '门店状态',
            type: 'lookup',
            options: 'ACCOUNT_STATUS'
        },
        {
            id: 'status',
            label: '审核状态',
            type: 'lookup',
            options: 'APPROVE_STATUS'
        },
        // {
        //     id: 'applySource',
        //     label: '状态理由',
        //     type: 'text'
        // },
        {
            id: 'updateBy',
            label: '最后审核人',
            type: 'text'
        },
        {
            id: 'updateTime',
            label: '最后审核时间',
            type: 'date',
            format: 'yyyy-MM-dd'
        }
    ];

    constructor(
        private componentCommunicator: ComponentCommunicateService,
        private model: NzModalService,
        private router: Router,
        private entity: ShopApprovementService
    ) {
    }

    refreshData(event?: any): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        this.loading = true;
        this.entity.getPendingShops(
            this.marchantKey,
            event && event.pageIndex || this.current,
            event && event.pageSize || this.pageSize
        ).subscribe(
            success => {
                this.data = success.list;
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
        this.entity.getHistoryShops(
            this.hisMarchantKey,
            event && event.pageIndex || this.hisCurrent,
            event && event.pageSize || this.hisPageSize
        ).subscribe(
            success => {
                this.hisData = success.list;
                this.hisTotal = success.total;
                this.hisLoading = false;
            },
            error => {
                this.hisLoading = false;
            }
        );
    }

    shopApprove(row: any): void {
        this.approveWin = this.model.open({
            title: '商家门店审核',
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
              this.entity.approvePendingShops({
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
        this.componentCommunicator.$emit('/menu/shop_approvement');
        this.refreshData();
        this.refreshHistoryData();
        this.columns = [
            // '$checkbox',
            {
                id: 'merchantCode',
                label: '商家编号',
                type: 'text'
            }, {
                id: 'merchantName',
                label: '商家名称',
                type: 'text'
            }, {
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
                id: 'shopStatus',
                label: '门店状态',
                type: 'lookup',
                options: 'ACCOUNT_STATUS'
            },
            {
                label: '操作',
                type: 'action',
                group: [
                    {
                        type: 'link',
                        label: '查看',
                        callback(row) {
                            scope.router.navigate([`menu/enter_merchant/enter_merchant_info/${row.merchantId}_shop`]);
                        }
                    },
                    {
                        type: 'link',
                        label: '审核',
                        callback(row) {
                            scope.shopApprove(row);
                        }
                    }
                ]
            }
        ];
    }
}
