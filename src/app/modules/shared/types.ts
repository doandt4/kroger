import { InjectionToken } from "@angular/core";
import { ApiConstant } from "../types";

export const API_SHARED_TOKEN = new InjectionToken<ApiConstant>('api.constant');
export interface Region {
    map: any;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    country: Country;
}

export interface Country {
    map: any;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    state: States;
}

export interface States {
    map: any;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    city: City;
}
export interface City {
    map: any;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
