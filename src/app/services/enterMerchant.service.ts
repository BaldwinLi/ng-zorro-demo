import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
// import { HttpService } from './HttpService';

@Injectable()
export class EnterMerchantService {
    constructor(
        private appRequest: AppRequestService,
        private nms: NzMessageService
    ) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getMerchants(params?: any): Observable<any> {
        return this.appRequest.queryMerchants(params).map(
            success => {
                return {
                    list: success.list,
                    current: success.pageNum,
                    total: success.total
                };
            }
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    getMerchantDetail(id: string): Observable<any> {
        return this.appRequest.queryMerchantDetail('/' + id).map(
            success => {
                return {
                    contact: [
                        {
                            id: 'contact',
                            label: '联系人',
                            value: success['contact']
                        },
                        {
                            id: 'contactPhone',
                            label: '手机号',
                            value: success['contactPhone']
                        },
                        {
                            id: 'commonEmail',
                            label: '常用邮箱',
                            value: success['commonEmail']
                        }
                    ],
                    merchantInfo: [{
                        id: 'fullName',
                        label: '商户全称',
                        value: success['fullName']
                    }, {
                        id: 'shortName',
                        label: '商户简称',
                        value: success['shortName']
                    }, {
                        id: 'businessScopeDetails',
                        label: '经营类别',
                        value: success['businessScopeDetails'],
                        type: 'tag'
                    }, {
                        id: 'registeredAddress',
                        label: '商户注册地',
                        value: success['registeredAddress']
                    }, {
                        id: 'corporate',
                        label: '公司法人',
                        value: success['corporate']
                    }, {
                        id: 'corporateIdCard',
                        label: '法人身份证',
                        value: success['corporateIdCard']
                    }, {
                        id: '',
                        label: '身份证正反面',
                        value: (success['merchantFiles'] || []).filter(e => {
                            return e.businessType === 'corporate-positive' || e.businessType === 'corporate-negative';
                        }).map(v => {
                            return {
                                url: v.url,
                                fileName: v.fileName
                            };
                        }),
                        type: 'img'
                    }, {
                        id: 'organizationCode',
                        label: '营业执照编号',
                        value: success['organizationCode']
                    }, {
                        id: '',
                        label: '营业执照扫描件',
                        value: (success['merchantFiles'] || []).filter(e => {
                            return e.businessType === 'business-license';
                        }).map(v => {
                            return {
                                url: v.url,
                                fileName: v.fileName
                            };
                        }),
                        type: 'img'
                    }, {
                        id: '',
                        label: '组织机构代码证扫描件',
                        value: (success['merchantFiles'] || []).filter(e => {
                            return e.businessType === 'organization';
                        }).map(v => {
                            return {
                                url: v.url,
                                fileName: v.fileName
                            };
                        }),
                        type: 'img'
                    }],
                    IDImages: (success['merchantFiles'] || []).filter(e => {
                        return e.businessType === 'contact-positive' || e.businessType === 'contact-negative';
                    }).map(v => {
                        return {
                            url: v.url,
                            fileName: v.fileName
                        };
                    }),
                    LogoImages: (success['merchantFiles'] || []).filter(e => {
                        return e.businessType === 'merchant-logo';
                    }).map(v => {
                        return {
                            url: v.url,
                            fileName: v.fileName
                        };
                    })
                };
            }
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    addMerchant(param?: any): Observable<any> {
        param.registeredUsername = param.contact;
        return this.appRequest.insertMerchant(param).map(
            success => {
                this.nms.success('新增成功！');
            }
        ).catch(
            error => {
                this.nms.error('新增失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    getMerchantAccounts(merchantId: string): Observable<any> {
        return this.appRequest.queryMerchantDetail(`/${merchantId}/bank-acccounts`).map(
            success => {
                const list = [];
                success.forEach(e => {
                    e.accountShops.forEach(el => {
                        const approvalDetails = e.approvalDetails;
                        delete e.approvalDetails;
                        delete e.accountShops;
                        list.push({
                            ...e,
                            ...el,
                            ...approvalDetails,
                        });
                    });
                });
                return list;
            }
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    getMerchantAccountById(merchantId: string, bankAccountId: string): Observable<any> {
        return this.appRequest.queryMerchantDetail(`/${merchantId}/bank-account/${bankAccountId}`).map(
            success => {
                return [{
                    id: 'accountHolderPhone',
                    label: '商户手机号',
                    value: success['accountHolderPhone']
                }, {
                    id: 'accountType',
                    label: '银行卡类型',
                    value: success['accountType']
                }, {
                    id: 'depositBankName',
                    label: '开户银行',
                    value: success['depositBankName']
                }, {
                    id: 'bankSubsidiaryName',
                    label: '开户银行分行',
                    value: success['bankSubsidiaryName']
                }, {
                    id: 'bankBranchName',
                    label: '开户银行支行',
                    value: success['bankBranchName']
                }, {
                    id: 'accountNo',
                    label: '银行卡号',
                    value: success['accountNo']
                }, {
                    id: 'accountHolder',
                    label: '持卡人姓名',
                    value: success['accountHolder']
                }, {
                    id: 'accountHolderPhone',
                    label: '持卡人银行注册手机号',
                    value: success['accountHolderPhone']
                }, {
                    id: '',
                    label: '开户凭证',
                    value: [
                        success['accountOpeningCertificateFile'] || {
                            url: '',
                            fileName: 'credentials.png'
                        }
                    ],
                    type: 'img'
                }, {
                    id: 'status',
                    label: '账户审核状态',
                    value: success.approvalDetails && success.approvalDetails['status']
                }];
            }
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
