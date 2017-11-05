import { Component, OnInit } from '@angular/core';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';

@Component({
  selector: 'app-menu-platform-component',
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
          callback(event) {
            alert(111);
          }
        }
      ]
    }
  ];

  constructor(private componentCommunicator: ComponentCommunicateService) {
  }

  refreshData(event) {
    if ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
      (event.type === 'keypress' && event.type === 'keypress' && event.charCode !== 13)) {
      return;
    }
    alert(111);
  }

  addMerchant() {
    alert(222);
  }

  ngOnInit() {
    this.componentCommunicator.$emit({
      name: 'enter_merchant',
      link: '/menu/enter_merchant',
      icon: 'anticon anticon-bank',
      label: '入驻商家管理'
    });
  }
}
