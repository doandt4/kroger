import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
@Component({
    selector: 'app-login-form-dialog',
    templateUrl: './login-form-dialog.component.html',
    styleUrls: ['./login-form-dialog.component.scss'],
})
export class LoginFormDialogComponent implements OnInit {
    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            //when press Enter
            this.login();
        }
    }

    loginForm: FormGroup;
    isShowPassword: boolean = false;
    loginError$ = this.authService.loginError$;
    isLoading: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<LoginFormDialogComponent>,
        private fb: FormBuilder,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.loginForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required])],
        });
    }

    login() {
        if (!this.loginForm.valid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        if (this.isLoading) {
            return;
        }
        const formData = this.loginForm.controls;
        const req = {
            email: formData.email.value,
            password: formData.password.value,
        };
        this.isLoading = true;
        this.authService.login(req).subscribe(
            () => {
                this.isLoading = false;
                this.dialogRef.close();
            },
            () => {
                this.isLoading = false;
            },
        );
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.loginForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    trimValue(key: string) {
        let trimData = this.loginForm.controls[key].value;
        if (trimData) {
            trimData = trimData.trim();
        }
        this.loginForm.controls[key].setValue(trimData);
    }

    registerForm() {
        this.dialogRef.close(1);
    }

    forgotPassForm() {
        this.dialogRef.close(2);
    }
}
