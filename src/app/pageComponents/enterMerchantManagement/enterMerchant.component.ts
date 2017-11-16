import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { Router } from '@angular/router';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService } from 'ng-zorro-antd';
import { AddMerchantComponent } from './enterMerchantManagementDialog/addMerchant.component';
import { EnterMerchantService } from '../../services/enterMerchant.service';

@Component({
  selector: 'app-menu-platform',
  templateUrl: './enterMerchantTemplate.html',
  styleUrls: ['../../../assets/css/custom.css']
})
export class EnterMerchantComponent implements OnInit {
  current: Number = 1;
  pageSize: Number = 10;
  total = 0;
  data: Array<any> = [];
  loading = false;
  marchantKey: String = '';
  columns: Array<any>;

  constructor(
    private componentCommunicator: ComponentCommunicateService,
    private model: NzModalService,
    private router: Router,
    private entity: EnterMerchantService
  ) {
  }

  refreshData(event?: any) {
    if (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
      (event.type === 'keypress' && event.charCode !== 13))) {
      return;
    }
    this.loading = true;
    this.entity.getMerchants({
      searchKey: this.marchantKey,
      pageNum: this.current
    }).subscribe(
      success => {
        this.data = success.list;
        this.total = success.total;
        this.current = success.current;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
      );
  }

  addMerchant(event: any) {
    const subscription = this.model.open({
      title: '添加商户',
      content: AddMerchantComponent,
      footer: false
    });
    subscription.subscribe(result => {
      if (isObject(result)) {
        this.loading = true;
        this.entity.addMerchant(result).subscribe(
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

  ngOnInit() {
    const scope = this;
    this.columns = [
      {
        id: 'merchantId',
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
        label: '商家状态',
        type: 'lookup',
        options: 'ACTIVATE_STATUS'
      },
      {
        label: '详情',
        type: 'action',
        group: [
          {
            type: 'link',
            label: '查看',
            callback(row) {
              scope.router.navigate([`menu/enter_merchant/enter_merchant_info/${row.merchantId}`]);
            }
          }
        ]
      }
    ];
    this.componentCommunicator.$emit('/menu/enter_merchant');
    this.refreshData();
  }
}
