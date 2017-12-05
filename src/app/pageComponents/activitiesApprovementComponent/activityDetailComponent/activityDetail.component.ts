import { Component, OnInit } from '@angular/core';
import { isString, isObject } from 'lodash';
import { Lang } from '../../../../assets/i18n/i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { DataModelService } from '../../../pipes/model';
import { ApproveDialogComponent } from '../../dialogCmopponent/approveDialog.component';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';
import { ActivityApprovementService } from '../../../services/activityApprovement.service';

@Component({
    selector: 'app-activity-detail',
    templateUrl: './activityDetailTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class ActvityDetailComponent implements OnInit {
    id: string;
    loading: Boolean = false;
    loadingTip: String = Lang['loading_tip'];
    _isString: Function = isString;
    approveWin: NzModalSubject;
    details: Array<{ type: string, label: string, options?: string, value: string | Array<{ url: string, fileName: string }> }>;
    others: Array<{ type: string, label: string, value: string | Array<string | { url: string, fileName: string }> }>;
    columns: Array<{ id: string, label: string, type: string }> = [
        {
            id: 'level',
            label: '奖品设置',
            type: 'text'
        }, {
            id: 'consume',
            label: '奖品名称',
            type: 'text'
        }, {
            id: 'prizeCount',
            label: '奖品数量',
            type: 'text'
        }, {
            id: 'probability',
            label: '中奖概率',
            type: 'text'
        }
    ];
    data: Array<any> = [];
    desDetail: Array<{ type: string, label: string, value: string | Array<string | { url: string, fileName: string }> }>;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dm: DataModelService,
        private model: NzModalService,
        private componentCommunicator: ComponentCommunicateService,
        private entity: ActivityApprovementService
    ) { }

    goBack($event?: any): void {
        this.router.navigate(['/menu/activity_approvement']);
    }

    approve(event: any): void {
        this.approveWin = this.model.open({
            title: '活动审核',
            content: ApproveDialogComponent,
            footer: false,
            maskClosable: false
        });
        this.approveWin.subscribe(result => {
            if (isObject(result)) {
                this.loading = true;
                this.entity.approveActivity({
                    id: parseInt(this.id),
                    comment: result.resultReason,
                    status: result.result
                }).subscribe(
                    success => {
                        this.goBack();
                        this.loading = false;
                    },
                    error => {
                        this.loading = false;
                    }
                    );
            }
        });
    }

    refreshData(id: String): void {
        this.loading = true;
        this.entity.getActivityDetail({ id }).subscribe(
            success => {
                success = success && success.filter(e => (e.id === id));
                const detailObj = success[0];
                if(detailObj) {
                    this.details = detailObj.details;
                    this.data = detailObj.data || [];
                    this.others = detailObj.others;
                    this.desDetail = detailObj.desDetail;
                }
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
    }

    ngOnInit() {
        this.refreshData(this.id = this.route.params['_value']['id']);
        this.componentCommunicator.$emit('/menu/activity_approvement/activity_detail');
    }
}
