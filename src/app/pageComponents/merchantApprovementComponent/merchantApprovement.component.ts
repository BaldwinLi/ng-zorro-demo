import { Component, OnInit } from '@angular/core';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';

@Component({
    selector: 'app-merchant-approvement',
    templateUrl: './merchantApprovementTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class MerchantApprovementComponent implements OnInit {
    private current: Number = 1;
    private hisCurrent: Number = 1;
    private pageSize: Number = 10;
    private hisPageSize: Number = 10;
    private total = 0;
    private hisTotal = 0;
    private data: Array<any> = [];
    private hisData: Array<any> = [];
    private loading: Boolean = false;
    private marchantKey: String = '';
    private hisMarchantKey: String = '';
    private resultReason: String = '';
    private approveWin: NzModalSubject;
    private checkedMerchants: Array<Object> = [];
    private columns: Array<any> = [
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
    private hisColumns: Array<any> = [
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

    constructor(private componentCommunicator: ComponentCommunicateService, private model: NzModalService) {
    }

    private refreshData(event): void {
        if ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13)) {
            return;
        }
    }

    private refreshHistoryData(event): void {
        if ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13)) {
            return;
        }
    }

    private merchantApprove(title, content, footer): void {
        this.approveWin = this.model.open({
            title,
            content,
            footer,
            maskClosable: false
        });
    }

    private handleApprove(result): void {
        alert(result);
        this.approveWin.destroy();
    }

    private onCheckedMerchants(merchants: Array<Object>): void {
        this.checkedMerchants = merchants;
    }

    ngOnInit() {
        this.componentCommunicator.$emit('/menu/merchant_approvement');
    }
}
