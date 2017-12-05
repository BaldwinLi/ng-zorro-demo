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

    loading: Boolean = false;
    loadingTip: String = Lang['loading_tip'];
    activtystatus: Array<{id: string, value: string}> = DataModelService.APPROVE_STATUS;
    activtyTypes: Array<{id: string, value: string}> = DataModelService.ACTIVITY_TYPES;
    condition: { type: string, status: string } = {
        type: '0',
        status: '0'
    };
    activityList: Array<{ id, code, name, status, type, image, content }>;
    activityListCach: Array<{ id, code, name, status, type, image, content }>;
    marchantKey: String = '';
    constructor(
        private router: Router,
        private componentCommunicator: ComponentCommunicateService,
        private entity: ActivityApprovementService
    ) { }

    queryDetail(id: String) {
        this.router.navigate(['/menu/activity_approvement/activity_detail', id]);
    }

    filterActivities(key: string, value: string, event, isScope): void {
        if (!isScope && (event && ((event.type === 'click' && event.srcElement.nodeName !== 'I') ||
            (event.type === 'keypress' && event.charCode !== 13))) && key === 'marchantKey'
        ) {
            return;
        }
        if (key === 'marchantKey') {
            this.activityList = this.activityListCach.filter(e => {
                return e.code.indexOf(this.marchantKey) > -1 || e.name.indexOf(this.marchantKey) > -1;
            });
        } else {
            this.condition[key] = value || this.condition[key];
            this.activityList = this.activityListCach.filter(e => {
                return (this.condition[key === 'type' ? 'status' : key] === '0' ||
                 e[key === 'type' ? 'status' : key] === this.condition[key === 'type' ? 'status' : key]);
            }).filter(e => {
                return (this.condition[key] === '0' || e[key] === this.condition[key]);
            });
        }

    }

    refreshData(event?: any): void {
        this.loading = true;
        this.entity.getActivities({}).subscribe(
            success => {
                this.activityList = this.activityListCach = success;
                this.filterActivities('', '', null, true);
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
