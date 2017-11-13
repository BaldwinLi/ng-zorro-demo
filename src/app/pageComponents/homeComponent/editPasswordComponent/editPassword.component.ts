import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { UtilService } from '../../../services/baseServices/util.service';
import { LoginUserService } from '../../../services/loginUser.service';

@Component({
    selector: 'app-edit-password',
    templateUrl: './editPasswordTemplate.html',
})
export class EditPasswordComponent implements OnInit {
    passwordForm: FormGroup;
    loading: Boolean = false;
    loadingTip: String = '密码修改中，请稍后...';
    isValidField: Function;
    _submitForm() {
        if (!this.util.isInvalidForm(this.passwordForm)) {
            this.loading = true;
            this.luSvc.editPassword(this.passwordForm.value).subscribe(
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
        private luSvc: LoginUserService,
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
        } else if (control.value !== this.passwordForm.controls['newPass'].value) {
            return { confirm: true, error: true };
        }
    }

    ngOnInit() {
        this.passwordForm = this.fb.group({
            username: [LoginUserService.user.username, [Validators.required]],
            oldPass: [null, [Validators.required]],
            newPass: [null, [Validators.required]],
            confirmNewPass: [null, [Validators.required, this.confirmationValidator]],
        });
    }
}
