import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { UtilService } from '../../../services/baseServices/util.service';
import { PlatformUserService } from '../../../services/platformUser.service';

@Component({
    selector: 'app-edit-user-password',
    templateUrl: './editUserPasswordTemplate.html',
    styleUrls: ['../../../../assets/css/custom.css']
})
export class EditUserPasswordComponent implements OnInit {
    username: string;
    passwordForm: FormGroup;
    loading: Boolean = false;
    loadingTip: String = '密码修改中，请稍后...';
    isValidField: Function;
    _submitForm(type?: string) {
        if (!this.util.isInvalidForm(this.passwordForm)) {
            this.loading = true;
            this.puSvc.updatePlatformUserPassword(this.passwordForm.value).subscribe(
                success => {
                    this.loading = false;
                    this.subject.destroy();
                },
                error => {
                    this.loading = false;
                }
            );
        }
        // this.subject.next(this.passwordForm.value);
    }

    constructor(
        private fb: FormBuilder,
        private util: UtilService,
        private subject: NzModalSubject,
        private puSvc: PlatformUserService,
        private nms: NzMessageService
    ) {
        this.isValidField = util.isValid;
    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(_ => {
            this.passwordForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.passwordForm.controls['newPassword'].value) {
            return { confirm: true, error: true };
        }
    }

    ngOnInit() {
        this.passwordForm = this.fb.group({
            userName: this.username,
            adminPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required, this.confirmationValidator]],
        });
    }
}
