import { Component, OnInit } from '@angular/core';
import { AppRequestService } from '../../services/baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-credential-dialog',
    template: `<img [src]="imageUrl">`
    // `
    // <nz-spin [nzSize]="'small'" [nzSpinning]="loading">
    //     <div class="img-ul-image" [ngStyle]="{'background-image': 'url('+ imageUrl +')', 'background-size': 'auto'}"></div>
    // </nz-spin>
    // `
    // styleUrls: ['../../components/uploadImageComponent/uploadImage.css']
})
export class CredentialDialogComponent implements OnInit {
    imageUrl: string;
    ossKey: string;
    loading: Boolean = false;

    constructor(private appReq: AppRequestService, private nms: NzMessageService) { }
    ngOnInit() {
        const scope = this;
        if (scope.ossKey) {
            scope.loading = true;
            scope.appReq.getOssKey(scope.ossKey).subscribe(
                success => {
                    scope.loading = false;
                    scope.imageUrl = success.ossKey && success.url || './assets/image/default.png';
                },
                error => {
                    scope.loading = false;
                    scope.imageUrl = './assets/image/default.png';
                    scope.nms.error('ossKey查询失败');
                }
            );
        } else {
            scope.imageUrl = './assets/image/default.png';
        }
    }
}
