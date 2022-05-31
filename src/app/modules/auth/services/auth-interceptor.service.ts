import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApmWrapperService } from '../../core';
import {
  augmentErrorResponse,
  makeLogArguments,
} from './auth-interceptor-helper';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private apmWrapperService: ApmWrapperService
  ) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.apmWrapperService.captureError(
        new Error('Http status code 401 received.')
      );
      this.authService.logout();
    }
    const errorResponse = augmentErrorResponse(error);
    const defaultMessage = [errorResponse.message];
    const messages =
      errorResponse instanceof HttpErrorResponse
        ? defaultMessage
        : (((errorResponse.errorJson && errorResponse.errorJson.message) ||
            defaultMessage) as string[]);
    const message = messages.join('\n');
    this.apmWrapperService.captureError(new Error(message));
    return throwError(errorResponse);
  }

  private logRequest(req: HttpRequest<any>) {
    const transactionName = environment.elasticAPM.transactionName;
    if (transactionName && req.headers.has(transactionName)) {
      const { id = '', email = '' } = this.authService.getUser() || {};
      const args = makeLogArguments(req);
      const customTransactionName = req.headers.get(transactionName) || '';
      const transaction = this.apmWrapperService.startTransaction(
        customTransactionName,
        'custom',
        { id, email },
        args
      );
      const httpSpan = this.apmWrapperService.startSpan(
        `${req.method} ${req.urlWithParams}`,
        'http'
      );
      return [transaction, httpSpan];
    }
    return [undefined, undefined];
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const jwt = this.authService.getJWT();
    const jwt =
      'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYXBpLmtyb2dlci5jb20vdjEvLndlbGwta25vd24vandrcy5qc29uIiwia2lkIjoiWjRGZDNtc2tJSDg4aXJ0N0xCNWM2Zz09IiwidHlwIjoiSldUIn0.eyJhdWQiOiJoaGMtMTRkMzgxZmIwYzA5MWRmZWYwMzU0NWQyM2JlZGNhODkxNDgyNTMzOTQ3NDc0Nzg1NTQiLCJleHAiOjE2NTQwMTI3ODMsImlhdCI6MTY1NDAxMDk3OCwiaXNzIjoiYXBpLmtyb2dlci5jb20iLCJzdWIiOiI2NDJiOTViZi1hZDg3LTU5MmMtOGExNC01ZjE1MjU0MGE0NmYiLCJzY29wZSI6InByb2R1Y3QuY29tcGFjdCIsImF1dGhBdCI6MTY1NDAxMDk4Mzg2NTAzMzMwOCwiYXpwIjoiaGhjLTE0ZDM4MWZiMGMwOTFkZmVmMDM1NDVkMjNiZWRjYTg5MTQ4MjUzMzk0NzQ3NDc4NTU0In0.Dzgrpwk_ID5JgFi5G4TxPyUiP0DN1hZ0XqAYEUeTkaTt6MtNtGZL2h6xr5bFlR0e-kx6uhQx_YnSG93EJ7_pfQmbrY8XaiZ6ZprPpT04Ard54lZyWzCZsv8ZocyZTDlebp66ujzIvykX7RygD449ByQxyYaYby0EKpu7MWsLIemVvXGS-9AV7ZvbTNSQHbM93KbT27Y6zwWF1JVX3Zbaz7VQPgtkESSI4REijED2lLRe2t7l3zpEWSLaj9qCBFtGTe2XUrtH6QDyUNvMigzFFaJXTYHXJxf2ExGzOMLBWq3kUn4AGFQ9_qD5RO-Nwjr0XUThPlkbsC8M4pKv6qxtgw';

    const [transaction, httpSpan] = this.logRequest(req);

    if (!jwt) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // this.authService.refreshToken().subscribe((res: any) => {
            //   console.log(res);
            // });
            return this.handleError(error);
          }
        }),
        finalize(() => {
          this.apmWrapperService.endTransaction(transaction, httpSpan);
        })
      );
    }

    const headers: { [key: string]: string } =
      req.body instanceof FormData
        ? { Authorization: `Bearer ${jwt}` }
        : {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          };

    req = req.clone({
      setHeaders: headers,
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      finalize(() => {
        this.apmWrapperService.endTransaction(transaction, httpSpan);
      })
    );
  }
}
