import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Lang } from '../../../assets/i18n/i18n';
import { isObject } from 'lodash';

@Component({
    selector: 'app-datatable',
    templateUrl: './datatableTemplete.html',
    styles: []
})
export class DatatableComponent implements OnInit, OnChanges {
    @Input() current = 1;
    @Input() pageSize = 10;
    @Input() total = 1;
    @Input() columns: Array<any> = [];
    @Input() dataSet: Array<any> = [];
    @Input() loading: Boolean = false;
    @Input() isAjaxData: Boolean = true;
    @Input() isPagination: Boolean = true;
    // @Input()  loadingTip: String = Lang['loading_tip'];

    // @Output()  sortEmit: EventEmitter<any> = new EventEmitter<any>();
    // @Output()  selectedItem: EventEmitter<any> = new EventEmitter<any>();
    // @Output()  selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() outputPage: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() checkedItems: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    constructor() {
    }

    onCheckItem() {
        this.checkedItems.emit(this.dataSet.filter(e => e.checked));
    }

    pageIndexChange(event: any) {
        this.outputPage.emit({ pageIndex: this.current, pageSize: this.pageSize });
    }

    pageSizeChange(event: any) {
        this.outputPage.emit({ pageIndex: this.current, pageSize: this.pageSize });
    }

    ngOnInit() {
    }

    ngOnChanges() {
        // debugger
        // this.columns.map(v => {
        //     if (isObject(v.css)) {
        //         let cssStr = '';
        //         for (const e in v.css) {
        //             if (v.css[e]) {
        //                 cssStr += `${e}:${v.css[e]};`;
        //             }
        //         }
        //         v.css = cssStr;
        //     }
        //     return v;
        // });
    }
}
