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
    isValidField: Function;
    _submitForm(): void {
        if (!this.util.isInvalidForm(this.merchantForm)) {
            this.subject.next(this.merchantForm.value);
            this.subject.destroy('onCancel');
        }
    }

    constructor(private fb: FormBuilder, private util: UtilService, private subject: NzModalSubject) {
        this.isValidField = util.isValid;
    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(_ => {
            this.merchantForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    ngOnInit() {
        this.merchantForm = this.fb.group({
            fullName: [null, [Validators.required]],
            contact: [null, [Validators.required]],
            contactPhone: [null, [Validators.required]],
            phoneNumPrefix: ['+86'],
            registeredAddress: [null, [Validators.required]],
            registeredUsername: ''
        });
    }
}
