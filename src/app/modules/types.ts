import { HttpErrorResponse } from '@angular/common/http';

export interface ApiConstant {
    endpoint: string;
    socketServer: string;
}

export interface CustomHttpErrorResponse extends HttpErrorResponse {
    errorJson?: any;
}

export interface PaginateOptions {
    pageIndex: number;
    pageSize: number;
}

export interface QuestionPaginateOptions {
    id: string;
    pageIndex: number;
    pageSize: number;
}

export interface CurrentUser {
    id?: string;
    currency?: string;
    customerserviceid?: string;
    email?: string;
    firstname?: string;
    lastLoginTime?: string;
    lastname?: string;
    location?: string;
    phone?: string;
    role?: string;
    secondphone?: string;
    status?: string;
    username?: string;
    urlAvatar?: string;
    description?: string;
}

export interface PaymentOrder {
    amount: number;
    tipAmount: number;
}

export interface ListCampaign {
    campaign: [];
    conditional: [];
}

export interface PaymentBody {
    amount: number;
    tipAmount: number;
}
