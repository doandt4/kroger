import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { CoreModule } from '../../core';
import { AuthModule } from '../auth.module';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-test-comp',
    template: '<h1>hello</h1>',
})
class TestComponent {}

describe('AuthService', () => {
    let authService: AuthService;
    let httpMock: HttpTestingController;
    let store: { [key: string]: string } = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [
                CoreModule,
                AuthModule.forRoot(environment.api),
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    {
                        path: 'login',
                        component: TestComponent,
                    },
                ]),
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);

        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            return store[key] || null;
        });

        spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
            delete store[key];
        });

        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            return (store[key] = value as string);
        });

        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        spyOn(Date, 'now').and.callFake(() => lastWeek.getMilliseconds());
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        const service: AuthService = TestBed.inject(AuthService);
        expect(service).toBeTruthy();
    });

    it('should return jwt if login is successful', () => {
        const jwt =
            // tslint:disable-next-line:max-line-length
            'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0NTI3YTc5LTI1ZmUtNDRlNC05ZmM1LTczYmEzZWVkNWRhYiIsImVtYWlsIjoiY29ubmllLmxldW5nQGRpZ2luZXguY29tIiwicm9sZSI6ImFkbWluIiwibGFzdExvZ2luVGltZSI6IjIwMTktMTAtMTFUMTA6MzY6MDguNTc3WiIsImZpcnN0bmFtZSI6IlVua25vd24iLCJsYXN0bmFtZSI6IlVua25vd24iLCJzdGF0dXMiOnsiaWQiOjIsInZhbHVlIjoiTGl2ZSJ9LCJpYXQiOjE1NzA3OTAxNjksImV4cCI6MTU3MDg3NjU2OX0.vdjWrfvKcTR1WSWeoyPuvpGbb1pbMSybC4ELQYsfZBbA7TID4vvshfngr6-bkXz_L2mmmnCvE6CBJBf_hEuMeQ';
        const input = { email: 'goodUser@testing.com', password: 'goodPassword' };

        authService.login(input).subscribe(() => {
            authService.isLogin$.subscribe(value => {
                expect(value).toEqual(true);
                expect(localStorage.getItem('jwt')).toEqual(jwt);
            });

            authService.user$.subscribe(value =>
                expect(value).toEqual({
                    id: '84527a79-25fe-44e4-9fc5-73ba3eed5dab',
                    email: 'connie.leung@diginex.com',
                    role: 'admin',
                    firstname: 'Unknown',
                    lastname: 'Unknown',
                    lastLoginTime: '2019-10-11T10:36:08.577Z',
                    status: {
                        id: 2,
                        value: 'Live',
                    },
                }),
            );
        });

        const req = httpMock.expectOne(`${authService.authUrl}/login`);
        req.flush(jwt);

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(input);
        expect(req.request.responseType).toEqual('text');
        expect(req.request.headers.get('Content-Type')).toEqual(null);
    });

    it('should return error if login fails', () => {
        const input = { email: 'badUser@testing.com', password: 'badPassword' };
        authService.login(input).subscribe(() => {
            authService.isLogin$.subscribe(value => expect(value).toEqual(false));
            authService.loginError$.subscribe(err => expect(err).toContain('User is not authenticated.'));
        });

        const req = httpMock.expectOne(`${authService.authUrl}/login`);
        req.flush('Unauthorized', { status: 401, statusText: 'User is not authenticated.' });

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(input);
        expect(req.request.responseType).toEqual('text');
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    });
});
