import { Injectable } from '@angular/core';

@Injectable()
export class DataModelService {
    constructor() {

    }

    ACTIVITY_TYPES: Array<Object> = [
        {
            id: '0',
            value: '全部'
        }, {
            id: '1',
            value: '大转盘'
        }, {
            id: '2',
            value: '团购'
        }, {
            id: '3',
            value: '1拖N'
        }
    ];

    APPROVE_STATUS: Array<Object> = [
        {
            id: '0',
            value: '全部'
        }, {
            id: '1',
            value: '待审核'
        }, {
            id: '2',
            value: '通过'
        }, {
            id: '3',
            value: '驳回'
        }
    ];

    init(): any {
    }

    private buildDataModel(data): void {
    }

}
