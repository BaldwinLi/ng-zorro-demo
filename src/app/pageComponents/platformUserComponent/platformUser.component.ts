import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { Router } from '@angular/router';
import { DataModelService } from '../../pipes/model';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { NzModalService } from 'ng-zorro-antd';
import { PlatformUserDialogComponent } from './platformUserDialog/platformUserDialog.component';
import { EditUserPasswordComponent } from './editUserPasswordDialog/editUserPasswordDialog.component';
import { PlatformUserService } from '../../services/platformUser.service';

@Component({
  selector: 'app-platform-user',
  templateUrl: './platformUserTemplate.html',
  styleUrls: ['../../../assets/css/custom.css']
})
export class PlatformUserComponent implements OnInit {
  current: Number = 1;
  pageSize: Number = 10;
  total = 0;
  data: Array<any> = [];
  loading = false;
  userRoleOptions: Array<{ id: string, value: string }> = [{ id: '', value: '全部' }].concat(DataModelService.PLATFORM_USER_ROLE);
  userRole: String = '';
  columns: Array<any>;

  constructor(
    private componentCommunicator: ComponentCommunicateService,
    private model: NzModalService,
    private router: Router,
    private entity: PlatformUserService
  ) {
  }

  refreshData(event?: any, type?: string) {
    if (type === 'nzOpenChange' && event) {
      return;
    }
    this.loading = true;
    this.entity.getPlatformUsers(
      this.userRole,
      event && event.pageIndex || this.current,
      event && event.pageSize || this.pageSize
    ).subscribe(
      success => {
        this.data = success.list;
        this.total = success.total;
        this.current = success.current || 1;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
      );
  }

  addPlatformUser(event: any) {
    const subscription = this.model.open({
      title: '添加平台用户',
      content: PlatformUserDialogComponent,
      footer: false
    });
    subscription.subscribe(result => {
      if (isObject(result)) {
        this.loading = true;
        this.entity.addPlatformUser(result).subscribe(
          success => {
            this.refreshData();
            this.loading = false;
            subscription.destroy('onCancel');
          },
          error => {
            this.loading = false;
          }
        );
      }
    });
  }

  updateStatus(row: any) {
    this.entity.updatePlatformUserStatus(row.username).subscribe(
      null,
      error => {
        row.isActive = !row.isActive;
      }
    );
  }

  changeUserPassword(username: string): void {
    this.model.open({
      title: '修改密码',
      content: EditUserPasswordComponent,
      componentParams: {
        username
      },
      width: 300,
      footer: false
    });
  }

  ngOnInit() {
    const scope = this;
    this.columns = [
      {
        id: 'username',
        label: '用户名',
        type: 'text'
      },
      {
        id: 'nickname',
        label: '用户昵称',
        type: 'text'
      },
      {
        id: 'userRole',
        label: '用户角色',
        type: 'lookup',
        options: 'PLATFORM_USER_ROLE'
      },
      {
        id: 'updateTime',
        label: '最后更新时间',
        type: 'date',
        format: 'yyyy-MM-dd'
      },
      {
        id: 'isActive',
        label: '可用状态',
        type: 'switch',
        checked: '启用',
        unchecked: '停用',
        callback: scope.updateStatus.bind(scope)
      },
      {
        label: '操作',
        type: 'action',
        group: [
          {
            type: 'link',
            label: '修改密码',
            callback(row) {
              scope.changeUserPassword(row.username);
            }
          }
        ]
      }
    ];
    this.componentCommunicator.$emit('/menu/platform_user');
    this.refreshData();
  }
}
