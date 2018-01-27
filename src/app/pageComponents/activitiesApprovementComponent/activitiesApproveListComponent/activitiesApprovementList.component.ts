import { Component, OnInit } from '@angular/core';
import { Lang } from '../../../../assets/i18n/i18n';
import { Router } from '@angular/router';
import { DataModelService } from '../../../pipes/model';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';
import { ActivityApprovementService } from '../../../services/activityApprovement.service';

@Component({
    selector: 'app-activities-approvement',
    templateUrl: './activitiesApprovementListTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class ActivitiesApprovementListComponent implements OnInit {
    current: Number = 1;
    pageSize: Number = 5;
    total: Number = 0;
    pageSizeSelector: Array<number> = [5, 10, 15, 20, 25, 30];
    loading: Boolean = false;
    loadingTip: String = Lang['loading_tip'];
    activtystatus: Array<{ id: string, value: string }> = DataModelService.APPROVE_STATUS;
    activtyTypes: Array<{ id: string, value: string }> = DataModelService.ACTIVITY_TYPES;
    condition: { activityDefId: string, status: string } = {
        activityDefId: '',
        status: ''
    };
    activityList: Array<{ id, code, name, status, type, image, content }>;
    activityListCach: Array<{ id, code, name, status, type, image, content }>;
    marchantKey: string;
    constructor(
        private router: Router,
        private componentCommunicator: ComponentCommunicateService,
        private entity: ActivityApprovementService
    ) { }

    queryDetail(id: String) {
        this.router.navigate(['/menu/activity_approvement/activity_detail', id]);
    }

    filterActivities(key: string, value: string, event, isScope?: boolean): void {
        if (!isScope && (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) && key === 'marchantKey'
        ) {
            return;
        }
        this.refreshData();
    }

    refreshData(event?: any): void {
        this.loading = true;
        this.entity.getActivities(
            this.marchantKey,
            this.condition.activityDefId,
            this.condition.status,
            this.current,
            this.pageSize
        ).subscribe(
            success => {
                this.activityList = this.activityListCach = success.list;
                this.total = success.total;
                // this.filterActivities('', '', null, true);
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
            );
    }

    ngOnInit() {
        this.refreshData();
        this.componentCommunicator.$emit('/menu/activity_approvement');
    }
}
