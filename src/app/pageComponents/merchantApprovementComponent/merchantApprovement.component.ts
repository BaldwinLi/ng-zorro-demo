import { Component, OnInit } from '@angular/core';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { MerchantApprovementService } from '../../services/merchantApprovement.service';

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
    columns: Array<any> = [
        '$checkbox',
        {
            id: 'merchantId',
            label: '商家编号'
        },
        {
            id: 'marchantName',
            label: '商家名称'
        },
        {
            id: 'contactName',
            label: '联系人姓名'
        },
        {
            id: 'address',
            label: '商家所在地'
        }
    ];
    hisColumns: Array<any> = [
        {
            id: 'merchantId',
            label: '商家编号'
        },
        {
            id: 'marchantName',
            label: '商家名称'
        },
        {
            id: 'contactName',
            label: '联系人姓名'
        },
        {
            id: 'address',
            label: '商家所在地'
        },
        {
            id: 'status',
            label: '审核状态'
        },
        {
            id: 'reason',
            label: '状态理由'
        },
        {
            id: 'approveBy',
            label: '最后审核人'
        },
        {
            id: 'approveDate',
            label: '最后审核时间'
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
        this.entity.getPendingMerchants({}).subscribe(
            success => {
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
    }

    refreshHistoryData(event): void {
        if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) {
            return;
        }
        this.hisLoading = true;
        this.entity.getHistoryMerchants({}).subscribe(
            success => {
                this.hisLoading = false;
            },
            error => {
                this.hisLoading = false;
            }
        );
    }

    merchantApprove(title, content, footer): void {
        this.approveWin = this.model.open({
            title,
            content,
            footer,
            maskClosable: false
        });
    }

    handleApprove(result): void {
        this.loading = true;
        this.entity.approvePendingMerchants({}).subscribe(
            success => {
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
        this.approveWin.destroy();
    }

    onCheckedMerchants(merchants: Array<Object>): void {
        this.checkedMerchants = merchants;
    }

    ngOnInit() {
        this.componentCommunicator.$emit('/menu/merchant_approvement');
        this.refreshData();
    }
}
