import { Component, OnInit } from '@angular/core';
import { isString } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Lang } from '../../../../../assets/i18n/i18n';
import { ComponentCommunicateService } from '../../../../services/baseServices/componentCommunicate.service';
import { EnterMerchantService } from '../../../../services/enterMerchant.service';
@Component({
    selector: 'app-merchant-account-info',
    template: `
<nz-layout class="layout">
<nz-spin [nzSize]="'large'" [nzSpinning]="loading" [nzTip]="loadingTip">
    <nz-header nzTheme="light" class="platform-header">
        门店账户详情
    </nz-header>
    <nz-content>
            <div *ngFor="let item of accountInfo" class="nz-row-margin" nz-form-item nz-row>
            <div nz-form-label nz-col [nzSpan]="4">
                <label>{{item.label}}</label>
            </div>
            <div nz-form-control nz-col [nzSpan]="14">
                <span nz-form-text *ngIf="_isString(item.value)">{{item.value}}</span>
                <span *ngIf="item.type==='tag' && !_isString(item.value)">
                    <nz-tag *ngFor="let tag of item.value" [nzColor]="'#2db7f5'">{{tag.dataName}}</nz-tag>
                </span>
                <span nz-form-text *ngIf="item.type==='img' && !_isString(item.value)">
                    <app-upload-image [url]="" [readonly]="true" [uploadedFiles]="item.value"></app-upload-image>
                </span>
            </div>
        </div>
    </nz-content>
    </nz-spin>
</nz-layout>
    `,
    styleUrls: ['../../../../../assets/css/custom.css']
})
export class EnterMerchantAccountInfoComponent implements OnInit {
    id: string;
    merchantId: string;
    loading: Boolean = false;
    loadingTip: String = Lang['loading_tip'];
    accountInfo: Array<any> = [];
    _isString: Function = isString;
    constructor(
        private route: ActivatedRoute,
        private componentCommunicator: ComponentCommunicateService,
        private entity: EnterMerchantService
    ) { }

    refreshData(event?: any) {
        this.loading = true;
        this.entity.getMerchantAccountById(this.merchantId, this.id).subscribe(
            success => {
                this.accountInfo = success;
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
    }

    ngOnInit() {
        const scope = this;
        this.id = this.route.params['_value']['id'];
        this.merchantId = this.route.params['_value']['merchantId'];
        this.componentCommunicator.$emit(`/menu/enter_merchant/enter_merchant_info/${this.merchantId}/enter_merchant_account`);
        this.refreshData();
    }
}
