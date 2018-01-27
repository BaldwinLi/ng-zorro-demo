import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { NzModalSubject } from 'ng-zorro-antd';
import { UtilService } from '../../../services/baseServices/util.service';

@Component({
    selector: 'app-payment-dialog',
    template: `
    <form nz-form [formGroup]="paymentForm">
        <div nz-form-item nz-row>
            <div nz-form-control nz-col [nzSm]="24" [nzXs]="34" nzHasFeedback [nzValidateStatus]="paymentForm.controls.remark">
                <nz-input formControlName="remark" [nzId]="'remark'" [nzType]="'textarea'" [nzRows]="'4'" [nzPlaceHolder]="'请输入支付备注'"></nz-input>
                <div nz-form-explain *ngIf="isValidField(paymentForm, 'remark', 'required')">请输入支付备注</div>
            </div>
        </div>
        <div class="customize-footer">
            <button style="margin: 1rem;" nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="handle()" [nzLoading]="loading">
            提 交
            </button>
        </div>
    </form>
    `,
    styleUrls: ['../../../../assets/css/custom.css']
})
export class PaymentDialogComponent implements OnInit {
    loading: Boolean = false;
    paymentForm: FormGroup;
    isInvalid: Function;
    isValidField: Function;
    handle() {
        if (!this.isInvalid(this.paymentForm)) {
            this.subject.next({
                remark: this.paymentForm.value['remark']
            });
            this.subject.destroy('onCancel');
        }
    }

    constructor(
        private fb: FormBuilder,
        private util: UtilService,
        private subject: NzModalSubject) {
        this.isInvalid = util.isInvalidForm;
        this.isValidField = util.isValid;
    }

    ngOnInit() {
        this.paymentForm = this.fb.group({
            remark: ['', [Validators.required]],
        });
    }
}
