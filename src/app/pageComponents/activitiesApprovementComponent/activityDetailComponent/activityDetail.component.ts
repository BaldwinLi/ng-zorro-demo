import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { Lang } from '../../../../assets/i18n/i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { DataModelService } from '../../../pipes/model';
import { ApproveDialogComponent } from '../../dialogComponent/approveDialog.component';
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
    _isObject: Function = isObject;
    approveWin: NzModalSubject;
    enableApprove: Boolean = false;
    listTitle: string;
    details: Array<{ type: string, label: string, options?: string, color?: string, value: string | Array<{ url: string, fileName: string }> }>;
    others: Array<{ type: string, color?: string, label: string, value: string | Array<string | { url: string, fileName: string }> }>;
    columns: Array<{ id: string, label: string, type: string }> = [];
    data: Array<any> = [];
    desDetail: {
        text: {type: string, label: string, value: string | Array<string>},
        image: {type: string, label: string, value: string | Array<string | { url: string, fileName: string }>},
    };
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
                    id: parseInt(this.id, 0),
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

    refreshData(id: string): void {
        this.loading = true;
        this.entity.getActivityDetail(id).subscribe(
            success => {
                // success = success && success[0];
                const detailObj = success[0];
                if (detailObj) {
                    this.details = detailObj.details.filter(e => !e.hidden);
                    this.listTitle = detailObj.listTitle;
                    this.columns = detailObj.columns;
                    this.data = detailObj.data || [];
                    this.others = detailObj.others.filter(e => e.value.length > 0);
                    this.desDetail = detailObj.desDetail;
                    this.enableApprove = (detailObj.status === 'under_approval');
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
