import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from '../types';

export type Role = 'user' | 'admin' | 'case manager' | 'qc';
export type ScoreOutcome = 'none' | 'accepted' | 'rejected';

export interface DirtyComponent {
    isDirty$: Observable<boolean>;
    unloadNotification($event: any): boolean | undefined;
    cleanUp(): void;
}

export interface AgencyInfo {
    id: string;
    name: string;
}

export interface GenericUserInfo {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    lastLoginTime?: string;
    status: {
        id: number;
        value: string;
    };
    geography: GeographyInfo;
    region: {
        id: string;
        value: string;
    };
    managerId?: string;
    language?: {
        id: number;
        code: string;
        name: string;
    };
}

export interface UserInfo extends GenericUserInfo {
    agency?: AgencyInfo;
    caseWorker?: UserInfo;
    caseWorkerName?: string;
}

export interface UserInfoCollection {
    users: UserInfo[];
    userCount: number;
    startAtPage?: { pageIndex: number };
}

export interface BreadCrumbItem {
    name: string;
    path: string;
    context?: any;
}

export interface GeographyInfo {
    id: string;
    value: string;
    region: StringValuePair;
}

export interface StringValuePair {
    id: string;
    value: string;
}

export const REGION_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface RegionGeographies {
    id: string;
    value: string;
    geographies: StringValuePair[];
}
