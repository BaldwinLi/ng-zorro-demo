import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lang } from '../../../assets/i18n/i18n';

@Component({
    selector: 'app-datatable',
    templateUrl: './datatableTemplete.html',
    styles: []
})
export class DatatableComponent implements OnInit {
    @Input() private current = 1;
    @Input() private pageSize = 10;
    @Input() private total = 1;
    @Input() private columns: Array<any> = [];
    @Input() private dataSet: Array<any> = [];
    @Input() private loading: Boolean = false;
    // @Input() private loadingTip: String = Lang['loading_tip'];

    // @Output() private sortEmit: EventEmitter<any> = new EventEmitter<any>();
    // @Output() private selectedItem: EventEmitter<any> = new EventEmitter<any>();
    // @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() private outputPage: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() private checkedItems: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    constructor() {
    }

    private onCheckItem() {
        this.checkedItems.emit(this.dataSet.filter(e => e.checked));
    }

    private pageIndexChange(event: any) {
        this.outputPage.emit({ pageIndex: this.current, pageSize: this.pageSize });
    }

    private pageSizeChange(event: any) {
        this.outputPage.emit({ pageIndex: this.current, pageSize: this.pageSize });
    }

    ngOnInit() {

    }
}
