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
    selector: 'app-add-merchant',
    templateUrl: './addMerchantTemplate.html',
})
export class AddMerchantComponent implements OnInit {
    merchantForm: FormGroup;

    _submitForm() {
        if (this.util.isInvalidForm(this.merchantForm)) {
            this.subject.next(this.merchantForm.value);
            this.subject.destroy('onCancel');
        }
    }

    constructor(private fb: FormBuilder, private util: UtilService, private subject: NzModalSubject) {
    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(_ => {
            this.merchantForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    ngOnInit() {
        this.merchantForm = this.fb.group({
            merchantName: [null, [Validators.required]],
            contactName: [null, [Validators.required]],
            phoneNum: [null, [Validators.required]],
            phoneNumPrefix: ['+86'],
            merchantLocation: [null, [Validators.required]]
        });
    }

    isValid(name): Boolean {
        return this.merchantForm.controls[name].dirty && this.merchantForm.controls[name].hasError('required');
    }
}
