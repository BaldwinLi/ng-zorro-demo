import { Component, OnInit } from '@angular/core';
import { isString } from 'lodash';
import { Lang } from '../../../../assets/i18n/i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { DataModelService } from '../../../pipes/model';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';

@Component({
    selector: 'app-activity-detail',
    templateUrl: './activityDetailTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class ActvityDetailComponent implements OnInit {
    id: String;
    loading: Boolean = false;
    loadingTip: String = Lang['loading_tip'];
    _isString: Function = isString;
    details: Array<{ type: string, label: string, value: string | Array<{ url: string, fileName: string }> }>;
    others: Array<{ type: string, label: string, value: string | Array<string | { url: string, fileName: string }> }>;
    columns: Array<{ id: String, label: string }>;
    data: Array<any> = [];
    desDetail: Array<{ type: string, label: string, value: string | Array<string | { url: string, fileName: string }> }>;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dm: DataModelService,
        private componentCommunicator: ComponentCommunicateService
    ) { }

    goBack($event: any): void {
        this.router.navigate(['/menu/activity_approvement']);
    }

    approve(event: any): void {

    }

    reject(event: any): void {

    }

    refreshData(id: String): void { }

    ngOnInit() {
        this.refreshData(this.id = this.route.params['_value']['id']);
        this.componentCommunicator.$emit('/menu/activity_detail');
        this.details = [
            {
                type: '',
                label: '活动类型',
                value: '大转盘'
            }, {
                type: '',
                label: '门店LOGO',
                value: [
                    {
                        url: '',
                        fileName: 'img.png'
                    }
                ]
            }, {
                type: '',
                label: '微信活动图',
                value: [
                    {
                        url: '',
                        fileName: 'img.png'
                    }
                ]
            }, {
                type: '',
                label: '活动标题',
                value: '丹阳这家皮肤管理店开业一周年庆啦！各种皮肤管理无门槛免费送！'
            }, {
                type: '',
                label: '活动宣传语',
                value: '活动时间短，速度来！'
            }, {
                type: '',
                label: '每位客户可点击抽奖次数',
                value: '1'
            }, {
                type: '',
                label: '分享到朋友圈后可多获得点击数',
                value: '1'
            }, {
                type: '',
                label: '商家特色描述',
                value: '就是好'
            }, {
                type: '',
                label: '门店',
                value: 'Amelie皮肤管理中心'
            }, {
                type: '',
                label: '活动日期',
                value: '2017/11/10-2017/12/25'
            }
        ];
        this.others = [
            {
                type: '',
                label: '预约信息',
                value: '需要提前预约'
            }, {
                type: '',
                label: '适合人群',
                value: '不限适用人员'
            }, {
                type: 'tags',
                label: '规则提醒',
                value: ['每次消费仅1张', '需当日体验完所有项目', '不可与其他优惠共享']
            }
        ];
        this.desDetail = [
            {
                type: '',
                label: '',
                value: [{
                    url: '',
                    fileName: 'img.png'
                }]
            }
        ];
    }
}
