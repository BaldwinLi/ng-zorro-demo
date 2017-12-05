import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NzMessageService } from 'ng-zorro-antd';
import { UtilService } from './baseServices/util.service'
import { AppRequestService } from './baseServices/appRequest.service';
// import { HttpService } from './HttpService';

@Injectable()
export class ActivityApprovementService {
    constructor(private appRequest: AppRequestService, private util: UtilService, private nms: NzMessageService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getActivities(params?: any): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=wechat_activity&status=').map(
            success => {
                success.list = success && success.list.map(v => {
                    if (v && v.approvalForm) {
                        v.approvalForm = JSON.parse(v.approvalForm);
                    }
                    const activityType = v.approvalForm && (v.approvalForm.bigWheel ? '1' : (v.approvalForm.groupon ? '2' : '3'));
                    let activityContent;
                    switch (activityType) {
                        case '1':
                            activityContent = v.approvalForm && v.approvalForm.bigWheel;
                            break;
                        case '2':
                            activityContent = v.approvalForm && v.approvalForm.groupon;
                            break;
                        case '3':
                            activityContent = v.approvalForm && v.approvalForm.toN;
                            break;
                        default:
                            activityContent = { description: '' };
                    }

                    return {
                        id: v.id,
                        code: v.approvalForm && v.approvalForm.base && v.approvalForm.base.merchantCode || '',
                        name: v.approvalForm && v.approvalForm.base && v.approvalForm.base.merchantName || '',
                        status: v.status,
                        type: activityType,
                        image: v.approvalForm && v.approvalForm.base && v.approvalForm.base.image || [{ url: '', fileName: '1.png' }],
                        content: [
                            {
                                label: v.approvalForm && v.approvalForm.base && v.approvalForm.base.merchantName
                            }, {
                                label: activityContent.description
                            }, {
                                label: '发布日期',
                                value: v.createTimeFmr
                            }, {
                                label: '活动状态',
                                value: v.status,
                                options: 'APPROVE_STATUS'
                            }
                        ]
                    };
                });
                return success.list;
            }
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
            );
    }

    getActivityDetail(params?: any): Observable<any> {
        return this.appRequest.queryMerchantsApproval('?approvalType=wechat_activity&status=').map(
            success => {
                success.list = success && success.list.map(v => {
                    if (v && v.approvalForm) {
                        v.approvalForm = JSON.parse(v.approvalForm);
                    }
                    const activityType = v.approvalForm && (v.approvalForm.bigWheel ? '1' : (v.approvalForm.groupon ? '2' : '3'));
                    let activityContent;
                    switch (activityType) {
                        case '1':
                            activityContent = v.approvalForm && v.approvalForm.bigWheel;
                            break;
                        case '2':
                            activityContent = v.approvalForm && v.approvalForm.groupon;
                            break;
                        case '3':
                            activityContent = v.approvalForm && v.approvalForm.toN;
                            break;
                        default:
                            activityContent = { description: '' };
                    }

                    return {
                        id: v.id.toString(),
                        details: [
                            {
                                type: '',
                                label: '活动类型',
                                value: activityType,
                                options: 'ACTIVITY_TYPES'
                            }, {
                                type: '',
                                label: '门店LOGO',
                                value: [
                                    {
                                        url: '',
                                        fileName: 'img.png'
                                    }
                                ]
                            }, {
                                type: '',
                                label: '微信活动图',
                                value: [
                                    {
                                        url: '',
                                        fileName: 'img.png'
                                    }
                                ]
                            }, {
                                type: '',
                                label: '活动标题',
                                value: activityContent.title
                            }, {
                                type: '',
                                label: '活动宣传语',
                                value: activityContent.description
                            }, {
                                type: '',
                                label: '每位客户可点击抽奖次数',
                                value: activityContent.drawCount
                            }, {
                                type: '',
                                label: '分享到朋友圈后可多获得点击数',
                                value: activityContent.shareGetCount
                            }, {
                                type: '',
                                label: '商家特色描述',
                                value: activityContent.featrueDescription
                            }, {
                                type: '',
                                label: '门店',
                                value: v.approvalForm && v.approvalForm.base && v.approvalForm.base.merchantName || ''
                            }, {
                                type: '',
                                label: '活动日期',
                                value: this.util.formatTimestamp(activityContent.startTime, 'yyyy-MM-dd hh:mm:ss')
                            }
                        ],
                        data: activityContent.prizes && activityContent.prizes.map(v=>{
                            v.level = v.level + '等奖';
                            return v;
                        }),
                        others: [
                            {
                                type: '',
                                label: '预约信息',
                                value: '需要提前预约'
                            }, {
                                type: '',
                                label: '适合人群',
                                value: '不限适用人员'
                            }, {
                                type: 'tags',
                                label: '规则提醒',
                                value: ['每次消费仅1张', '需当日体验完所有项目', '不可与其他优惠共享']
                            }
                        ],
                        desDetail: [
                            {
                                type: '',
                                label: '',
                                value: [{
                                    url: '',
                                    fileName: 'img.png'
                                }]
                            }
                        ]
                    };
                });
                return success.list;
            }
        ).catch(
            error => Observable.create((obsr) => {
                obsr.error(error);
            })
            );
    }

    approveActivity(param?: any): Observable<any> {
        return this.appRequest.approveMerchants(param).map(
            success => {
                this.nms.success('审核已提交');
                return 'sccuess';
            }
        ).catch(
            error => {
                this.nms.error('审核失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
