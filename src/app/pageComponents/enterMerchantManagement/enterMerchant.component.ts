import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService } from 'ng-zorro-antd';
import { AddMerchantComponent } from './enterMerchantManagementDialog/addMerchant.component';

@Component({
  selector: 'app-menu-platform',
  templateUrl: './enterMerchantTemplate.html',
  styleUrls: ['../../../assets/css/custom.css']
})
export class EnterMerchantComponent implements OnInit {
  private current: Number = 1;
  private pageSize: Number = 10;
  private total = 0;
  private data: Array<any> = [];
  private loading = false;
  private marchantKey: String = '';
  private columns: Array<any> = [
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
      id: 'status',
      label: '详情',
      type: 'action',
      group: [
        {
          type: 'link',
          label: '查看',
          callback(row) {
            this.router.navigate(['/menu/activity_approvement/activity_detail'], row.id);
          }
        }
      ]
    }
  ];

  constructor(
    private componentCommunicator: ComponentCommunicateService,
    private model: NzModalService,
    private router: Router
  ) {
  }

  refreshData(event) {
    if ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
      (event.type === 'keypress' && event.charCode !== 13)) {
      return;
    }
  }

  addMerchant() {
    const subscription = this.model.open({
      title: '添加商户',
      content: AddMerchantComponent,
      onOk() {
        alert();
      },
      footer: false
    });
    subscription.subscribe(result => {
    });
  }

  ngOnInit() {
    this.componentCommunicator.$emit('/menu/enter_merchant');
  }
}
