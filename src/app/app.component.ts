import { Component, OnDestroy } from '@angular/core';
import { Lang } from '../assets/i18n/i18n';
import { Subscription } from 'rxjs/Subscription';
import { ComponentCommunicateService } from './services/baseServices/componentCommunicate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/custom.css'],
  providers: [ComponentCommunicateService]
})
export class AppComponent implements OnDestroy {
  private texts: Object = {
    homePage: Lang['home_page'],
    user: {
      userName: '测试用户',
      userAavatar: ''
    },
  };

  private breadcrumbItems: Array<Object> = [{
    name: 'enter_merchant',
    link: '/menu/enter_merchant',
    icon: 'anticon anticon-bank',
    label: '入驻商家管理'
  }];

  private breadcrumbItemlist: Object = {
    enter_merchant: ['/menu/enter_merchant', '入驻商家管理', 'anticon anticon-bank'],
    enter_merchant_info: ['/menu/enter_merchant/enter_merchant_info', '入驻商家详情', 'anticon anticon-idcard'],
    merchant_approvement: ['/menu/merchant_approvement', '商家注册审核'],
    activity_approvement: ['/menu/activity_approvement', '活动信息审核'],
    activity_detail: ['/menu/activity_detail', '活动详情']
  };

  private subscription: Subscription;
  constructor(private componentCommunicator: ComponentCommunicateService) {
    const subscription = componentCommunicator.emitObsr.subscribe(
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

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
