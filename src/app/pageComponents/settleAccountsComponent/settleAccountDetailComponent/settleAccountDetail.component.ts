import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isObject } from 'lodash';
import { DataModelService } from '../../../pipes/model';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';
import { SettleAccountsService } from '../../../services/settleAccounts.service';

@Component({
    selector: 'app-settle-account-detail',
    templateUrl: './settleAccountDetailTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class SettleAccountDetailComponent implements OnInit {
    current: Number = 1;
    pageSize: Number = 10;
    total = 0;
    data: Array<any> = [];
    loading: Boolean = false;
    columns: Array<any>;

    constructor(
        private componentCommunicator: ComponentCommunicateService,
        private route: ActivatedRoute,
        private entity: SettleAccountsService
    ) {
    }

    refreshData(event?: any): void {
        this.loading = true;
        this.entity.getSettleAccountDetail(
            this.route.params['_value']['id'],
            this.current,
            this.pageSize
        ).subscribe(
            success => {
                this.data = success.list;
                this.current = success.current || 1;
                this.total = success.total;
                this.loading = false;
            },
            error => {
                this.loading = false;
            }
        );
    }

    ngOnInit() {
        const scope = this;
        this.componentCommunicator.$emit('/menu/settle_accounts/settle_account_detail');
        this.refreshData();
        this.columns = [
            {
                id: 'merchantCode',
                label: '订单号',
                type: 'text'
            },
            {
                id: 'fullName',
                label: '活动类型',
                type: 'text'
            },
            {
                id: 'contact',
                label: '活动名称',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '兑换券名称',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '订单结算金额',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '参与时间',
                type: 'text'
            },
            {
                id: 'registeredAddress',
                label: '核销时间',
                type: 'text'
            }
        ];
    }
}
