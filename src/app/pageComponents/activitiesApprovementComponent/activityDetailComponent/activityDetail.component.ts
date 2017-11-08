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
    private id: String;
    private loading: Boolean = false;
    private loadingTip: String = Lang['loading_tip'];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dm: DataModelService,
        private componentCommunicator: ComponentCommunicateService
    ) { }

    private goBack(): void {
        this.router.navigate(['/menu/activity_approvement']);
    }
    private refreshData(id: String): void { }

    ngOnInit() {
        this.refreshData(this.id = this.route.params['_value']['id']);
        this.componentCommunicator.$emit('/menu/activity_detail');
    }
}
