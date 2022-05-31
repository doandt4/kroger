import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthModule } from '../auth.module';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
    const routerStateSpy = {
        ...jasmine.createSpyObj('RouterStateSnapshot', ['toString']),
        url: '',
    };

    let authGuard: AuthGuard;
    let router: Router;
    let authService: jasmine.SpyObj<AuthService>;
    let activatedRouteSnapshot: ActivatedRouteSnapshot;
    let nextState: RouterStateSnapshot;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AuthModule.forRoot(environment.api), RouterTestingModule, HttpClientTestingModule],
            providers: [
                AuthGuard,
                {
                    provide: ActivatedRouteSnapshot,
                    useValue: {},
                },
                {
                    provide: RouterStateSnapshot,
                    useValue: routerStateSpy,
                },
            ],
        });

        authGuard = TestBed.inject(AuthGuard);
        router = TestBed.inject(Router);
        authService = jasmine.createSpyObj('AuthService', ['isLogin', 'checkAccess']);
        activatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
        nextState = TestBed.inject(RouterStateSnapshot);
    });

    afterEach(() => {});

    it('should ...', inject([AuthGuard, AuthService], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));

    it('should navigate to login page if user is not authenticated and next url is /login', async () => {
        spyOn(authService, 'isLogin').and.returnValue(false);
        nextState.url = '/login';
        const result = await authGuard.canActivate(activatedRouteSnapshot, nextState).toPromise();
        expect(result).toEqual(true);
        expect(authService.redirectUrl).toEqual('');
    });

    it('should redirect to login page if user is not authenticated and next url is not /login', async () => {
        spyOn(authService, 'isLogin').and.returnValue(false);
        spyOn(router, 'navigate');

        nextState.url = '/dummy-url';
        const result = await authGuard.canActivate(activatedRouteSnapshot, nextState).toPromise();
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        expect(result).toEqual(true);
        expect(authService.redirectUrl).toEqual('/dummy-url');
    });

    it('should redirect to / if user is authenticated and next url is /login', async () => {
        spyOn(authService, 'isLogin').and.returnValue(true);
        spyOn(authService, 'checkAccess');
        spyOnProperty(authService, 'checkAccess$', 'get').and.returnValue(of(true));
        spyOn(router, 'navigate');

        nextState.url = '/login';
        const result = await authGuard.canActivate(activatedRouteSnapshot, nextState).toPromise();
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);

        expect(authService.checkAccess).toHaveBeenCalled();
        expect(authService.checkAccess).toHaveBeenCalledTimes(1);
        expect(authService.checkAccess).toHaveBeenCalledWith(nextState.url);

        expect(result).toEqual(true);
        expect(authService.redirectUrl).toEqual('');
    });

    it('should navigate to next route if user is authenticated and next url is not /login', async () => {
        spyOn(authService, 'isLogin').and.returnValue(true);
        spyOn(authService, 'checkAccess');
        spyOnProperty(authService, 'checkAccess$', 'get').and.returnValue(of(true));
        spyOn(router, 'navigate');

        nextState.url = '/questionnaire-response';
        const result = await authGuard.canActivate(activatedRouteSnapshot, nextState).toPromise();
        expect(router.navigate).not.toHaveBeenCalled();

        expect(authService.checkAccess).toHaveBeenCalled();
        expect(authService.checkAccess).toHaveBeenCalledTimes(1);
        expect(authService.checkAccess).toHaveBeenCalledWith(nextState.url);

        expect(result).toEqual(true);
        expect(authService.redirectUrl).toEqual('');
    });

    it('should navigate to / if user is authenticated and is not granted access to next url', async () => {
        spyOn(authService, 'isLogin').and.returnValue(true);
        spyOn(authService, 'checkAccess');
        spyOnProperty(authService, 'checkAccess$', 'get').and.returnValue(of(false));
        spyOn(router, 'navigate');

        nextState.url = '/questionnaire-response';
        const result = await authGuard.canActivate(activatedRouteSnapshot, nextState).toPromise();
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);

        expect(authService.checkAccess).toHaveBeenCalled();
        expect(authService.checkAccess).toHaveBeenCalledTimes(1);
        expect(authService.checkAccess).toHaveBeenCalledWith(nextState.url);

        expect(result).toEqual(true);
        expect(authService.redirectUrl).toEqual('');
    });
});
