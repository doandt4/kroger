import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BreadCrumbItem } from '../types';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    private breadcrumbItemsSub$ = new Subject<BreadCrumbItem[]>();
    breadcrumbItems$ = this.breadcrumbItemsSub$.asObservable();

    private contextSub$ = new Subject<any>();
    context$ = this.contextSub$.asObservable();

    updateBreadCrumbItems(items: BreadCrumbItem[]) {
        this.breadcrumbItemsSub$.next(items);
    }

    createBreadcrumbs(urls: string[], breadCrumbKey: string) {
        const breadcrumbItems: BreadCrumbItem[] = [];

        if (breadCrumbKey === 'introduction and instructions') {
            breadcrumbItems.push({
                name: 'Self Assessment Manager',
                path: '/questionnaire',
            });

            breadcrumbItems.push({
                name: 'Introduction & Instructions',
                path: '/questionnaire/instructions',
                context: {
                    mode: 'edit',
                },
            });
        }
        if (breadCrumbKey === 'create-self-assessment') {
            breadcrumbItems.push({
                name: 'Self Assessment Manager',
                path: '/questionnaire',
            });

            breadcrumbItems.push({
                name: 'Self Assessment',
                path: '/questionnaire/new',
            });
        } else if (breadCrumbKey === 'edit-self-assessment') {
            breadcrumbItems.push({
                name: 'Self Assessment Manager',
                path: '/questionnaire',
            });

            breadcrumbItems.push({
                name: 'Self Assessment',
                path: '/questionnaire/edit',
            });
        } else if (breadCrumbKey === 'preview-self-assessment') {
            breadcrumbItems.push({
                name: 'Self Assessment Manager',
                path: '/questionnaire',
            });

            breadcrumbItems.push({
                name: 'Self Assessment',
                path: `/questionnaire/edit/${urls[2]}`,
            });

            breadcrumbItems.push({
                name: 'Self Assessment Preview',
                path: '/questionnaire',
            });
        }
        this.updateBreadCrumbItems(breadcrumbItems);
    }

    setContext(context: any) {
        this.contextSub$.next(context);
    }
}
