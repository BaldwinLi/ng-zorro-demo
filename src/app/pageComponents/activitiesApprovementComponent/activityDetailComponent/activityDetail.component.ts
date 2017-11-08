import { Component, OnInit } from '@angular/core';
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
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dm: DataModelService,
        private componentCommunicator: ComponentCommunicateService
    ) { }

    goBack(): void {
        this.router.navigate(['/menu/activity_approvement']);
    }
    refreshData(id: String): void { }

    ngOnInit() {
        this.refreshData(this.id = this.route.params['_value']['id']);
        this.componentCommunicator.$emit('/menu/activity_detail');
    }
}
