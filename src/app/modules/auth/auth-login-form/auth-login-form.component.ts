import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ForgotFormDialogComponent } from '../forgot-form-dialog/forgot-form-dialog.component';

@Component({
    selector: 'auth-login-form',
    templateUrl: './auth-login-form.component.html',
    styleUrls: ['./auth-login-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginFormComponent implements OnInit {
    loginForm: FormGroup;
    hide = true;
    smallScreen: Observable<boolean>;
    isShowPassword = false;
    loginError$ = this.authService.loginError$;

    constructor(private fb: FormBuilder, private authService: AuthService, public dialog: MatDialog) {}
    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.loginForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required])],
        });
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

    login() {
        if (!this.loginForm.valid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        const formData = this.loginForm.controls;
        const req = {
            email: formData.email.value,
            password: formData.password.value,
        };
        this.authService.login(req).subscribe();
    }

    forgot() {
        const dialogForgot = this.dialog.open(ForgotFormDialogComponent, {
            width: '1320px',
            scrollStrategy: new NoopScrollStrategy(),
        });
        dialogForgot.afterClosed().subscribe(result => {
            if (result == 0) {
            }
        });
    }
}
