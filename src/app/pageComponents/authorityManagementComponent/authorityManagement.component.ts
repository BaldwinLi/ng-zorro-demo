import { Component, OnInit } from '@angular/core';
import { debounce } from 'lodash';
import { ComponentCommunicateService } from '../../services/baseServices/componentCommunicate.service';
import { EnterMerchantService } from '../../services/enterMerchant.service';
import { AuthorityManagementService } from '../../services/authorityManagement.service';

@Component({
    selector: 'app-authority-management',
    templateUrl: './authorityManagementTemplate.html',
    styleUrls: ['../../../assets/css/custom.css']
})
export class AuthorityManagementComponent implements OnInit {
    constructor(
        private merchantSvc: EnterMerchantService,
        private componentCommunicator: ComponentCommunicateService,
        private authSvc: AuthorityManagementService
    ) { }
    loading: Boolean = false;
    merchantOptionsLoading: Boolean = false;
    merchantId: number;
    columns: Array<any>;
    data: Array<any>;
    selectedMerchant: Array<{ id: number, label: string, value: string }> = [];
    merchantOptions: Array<{
        merchantId: number,
        merchantCode: string,
        fullName: string,
        contact: string,
        contactPhone: string,
        registeredAddress: string
    }>;

    searchMerchant(key?: string): void {
        const scope = this;
        this.merchantOptionsLoading = true;
        debounce(() => {
            this.merchantSvc.getMerchants({
                searchKey: key || ''
            }).subscribe(
                success => {
                    scope.merchantOptionsLoading = false;
                    scope.merchantOptions = success.list;
                },
                error => {
                    scope.merchantOptionsLoading = false;
                }
                );
        }, 200)();
    }

    selectMerchant(isOpen: Boolean): void {
        if (!isOpen) {
            this.refreshData();
            this.selectedMerchant.length = 0;
            const merchant = this.merchantOptions.filter(_e => (_e.merchantId === this.merchantId))[0];
            for (const e in merchant) {
                if (merchant[e]) {
                    switch (e) {
                        case 'merchantCode':
                            this.selectedMerchant.push({
                                id: 1,
                                label: '商家编号:',
                                value: merchant[e]
                            });
                            break;
                        case 'fullName':
                            this.selectedMerchant.push({
                                id: 2,
                                label: '商家全称:',
                                value: merchant[e]
                            });
                            break;
                        case 'contact':
                            this.selectedMerchant.push({
                                id: 3,
                                label: '商家联系人:',
                                value: merchant[e]
                            });
                            break;
                        case 'contactPhone':
                            this.selectedMerchant.push({
                                id: 4,
                                label: '商家联系人手机号:',
                                value: merchant[e]
                            });
                            break;
                        case 'registeredAddress':
                            this.selectedMerchant.push({
                                id: 5,
                                label: '商家注册地址:',
                                value: merchant[e]
                            });
                            break;
                    }
                    this.selectedMerchant = this.selectedMerchant.sort((p, n) => (p.id - n.id));
                }
            }
        }
    }

    refreshData(): void {
        if (!this.merchantId) {
            return;
        }
        const scope = this;
        this.loading = true;
        this.authSvc.getPermissions().subscribe(
            success => {
                scope.authSvc.getPositionPermissions(scope.merchantId).subscribe(
                    _success => {
                        scope.loading = false;
                        scope.columns = [{ id: 'permissionName', label: '页面权限', type: 'text' }].concat(_success.map(v => ({
                            id: 'isActive_' + v.positionId,
                            positionId: v.positionId,
                            label: v.positionName,
                            type: 'switch',
                            checked: '开',
                            unchecked: '关',
                            callback: scope.submitPermisson.bind(scope)
                        })));
                        scope.data = success.map((v, i) => {
                            const result = {
                                permissionId: v.permissionId,
                                permissionName: v.permissionName
                            };
                            _success.forEach((e) => {
                                if (e.positionPermissions && e.positionPermissions.length > 0) {
                                    const positionPermission = e.positionPermissions.find(_e => _e.permissionId === v.permissionId);
                                    result['isActive_' + e.positionId] = positionPermission && positionPermission.isActive || false;
                                } else {
                                    result['isActive_' + e.positionId] = false;
                                }
                            });
                            return result;
                        });
                    },
                    _error => {
                        scope.loading = false;
                    }
                );
            },
            error => {
                scope.loading = false;
            }
        );
    }

    submitPermisson(row, col): void {
        const scope = this;
        this.authSvc.setPositionPermission(this.merchantId, {
            isActive: row[col.id],
            permissionId: row.permissionId,
            positionId: col.positionId
        }).subscribe(
            null,
            error => {
                row[col.id] = !row[col.id];
            }
            );
    }

    ngOnInit() {
        this.componentCommunicator.$emit('/menu/authority_management');
    }
}
