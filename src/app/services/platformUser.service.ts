import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';
// import { HttpService } from './HttpService';

@Injectable()
export class PlatformUserService {
    constructor(private appRequest: AppRequestService, private nms: NzMessageService) { }

    getPlatformUsers(userRole: String, pageNum: Number, pageSize: Number): Observable<any> {
        const params = {
            userRole,
            pageNum,
            pageSize
        };
        return this.appRequest.queryPlatformUsers(params).map(
            success => {
                return {
                    current: success.pageNum,
                    total: success.total,
                    list: success.list.map(v => {
                        v.userRole = (v.groups && v.groups[0] && v.groups[0].groupCode || '').replace(/\platform_/g, '');
                        return v;
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

    addPlatformUser(params: object): Observable<any> {
        return this.appRequest.insertPlatformUser(params).map(
            success => {
                this.nms.success('用户已添加');
                return success;
            }
        ).catch(
            error => {
                this.nms.error(error.error && error.error.text || '新增用户失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    updatePlatformUserPassword(params: object): Observable<any> {
        return this.appRequest.updatePlatformUserPassword(params).map(
            success => {
                this.nms.success('用户密码修改成功');
                return success;
            }
        ).catch(
            error => {
                this.nms.error('用户密码修改失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }

    updatePlatformUserStatus(username: String): Observable<any> {
        return this.appRequest.updatePlatformUserStatus(username).map(
            success => {
                this.nms.success(success.isActive ? '账户已启用' : '账户已停用');
                return success;
            }
        ).catch(
            error => {
                this.nms.error('设置失败');
                return Observable.create((obsr) => {
                    obsr.error(error);
                });
            }
            );
    }
}
