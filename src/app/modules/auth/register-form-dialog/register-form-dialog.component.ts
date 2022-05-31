import { ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-register-form-dialog',
    templateUrl: './register-form-dialog.component.html',
    styleUrls: ['./register-form-dialog.component.scss'],
})
export class RegisterFormDialogComponent implements OnInit {
    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            //when press Enter
            this.register();
        }
    }
    isLoading: boolean = false;
    registerForm: FormGroup;
    roleControl: FormGroup;
    qcControl: FormGroup;
    isShowPassword: boolean = false;
    isShowRepeatPassword: boolean = false;
    isChecked: boolean = false;

    type: string = '';
    lstRole: any = [
        { name: 'User', type: 'user' },
        { name: 'QC', type: 'qc' },
    ];
    lstQCTemp: any = [];
    lstQC: any = [];
    mes_form: string = "CREATE USER";
    dataFormEdit: any = {};
    user_current: any = {};

    constructor(
        public dialogRef: MatDialogRef<RegisterFormDialogComponent>,
        private fb: FormBuilder,
        private userService: UserService,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
    ) {
        this.type = this.data?.type;
        if(this.type == "edit_user"){
            this.mes_form = "EDIT USER";
        }
    }

    async ngOnInit(): Promise<void> {
        this.initForm();
        if (this.type) {
            this.lstQCTemp = await this.userService.getLstQc();
            if(this.type == "edit_user"){
                this.lstQC = [...this.lstQCTemp];
                this.user_current = await this.userService.getCurrentUserAsync(this.data?.user?.id);
            }
        }
    }

    checkValue() {
        this.isChecked = !this.isChecked;
    }

    initForm() {
        var userEdit = this.data?.user;
        var data_form = {
            username: userEdit?.username,
            email: userEdit?.email,
            firstname: userEdit?.firstname,
            lastname: userEdit?.lastname,
            password: userEdit?.password,
            repeatPassword: userEdit?.password,
            updateOn: 'blur',
            role: this.lstRole.find((x: any) => x.type == this.data?.user?.role),
            qcId: userEdit?.qcId,
        }
        this.dataFormEdit = {...data_form};
        this.registerForm = this.fb.group({
            username: [data_form.username, Validators.compose([Validators.required])],
            email: [data_form.email, Validators.compose([Validators.required, Validators.email])],
            firstName: [data_form.firstname, Validators.compose([Validators.required])],
            lastName: [data_form.lastname, Validators.compose([Validators.required])],
            password: [data_form.password, this.type == "edit_user" ? '': Validators.compose([Validators.required])],
            repeatPassword: [data_form.repeatPassword, this.type == "edit_user" ? '': Validators.compose([Validators.required, this.passwordCf.bind(this)])],
            updateOn: 'blur',
        });
        this.roleControl = this.fb.group({
            role: [data_form.role, Validators.compose([Validators.required])],
        });
        this.qcControl = this.fb.group({
            qcId: [data_form.qcId],
        });
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.type === c2.type : c1 === c2;
    }
    
    passwordCf() {
        if (this.registerForm !== null && this.registerForm !== undefined) {
            const newPass = this.registerForm.controls.password;
            const confirmPass = this.registerForm.controls.repeatPassword;
            return newPass.value === confirmPass.value ? null : { passwordNotMatch: true };
        }
        return null;
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.registerForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    async trimValue(key: string) {
        let trimData = this.registerForm.controls[key].value;
        if (trimData) {
            trimData = trimData.trim();
        }
        this.registerForm.controls[key].setValue(trimData);
        if (key == 'email' && trimData) {
            const res = await this.userService.isEmailUnique(trimData);
            if (!res) {
                this.registerForm.controls[key].setErrors({ exist: true });
            }
            this.cdr.markForCheck();
        }
    }

    async register() {
        if(this.type != 'edit_user'){
            await this.trimValue('email');
        }
        if (!this.registerForm.valid) {
            this.registerForm.markAllAsTouched();
            return;
        }
        const formData = this.registerForm.controls;
        const req = {
            username: formData.username.value,
            email: formData.email.value,
            firstname: formData.firstName.value,
            lastname: formData.lastName.value,
            password: formData.password.value,
            repeatPassword: formData.repeatPassword.value,
            qcId: '',
            role: '',
        };
        this.isLoading = true;

        switch (this.type) {
            case 'create_user':
                req.role = this.roleControl.value?.role?.type;
                req.qcId = this.qcControl.value?.qcId;
                this.userService.createUserAdmin(req).subscribe(res => {
                    this.isLoading = false;
                    if (res) {
                        this.dialogRef.close();
                        this.openSnackBar('Create user successfully!');
                    }
                });
                break;
            case 'edit_user':
                var user_change = {...this.user_current}
                user_change.username= formData.username.value,
                user_change.email= formData.email.value,
                user_change.firstname= formData.firstName.value,
                user_change.lastname= formData.lastName.value,
                user_change.password= formData.password.value,
                user_change.repeatPassword= formData.repeatPassword.value,
                user_change.qcId= this.qcControl.value?.qcId,
                user_change.role= this.roleControl.value?.role?.type,
                user_change.idUser = this.user_current?.id,
                Object.keys(user_change).forEach( function(item) { 
                    if(user_change[item] == null){
                        user_change[item] = "";
                    }
                })
                
                this.userService.editProfile(user_change).subscribe((res:any) => {
                    this.isLoading = false;
                    if (res?.id) {
                        this.dialogRef.close(this.type);
                        this.openSnackBar('Update user successfully!');
                    }
                });
                break;
            default:
                this.userService.createUser(req).subscribe(res => {
                    this.isLoading = false;
                    if (res) {
                        this.backToLogin();
                    }
                });
                break;
        }
    }
    async chooseRole() {
        var qc = this.roleControl.value.role;
        if (qc?.type == 'user') {
            this.lstQC = [...this.lstQCTemp];
        } else {
            this.lstQC = [];
        }
    }

    backToLogin() {
        this.dialogRef.close(0);
    }
    checkShowBtn() {
        var res = true;
        if (this.type) {
            if (this.registerForm.valid && this.roleControl.valid) {
                if (this.roleControl.value?.role?.type == 'user' && !this.qcControl.value?.qcId) return true;
                return false;
            }
        } else {
            if (this.registerForm.valid && this.isChecked) {
                return false;
            }
        }
        return res;
    }
    openSnackBar(__mes: string) {
        this._snackBar.open(__mes, '', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'snack_bar',
        });
    }
}
