import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Lang } from '../../../assets/i18n/i18n';
import { Subscription } from 'rxjs/Subscription';
import { NzModalService } from 'ng-zorro-antd';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { LoginUserService } from '../../services/loginUser.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './homeTemplate.html',
  styleUrls: ['../../../assets/css/custom.css'],
  providers: [ComponentCommunicateService]
})
export class HomeComponent implements OnDestroy {
  homePage: String = Lang['home_page'];
  user: { userName: string, userAvatar: string, icon: string } = {
    userName: '测试用户',
    userAvatar: '',
    icon: ''
  };

  loading: Boolean = false;
  loadingTip: String = '注销中，请稍后...';

  breadcrumbItems: Array<Object> = [{
    name: 'enter_merchant',
    link: '/menu/enter_merchant',
    icon: 'anticon anticon-bank',
    label: '入驻商家管理'
  }];

  breadcrumbItemlist: Object = {
    enter_merchant: ['/menu/enter_merchant', '入驻商家管理', 'anticon anticon-bank'],
    enter_merchant_info: ['/menu/enter_merchant/enter_merchant_info', '入驻商家详情', 'anticon anticon-idcard'],
    merchant_approvement: ['/menu/merchant_approvement', '商家注册审核'],
    activity_approvement: ['/menu/activity_approvement', '活动信息审核'],
    activity_detail: ['/menu/activity_approvement/activity_detail', '活动详情']
  };

  subscription: Subscription;
  constructor(
    componentCommunicator: ComponentCommunicateService,
    private luSvc: LoginUserService,
    private router: Router,
    private nmSvc: NzModalService
  ) {
    this.subscription = componentCommunicator.emitObsr.subscribe(
      item => {
        const names = item.split('/');
        setTimeout(() => {
          this.breadcrumbItems.length = 0;
          names.forEach(e => {
            if (this.breadcrumbItemlist[e]) {
              this.breadcrumbItems.push(
                {
                  link: this.breadcrumbItemlist[e][0],
                  label: this.breadcrumbItemlist[e][1],
                  icon: this.breadcrumbItemlist[e][2]
                });
            }
          });
        });
      });
  }

  doLogout(event): void {
    const scope = this;
    this.nmSvc.confirm({
      title: '注销',
      content: '是否确认注销？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        scope.loading = true
        scope.luSvc.logout().subscribe(
          success => {
            if (success === 'success') {
              scope.loading = false;
              sessionStorage.clear();
              scope.router.navigate(['login']);
            }
          }
        );
      }
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
