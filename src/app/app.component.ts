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
  private subscription: Subscription;
  constructor(private componentCommunicator: ComponentCommunicateService) {
    const subscription = componentCommunicator.emitObsr.subscribe(
      item => {
        const names = item.name.split('/');
        setTimeout(() => {
          this.breadcrumbItems = this.breadcrumbItems.filter(e => (names.includes(e['name']) && e['name'] !== item.name));
          this.breadcrumbItems.push(item);
        });
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
