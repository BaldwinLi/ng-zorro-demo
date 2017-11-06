import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentCommunicateService } from '../../../services/baseServices/componentCommunicate.service';

@Component({
    selector: 'app-enter-merchant-info',
    templateUrl: './enterMerchantInfoTemplate.html'
})
export class EnterMerchantInfoComponent implements OnInit {
    id;
    private contact: Array<Object> = [
        {
            id: 'contactName',
            label: '联系人',
            value: '海波'
        },
        {
            id: 'phoneNum',
            label: '手机号',
            value: '13XXXXXXXXX'
        },
        {
            id: 'email',
            label: '常用邮箱',
            value: 'xxx@xxx.com'
        }
    ];

    private uploadedFiles: Array<Object> = [
        {
            url: '',
            fileName: 'text.txt'
        }
    ];

    constructor(private route: ActivatedRoute, private componentCommunicator: ComponentCommunicateService) { }
    ngOnInit() {
        this.componentCommunicator.$emit('/menu/enter_merchant/enter_merchant_info');
        this.id = this.route.params['_value']['id'];
    }
}
