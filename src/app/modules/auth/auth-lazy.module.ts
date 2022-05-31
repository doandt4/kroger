import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared';
import { AuthLoginFormComponent } from './auth-login-form/auth-login-form.component';
import { AuthEmailContainer, AuthLoginContainer } from './containers';
import { LoginFormDialogComponent } from './login-form-dialog/login-form-dialog.component';
import { RegisterFormDialogComponent } from './register-form-dialog/register-form-dialog.component';
import { ForgotFormDialogComponent } from './forgot-form-dialog/forgot-form-dialog.component';
import { environment } from 'src/environments/environment';

@NgModule({
    imports: [CommonModule, SharedModule.forRoot(environment.api), ReactiveFormsModule, TranslateModule],
    declarations: [AuthEmailContainer, AuthLoginFormComponent, AuthLoginContainer, LoginFormDialogComponent, RegisterFormDialogComponent, ForgotFormDialogComponent],
    exports: [CommonModule, AuthEmailContainer, AuthLoginFormComponent, AuthLoginContainer, SharedModule],
})
export class AuthLazyModule {}
