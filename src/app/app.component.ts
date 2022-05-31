import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivationStart, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthService } from './modules/auth';
import { BreadcrumbService } from './modules/core/';
import * as myGlobals from './globals';

import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('snav')
    snav: MatSidenav;

    currentYear = new Date().getFullYear();
    isLogin$: Observable<boolean>;
    mobileQuery: MediaQueryList;
    role$: Observable<string>;
    breadcrumb = '';

    role: string;

    isShowTopBar$: Observable<boolean>;
    isShowSideBar$: Observable<boolean>;
    isShowSideBarUser$: Observable<boolean>;

    activeMenu = false;

    panelOpenState = false;

    private mobileQueryListener: () => void;

    menuItems = myGlobals.menuItems;

    breadcrumbItems$ = this.breadcrumbService.breadcrumbItems$;
    isStandalonePage = true;
    constructor(
        public translate: TranslateService,
        private authService: AuthService,
        public cdr: ChangeDetectorRef,
        media: MediaMatcher,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => cdr.detectChanges();
        this.mobileQuery.addEventListener('change', this.mobileQueryListener);

        // multiple language 12
        translate.addLangs(['en', 'mn']);
        translate.setDefaultLang('en');

        let currentLanguageCode = localStorage.getItem('currentLanguageCode');
        if (currentLanguageCode) {
            this.translate.use(currentLanguageCode);
        } else {
            const browserLang = translate.getBrowserLang();
            translate.use(browserLang.match(/en|mn/) ? browserLang : 'en');
        }
    }

    changeActive() {
        this.panelOpenState = false;
        this.activeMenu = false;
    }

    ngOnInit() {
        this.isLogin$ = this.authService.isLogin$;
        this.role$ = this.authService.user$.pipe(
            filter(user => !!user),
            map(user => (user && user.role ? user.role.toString() : '')),
        );

        this.role$.subscribe(value => {
            this.role = value;
        });

        this.authService.closeSideNav$.subscribe(() => {
            if (this.snav) {
                this.snav.close();
            }
        });

        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd || e instanceof ActivationStart))
            .subscribe(async e => {
                if (e instanceof ActivationStart) {
                    const e1 = e as ActivationStart;
                    this.breadcrumb = (e1 && e1.snapshot && e1.snapshot.data && e1.snapshot.data.breadcrumb) || '';
                }

                if (e instanceof NavigationEnd) {
                    const urls = e.urlAfterRedirects.split('/').filter(p => p !== '');
                    if (this.breadcrumb) {
                        this.breadcrumbService.createBreadcrumbs(urls, this.breadcrumb);
                    } else {
                        this.breadcrumbService.updateBreadCrumbItems([]);
                    }
                    this.isStandalonePage = e.url.indexOf('static-pages') >= 0 ? true : false;
                    if (
                        e.urlAfterRedirects.indexOf(this.menuItems.filter(x => x.id === 11)[0]?.url) !== -1 ||
                        e.urlAfterRedirects.indexOf(this.menuItems.filter(x => x.id === 10)[0]?.url) !== -1
                    ) {
                        this.panelOpenState = true;
                    }

                    if (this.role === 'user' && (e.url.indexOf('/questionnaire/edit') >= 0 ? true : false)) {
                        this.activeMenu = true;
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    }
}
