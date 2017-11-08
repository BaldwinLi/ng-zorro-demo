import { Component, OnInit } from '@angular/core';
import { Lang } from '../../../../assets/i18n/i18n';
import { Router } from '@angular/router';
import { DataModelService } from '../../../pipes/model';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';

@Component({
    selector: 'app-activities-approvement',
    templateUrl: './activitiesApprovementListTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class ActivitiesApprovementListComponent implements OnInit {

    private loading: Boolean = false;
    private loadingTip: String = Lang['loading_tip'];
    private activtystatus: Array<Object> = this.dm.APPROVE_STATUS;
    private activtyTypes: Array<Object> = this.dm.ACTIVITY_TYPES;
    private condition: Object = {
        type: '0',
        status: '0'
    };
    private activityList: Array<{ id, name, status, type, image, content }>;
    private activityListCach: Array<{ id, name, status, type, image, content }>;
    private marchantKey: String = '';
    constructor(
        private router: Router,
        private dm: DataModelService,
        private componentCommunicator: ComponentCommunicateService
    ) { }

    private queryDetail(id: String) {
        this.router.navigate(['/menu/enter_merchant/enter_merchant_info', id]);
    }

    private filterActivities(key: string, value: String, event): void {
        if (((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13)) && key === 'marchantKey'
        ) {
            return;
        }
        if (key === 'marchantKey') {
            this.activityList = this.activityListCach.filter(e => {
                return e.id.indexOf(this.marchantKey) > -1 || e.name.indexOf(this.marchantKey) > -1;
            });
        } else {
            this.activityList = this.activityListCach.filter(e => {
                return (value === '0') || e[key] === value;
            });
        }

    }

    private refreshData(): void {

    }

    ngOnInit() {
        this.activityList = this.activityListCach = [
            {
                id: '1',
                name: 'Amelie皮肤管理中心',
                status: '1',
                type: '2',
                image: [{ url: '', fileName: '1.png' }],
                content: [
                    {
                        label: 'Amelie皮肤管理中心'
                    }, {
                        label: '1280元起购原价3888韩式半永久套餐'
                    }, {
                        label: '发布日期',
                        value: '2017-10-31 16:58:32'
                    }, {
                        label: '活动状态',
                        value: '待审核'
                    }
                ]
            }, {
                id: '2',
                name: 'Bmelie皮肤管理中心',
                status: '2',
                type: '1',
                image: [{ url: '', fileName: '1.png' }],
                content: [
                    {
                        label: 'Bmelie皮肤管理中心'
                    }, {
                        label: '1280元起购原价3888韩式半永久套餐'
                    }, {
                        label: '发布日期',
                        value: '2017-10-31 16:58:32'
                    }, {
                        label: '活动状态',
                        value: '待审核'
                    }
                ]
            }
        ];
        this.refreshData();
        this.componentCommunicator.$emit('/menu/activity_approvement');
    }
}
