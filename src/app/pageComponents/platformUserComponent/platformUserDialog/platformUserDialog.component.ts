import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { NzModalSubject } from 'ng-zorro-antd';
import { UtilService } from '../../../services/baseServices/util.service';
import { DataModelService } from '../../../pipes/model';

@Component({
    selector: 'app-platform-user-dialog',
    templateUrl: './platformUserDialogTemplate.html',
})
export class PlatformUserDialogComponent implements OnInit {
    platformUserForm: FormGroup;
    isValidField: Function;
    userRoleOptions: Array<{ id: string, value: string }> = DataModelService.PLATFORM_USER_ROLE;
    _submitForm(): void {
        if (!this.util.isInvalidForm(this.platformUserForm)) {
            this.subject.next(this.platformUserForm.value);
        }
    }

    constructor(private fb: FormBuilder, private util: UtilService, private subject: NzModalSubject) {
        this.isValidField = util.isValid;
    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(_ => {
            this.platformUserForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.platformUserForm.controls['password'].value) {
            return { confirm: true, error: true };
        }
    }

    ngOnInit() {
        this.platformUserForm = this.fb.group({
            userRole: [null, [Validators.required]],
            userName: [null, [Validators.required]],
            nickName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required, this.confirmationValidator]],
        });
    }
}
