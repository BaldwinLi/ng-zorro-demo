import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { NzModalSubject } from 'ng-zorro-antd';
import { UtilService } from '../../services/baseServices/util.service';

@Component({
    selector: 'app-approve-dialog',
    template: `
    <form nz-form [formGroup]="approvalForm">
        <div nz-form-item nz-row>
            <div nz-form-control nz-col [nzSm]="24" [nzXs]="34" nzHasFeedback [nzValidateStatus]="approvalForm.controls.resultReason">
                <nz-input formControlName="resultReason" [nzId]="'resultReason'" [nzType]="'textarea'" [nzRows]="'4'" [nzPlaceHolder]="'请输入审核意见及原因'"></nz-input>
                <div nz-form-explain *ngIf="isValidField(approvalForm, 'resultReason', 'required')">请输入审核意见及原因</div>
            </div>
        </div>
        <div style="margin: 1rem; text-align: center;">
            <div nz-form-item nz-row style="margin-bottom:8px;">
                <div nz-form-control nz-col [nzSpan]="14" [nzOffset]="6">
                    <button style="margin: 1rem;" nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="handleApprove('approved')" [nzLoading]="loading">
                        通过
                    </button>
                    <button style="margin: 1rem;"  nz-button [nzSize]="'large'" (click)="handleApprove('rejected')" [nzLoading]="loading">
                        驳回
                    </button>
                </div>
            </div>
        </div>
    </form>
    `,
})
export class ApproveDialogComponent implements OnInit {
    loading: Boolean = false;
    params: any;
    approvalForm: FormGroup;
    details: Array<any> = [];
    isInvalid: Function;
    isValidField: Function;
    handleApprove(result: string) {
        if (!this.isInvalid(this.approvalForm)) {
            this.subject.next({
                result,
                resultReason: this.approvalForm.value['resultReason']
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
        this.approvalForm = this.fb.group({
            resultReason: ['', [Validators.required]],
        });
        for (const e in this.params) {
            if (this.params[e]) {
                this.details.push({
                    id: e,
                    value: this.params[e]
                });
            }
        }
    }
}
