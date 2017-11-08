import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isString } from 'lodash';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';

@Component({
    selector: 'app-enter-merchant-info',
    templateUrl: './enterMerchantInfoTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class EnterMerchantInfoComponent implements OnInit {
    id;
    private contact: Array<Object> = [
        {
            id: '',
            label: '联系人',
            value: '海波'
        },
        {
            id: '',
            label: '手机号',
            value: '13XXXXXXXXX'
        },
        {
            id: '',
            label: '常用邮箱',
            value: 'xxx@xxx.com'
        }
    ];

    private merchantInfo: Array<Object> = [{
        id: '',
        label: '商户全称',
        value: 'Amelie韩式皮肤管理中心'
    }, {
        id: '',
        label: '商户简称',
        value: 'Amelie'
    }, {
        id: '',
        label: '经营类别',
        value: '美容'
    }, {
        id: '',
        label: '商户注册地',
        value: 'xxxxxx'
    }, {
        id: '',
        label: '公司法人',
        value: 'xxxx'
    }, {
        id: '',
        label: '法人身份证',
        value: 'xxxxxxxxxxxxxxxxxx'
    }, {
        id: '',
        label: '身份证正反面',
        value: [
            {
                url: '',
                fileName: 'frontside.png'
            }, {
                url: '',
                fileName: 'reverseside.png'
            }
        ]
    }, {
        id: '',
        label: '营业执照编号',
        value: 'xxxxxxxxx'
    }, {
        id: '',
        label: '营业执照扫描件',
        value: [
            {
                url: '',
                fileName: 'xxxx.png'
            }
        ]
    }, {
        id: '',
        label: '组织机构代码证扫描件',
        value: [
            {
                url: '',
                fileName: 'xxxx.png'
            }
        ]
    }];

    private accountInfo: Array<Object> = [{
        id: '',
        label: '商户手机号',
        value: '13000000000'
    }, {
        id: '',
        label: '银行卡类型',
        value: '储蓄卡'
    }, {
        id: '',
        label: '开户银行',
        value: '中国建设银行'
    }, {
        id: '',
        label: '开户银行分行',
        value: '大连分行'
    }, {
        id: '',
        label: '开户银行支行',
        value: '高新园区支行'
    }, {
        id: '',
        label: '银行卡号',
        value: 'xxxxxxxxxxxxxxxxxx'
    }, {
        id: '',
        label: '持卡人姓名',
        value: 'xxxxxxxxx'
    }, {
        id: '',
        label: '持卡人银行注册手机号',
        value: '13000000000'
    }, {
        id: '',
        label: '开户凭证',
        value: [
            {
                url: '',
                fileName: 'credentials.png'
            }
        ]
    }, {
        id: '',
        label: '账户审核状态',
        value: '待审核'
    }];

    private _isString = isString;

    private IDImages: Array<Object> = [
        {
            url: '',
            fileName: 'text.png'
        },
        {
            url: '',
            fileName: 'text.png'
        }
    ];

    private LogoImages: Array<Object> = [{
        url: '',
        fileName: 'text.png'
    }];


    constructor(private route: ActivatedRoute, private componentCommunicator: ComponentCommunicateService) { }
    ngOnInit() {
        this.componentCommunicator.$emit('/menu/enter_merchant/enter_merchant_info');
        this.id = this.route.params['_value']['id'];
    }
}
