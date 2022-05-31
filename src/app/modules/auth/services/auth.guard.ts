import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(protected authService: AuthService, protected router: Router) {}

    canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url = state.url;
        const validLogin = this.checkLogin(url);
        if (!validLogin) {
            return of(true);
        }
        return validLogin;
    }

    private checkLogin(url: string) {
        if (this.authService.isLogin()) {
            if (url === '/login') {
                this.router.navigate(['/']);
            }
            return true;
        }

        if (url !== '/login') {
            // Store the attempted URL for redirecting
            this.authService.redirectUrl = url;
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
