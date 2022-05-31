import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-forgot-form-dialog',
    templateUrl: './forgot-form-dialog.component.html',
    styleUrls: ['./forgot-form-dialog.component.scss'],
})
export class ForgotFormDialogComponent implements OnInit {
    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            //when press Enter
            this.resetPassword();
        }
    }

    email: string;
    forgotForm: FormGroup;
    notiSuccess: boolean = false;
    isLoading: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<ForgotFormDialogComponent>,
        private fb: FormBuilder,
        private userService: UserService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.forgotForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            updateOn: 'blur',
        });
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.forgotForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    async trimValue(key: string) {
        let trimData = this.forgotForm.controls[key].value;
        if (trimData) {
            trimData = trimData.trim();
        }
        this.forgotForm.controls[key].setValue(trimData);
        if (trimData) {
            const res = await this.userService.isEmailUnique(trimData);
            if (res) {
                this.forgotForm.controls[key].setErrors({ exist: true });
                this.cdr.markForCheck();
            }
        }
    }

    async resetPassword() {
        await this.trimValue('email');
        if (!this.forgotForm.valid) {
            this.forgotForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.forgotForm.disable();
        const formData = this.forgotForm.controls;
        const req = formData.email.value;
        this.userService.forgotPassword(req).subscribe(res => {
            if (res) {
                this.notiSuccess = true;
                this.isLoading = false;
            }
        });
    }

    backToLogin() {
        this.dialogRef.close(0);
    }
}
