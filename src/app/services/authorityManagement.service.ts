import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UtilService } from './baseServices/util.service';

@Injectable()
export class AuthorityManagementService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService, private util: UtilService) { }

    getPositionPermissions(merchant: number): Observable<any> {
        return this.appRequest.queryPositionPermissions(merchant).map(
            success => success
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    getPermissions(): Observable<any> {
        return this.appRequest.queryPermissions().map(
            success => success
        ).catch(
            error => {
                this.nms.error('查询失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    setPositionPermission(merchant: number, params: Object): Observable<any> {
        return this.appRequest.updatePositionPermission(merchant, params).catch(
            error => {
                this.nms.error('授权失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
