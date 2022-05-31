import { InjectionToken } from '@angular/core';
import { Role } from '../core';
import { ApiConstant } from '../types';

export const API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface AuthenticateInfo {
    email: string;
    password: string;
    currentLanguageCode?: string;
}

export interface TokenPayload {
    id: string;
    email: string;
    role: Role;
    iat: number;
    exp: number;
    firstname: string;
    lastname: string;
    lastLoginTime: string;
    status: {
        id: number;
        value: string;
    };
    geography: {
        id: string;
        value: string;
        region: {
            id: string;
            value: string;
        };
    };
    region: {
        id: string;
        value: string;
    };
    managerId: string;
    caseWorkerName: string;
    language?: {
        id: number,
        code: string,
        name: string,
    }
}
export interface NotificationResult {
    unreadMessage: number;
    introDifferent: number;
    questionDifferent: number;
}
