import { Injectable } from '@angular/core';
import { startsWith, endsWith } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { NzMessageService } from 'ng-zorro-antd';
import { UtilService } from './baseServices/util.service';
import { AppRequestService } from './baseServices/appRequest.service';
// import { HttpService } from './HttpService';

@Injectable()
export class ActivityApprovementService {
    private appoint0: String = '需要提前预约';
    private appoint1: String = '国家节假日除外';
    private appoint3: String = '双休日除外';
    private appoint4: String = '无需预约,如遇高峰期您可能需要排队';

    private suit0: String = '不限适用人员';
    private suit1: String = '仅限本店会员';
    private suit2: String = '只适用初次到店的非会员使用';
    private suit3: String = '仅限女性';
    private suit4: String = '仅限男性';

    private rule0: String = '每次消费仅限1张';
    private rule1: String = '每张优惠券仅限1人';
    private rule2: String = '需当日体验完所有项目';
    private rule3: String = '不再与其他优惠同享';
    private rule5: String = '只适用于商家为您安排的技师';
    constructor(private appRequest: AppRequestService, private util: UtilService, private nms: NzMessageService) { }
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    getActivities(
        searchKey: string,
        activityDefId: string,
        status: string,
        pageNum: Number,
        pageSize: Number
    ): Observable<any> {
        const params = {
            searchKey: searchKey || '',
            approvalType: 'wechat_activity',
            activityDefId,
            status,
            pageNum,
            pageSize
        };
        return this.appRequest.queryWechatActivities(params).map(
            success => {
                const total = success.total;
                success.list = success && success.list.map(v => {
                    if (v && v.approvalForm) {
                        v.approvalForm = JSON.parse(v.approvalForm);
                    }
                    const activityType = v.approvalForm && (v.approvalForm.bigWheel ? '1' : (v.approvalForm.groupon ? '2' : '3'));
                    let activityContent;
                    let promImg;
                    switch (activityType) {
                        case '1':
                            activityContent = v.approvalForm && v.approvalForm.bigWheel;
                            if (activityContent && activityContent.promotionImageFileOss) {
                                promImg = {
                                    id: activityContent.promotionImageFile,
                                    url: activityContent.promotionImageFileOss,
                                    ossKey: activityContent.promotionImageFileOss,
                                    fileName: 'img.png'
                                };
                            }
                            break;
                        case '2':
                            activityContent = v.approvalForm && v.approvalForm.groupon;
                            if (activityContent && activityContent.promotionImage1Oss) {
                                promImg = {
                                    id: activityContent.promotionImage1,
                                    url: activityContent.promotionImage1Oss,
                                    ossKey: activityContent.promotionImage1Oss,
                                    fileName: 'img.png'
                                };
                            }
                            break;
                        case '3':
                            activityContent = v.approvalForm && v.approvalForm.toN;
                            if (activityContent && activityContent.promotionImage1Oss) {
                                promImg = {
                                    id: activityContent.promotionImage1,
                                    url: activityContent.promotionImage1Oss,
                                    ossKey: activityContent.promotionImage1Oss,
                                    fileName: 'img.png'
                                };
                            }
                            break;
                        default:
                            activityContent = { description: '' };
                    }

                    if (!promImg) {
                        // default promotion image
                        promImg = { url: '', fileName: '1.png' };
                    }

                    return {
                        id: v.id,
                        code: v.approvalForm && v.approvalForm.base && v.approvalForm.base.merchantCode || '',
                        name: v.approvalForm && v.approvalForm.base && v.approvalForm.base.merchantName || '',
                        status: v.status,
                        type: activityType,
                        image: [promImg],
                        content: [
                            {
                                label: v.approvalForm && v.approvalForm.base && v.approvalForm.base.merchantName || ''
                            }, {
                                label: activityContent.title || ''
                            }, {
                                label: '提交审批',
                                value: v.createTimeFmr
                            }, {
                                label: '审批状态',
                                value: v.status,
                                options: 'APPROVE_STATUS'
                            }, {
                                label: '审批时间',
                                value: v.approvalTimeFmr || '--'
                            }
                        ]
                    };
                });
                return {
                    list: success.list,
                    total
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

    getActivityDetail(id: string): Observable<any> {
        const scope = this;
        return this.appRequest.queryMerchantsApprovalDetail(id).map(
            success => {
                const list = [success].map(v => {
                    if (v && v.approvalForm) {
                        v.approvalForm = JSON.parse(v.approvalForm);
                    }
                    const activityType = v.approvalForm && (v.approvalForm.toN ? '1' : (v.approvalForm.bigWheel ? '2' : '3'));
                    let activityContent;
                    let listTitle;
                    let columns;
                    let dataList;
                    switch (activityType) {
                        case '1':
                            activityContent = v.approvalForm && v.approvalForm.toN;
                            listTitle = '活动内容明细(示例：玫瑰护理--1次/60分钟--300元)';
                            columns = [
                                {
                                    id: 'name',
                                    label: '项目名称',
                                    type: 'text'
                                }, {
                                    id: 'content',
                                    label: '项目内容(单位/次数/时长)',
                                    type: 'text'
                                }, {
                                    id: 'amount',
                                    label: '金额(元)',
                                    type: 'text'
                                }
                            ];
                            dataList = activityContent.contents && activityContent.contents.map(_v => {
                                return {
                                    name: _v.name,
                                    content: _v.content,
                                    amount: _v.amount,
                                };
                            });
                            break;
                        case '2':
                            activityContent = v.approvalForm && v.approvalForm.bigWheel;
                            listTitle = '奖项设置';
                            columns = [
                                {
                                    id: 'level',
                                    label: '奖品设置',
                                    type: 'text'
                                }, {
                                    id: 'prizeName',
                                    label: '奖品名称',
                                    type: 'text'
                                }, {
                                    id: 'prizeCount',
                                    label: '奖品数量',
                                    type: 'text'
                                }, {
                                    id: 'probability',
                                    label: '中奖概率',
                                    type: 'text'
                                }
                            ];
                            dataList = activityContent.prizes && activityContent.prizes.map(_v => {
                                return {
                                    level: _v.prize && (_v.prize.level + '等奖'),
                                    prizeName: _v.coupon && _v.coupon.couponName,
                                    prizeCount: _v.prize && _v.prize.prizeCount,
                                    probability: _v.prize && _v.prize.probability + '%'
                                };
                            });
                            break;
                        case '3':
                            activityContent = v.approvalForm && v.approvalForm.groupon;
                            listTitle = '活动内容明细(以下内容仅作为描述，不做业务处理)';
                            columns = [
                                {
                                    id: 'name',
                                    label: '项目名称',
                                    type: 'text'
                                }, {
                                    id: 'content',
                                    label: '项目内容(单位/次数/时长)',
                                    type: 'text'
                                }, {
                                    id: 'amount',
                                    label: '金额(元)',
                                    type: 'text'
                                }
                            ];
                            dataList = activityContent.contents && activityContent.contents.map(_v => {
                                return {
                                    name: _v.name,
                                    content: _v.content,
                                    amount: _v.amount,
                                };
                            });
                            break;
                        default:
                            activityContent = { description: '' };
                    }

                    const others = scope.getOthers(v.approvalForm.base);
                    const promotionImages = scope.getPromotionImages(activityContent);
                    return {
                        id: v.id.toString(),
                        activityType,
                        status: v.status || '',
                        details: [
                            {
                                type: '',
                                label: '活动类型',
                                value: activityType,
                                options: 'ACTIVITY_TYPES'
                            }, {
                                type: '',
                                label: '模式',
                                value: (activityContent.onetonMode || 0).toString(),
                                options: 'ONE_TO_N_MODE',
                                hidden: activityType !== '1'
                            }, {
                                type: '',
                                label: '活动性质',
                                value: activityContent.groupMode || false,
                                options: 'GROUP_MODE',
                                hidden: activityType !== '3'
                            }, {
                                type: 'image',
                                label: '门店LOGO',
                                hidden: activityType !== '2',
                                value: [
                                    {
                                        url: '',
                                        ossKey: activityContent.promotionLogoFileOss,
                                        fileName: 'img.png'
                                    }
                                ]
                            }, {
                                type: 'image',
                                label: '微信活动图',
                                hidden: activityType !== '2',
                                value: [
                                    {
                                        url: '',
                                        ossKey: activityContent.promotionImageFileOss,
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
                                type: 'image',
                                label: '活动宣传图',
                                hidden: activityType === '2',
                                value: promotionImages
                            }, {
                                type: '',
                                label: '活动惊爆价',
                                hidden: activityType !== '1',
                                value: activityContent.sellingPrice
                            }, {
                                type: '',
                                label: '可免单购买人数',
                                hidden: activityType !== '1',
                                value: activityContent.groupLevel
                            }, {
                                type: '',
                                label: '活动券',
                                hidden: activityType === '2',
                                value: activityContent.coupon && activityContent.coupon.couponName
                            }, {
                                type: '',
                                label: '每位客户可点击抽奖次数',
                                value: activityContent.drawCount || '0',
                                hidden: activityType !== '2'
                            }, {
                                type: '',
                                label: '分享到朋友圈后可多获得点击数',
                                value: activityContent.shareGetCount || '0',
                                hidden: activityType !== '2'
                            }, {
                                type: '',
                                label: '商家特色描述',
                                value: activityContent.featrueDescription
                            }, {
                                type: 'tags',
                                label: '活动适用门店',
                                color: '#108ee9',
                                value: v.approvalForm.shopList.map(_v => _v.fullName) || []
                            }, {
                                type: 'tags',
                                label: '团规模与金额(参团人数/团拼价格)',
                                hidden: activityType !== '3',
                                color: 'cyan',
                                value: this.getGrouponScope(activityContent)
                            }, {
                                type: '',
                                label: '成团有效期',
                                value: activityContent.hourSegment + '小时',
                                hidden: activityType !== '3'
                            }, {
                                type: '',
                                label: '活动限购',
                                value: activityContent.ngRepeat === -1 ? '不限' : `${activityContent.ngRepeat}件`,
                                hidden: activityType !== '3'
                            }, {
                                type: 'dateRange',
                                label: '活动日期',
                                value: [
                                    this.util.formatTimestamp(activityContent.startTime, 'yyyy-MM-dd'),
                                    this.util.formatTimestamp(activityContent.endTime, 'yyyy-MM-dd')]
                            }
                        ],
                        listTitle,
                        columns,
                        data: dataList,
                        others: [
                            {
                                type: 'tags',
                                label: '预约信息',
                                color: '#2db7f5',
                                value: others.appoint
                            }, {
                                type: 'tags',
                                label: '适合人群',
                                color: '#87d068',
                                value: others.suit
                            }, {
                                type: 'tags',
                                color: '#f50',
                                label: '规则提醒',
                                value: others.rule
                            }
                        ].concat(
                            {
                                type: 'tags',
                                color: 'pink',
                                label: '自定义规则',
                                value: v.approvalForm && v.approvalForm.details && v.approvalForm.details.filter(e => (e.type === 'rule' && !!e.content)).map(_v => _v.content)
                            }
                        ),
                        desDetail: v.approvalForm && v.approvalForm.details && v.approvalForm.details.map(_v => {
                            if (_v.type === 'image') {
                                return {
                                    type: 'image',
                                    value: [{
                                        id: _v.id || -1,
                                        url: _v.content || '',
                                        ossKey: _v.content || '',
                                        fileName: 'img.png'
                                    }]
                                };
                            } else if (_v.type === 'text') {
                                return {
                                    type: 'text',
                                    value: _v.content
                                };
                            } else {
                                return { url: '', fileName: '1.png' };
                            }
                        }),
                    };
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

    getOthers(base: any): { appoint: Array<string>, suit: Array<string>, rule: Array<string> } {
        const appoint = [];
        const suit = [];
        const rule = [];
        for (const e in base) {
            if (base[e]) {
                if (base[e] && this[e]) {
                    if (startsWith(e, 'appoint')) {
                        appoint.push(this[e]);
                    } else if (startsWith(e, 'suit')) {
                        suit.push(this[e]);
                    } else if (startsWith(e, 'rule')) {
                        rule.push(this[e]);
                    }
                }

                if (e === 'appoint2' && base[e]) {
                    appoint.push('需要提前' + base['appoint2Cnt'] + '天预约');
                } else if (e === 'appoint5' && base[e]) {
                    appoint.push(base['appoint5Start'] + '至' + base['appoint5End'] + '除外');
                } else if (e === 'rule4' && base[e]) {
                    appoint.push('可分' + base['rule4Cnt'] + '次体验完项目,不可更换门店');
                }
            }
        }
        return {
            appoint,
            suit,
            rule
        };
    }

    getPromotionImages(activityContent: Object): Array<{
        url: string,
        ossKey: string,
        fileName: string
    }> {
        const images = [];
        for (const e in activityContent) {
            if (activityContent[e] && startsWith(e, 'promotionImage') && endsWith(e, 'Oss')) {
                images.push({
                    url: '',
                    ossKey: activityContent[e],
                    fileName: 'img.png'
                });
            }
        }
        return images;
    }

    getGrouponScope(activityContent: Object): Array<string> {
        const scopes = [];
        const groups = [];
        const prices = [];
        for (const e in activityContent) {
            if (activityContent[e] && startsWith(e, 'group') && e.length === 6) {
                groups.push(activityContent[e]);
            } else if (activityContent[e] && startsWith(e, 'price') && e.length === 6) {
                prices.push(activityContent[e]);
            }
        }
        if (groups.length === prices.length) {
            groups.forEach((e, i) => {
                scopes.push(e + '人 / ' + prices[i] + '元');
            });
        }
        return scopes;
    }
}
