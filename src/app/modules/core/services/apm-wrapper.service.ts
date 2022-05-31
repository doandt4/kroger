import { Injectable } from '@angular/core';
import { Apm, ApmSpan, ApmTransaction, ApmUserContext } from '@elastic/apm-rum';
import { environment } from 'src/environments/environment';
import { apm } from '../init-apm';
import { Logger } from '../logger';

@Injectable({
    providedIn: 'root',
})
export class ApmWrapperService {
    private apm?: Apm;

    constructor() {
        if (environment.production) {
            this.apm = apm;
        }
    }

    startTransaction(
        name: string,
        type: string,
        userContext: ApmUserContext,
        customContext: { [key: string]: string },
    ) {
        if (!environment.production && environment.enableLogging) {
            Logger.log(
                '[startTransaction] ',
                'name:',
                name,
                'type: ',
                type,
                'userContext: ',
                userContext,
                'customContext: ',
                customContext,
            );
        }
        if (this.apm) {
            this.apm.setUserContext(userContext);
            if (customContext) {
                this.apm.setCustomContext(customContext);
            }
            return this.apm.startTransaction(name, type);
        }
        return undefined;
    }

    endTransaction(transaction?: ApmTransaction, httpSpan?: ApmSpan) {
        if (httpSpan) {
            httpSpan.end();
        }
        if (transaction) {
            transaction.end();
        }
    }

    startSpan(name: string, type: string) {
        if (!environment.production && environment.enableLogging) {
            Logger.log('[startSpan] ', 'name:', name, 'type:', type);
        }
        if (this.apm) {
            return this.apm.startSpan(name, type);
        }
        return undefined;
    }

    captureError(err: Error) {
        if (!environment.production && environment.enableLogging) {
            Logger.log('[captureError] ', 'err:', err);
        }
        if (this.apm) {
            this.apm.captureError(err);
        }
    }
}
