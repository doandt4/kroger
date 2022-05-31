import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {QuicklinkModule} from 'ngx-quicklink';
import { ApiConstant } from '../types';
import {AppBreadcrumbModule} from './app-breadcrumb';
import {AppErrorBoxModule} from './app-error-box';
import {DataTableModule} from './datatable';
import {DataTableMobileModule} from './datatable-mobile';
import {MaterialModule} from './material.module';
import { CampaignService } from './services';
import { API_SHARED_TOKEN } from './types';

@NgModule({
    imports: [CommonModule, QuicklinkModule, MaterialModule],
    exports: [
        AppBreadcrumbModule,
        AppErrorBoxModule,
        MaterialModule,
        QuicklinkModule,
        DataTableModule,
        DataTableMobileModule,
    ],
})
export class SharedModule {
    static forRoot(apiConstantt: ApiConstant): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                { provide: API_SHARED_TOKEN, useValue: apiConstantt },             
                CampaignService,
            ],
        };
    }
}
