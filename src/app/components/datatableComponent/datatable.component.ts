import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
    @Input() private loading = false;

    // @Output() private sortEmit: EventEmitter<any> = new EventEmitter<any>();
    // @Output() private selectedItem: EventEmitter<any> = new EventEmitter<any>();
    // @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() private outputPage: EventEmitter<Object> = new EventEmitter<Object>();

    constructor() {
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
