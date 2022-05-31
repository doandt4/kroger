import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ApmWrapperService } from "../../core";
import {
  augmentErrorResponse,
  makeLogArguments,
} from "./auth-interceptor-helper";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private apmWrapperService: ApmWrapperService
  ) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.apmWrapperService.captureError(
        new Error("Http status code 401 received.")
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
    const message = messages.join("\n");
    this.apmWrapperService.captureError(new Error(message));
    return throwError(errorResponse);
  }

  private logRequest(req: HttpRequest<any>) {
    const transactionName = environment.elasticAPM.transactionName;
    if (transactionName && req.headers.has(transactionName)) {
      const { id = "", email = "" } = this.authService.getUser() || {};
      const args = makeLogArguments(req);
      const customTransactionName = req.headers.get(transactionName) || "";
      const transaction = this.apmWrapperService.startTransaction(
        customTransactionName,
        "custom",
        { id, email },
        args
      );
      const httpSpan = this.apmWrapperService.startSpan(
        `${req.method} ${req.urlWithParams}`,
        "http"
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
      "eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYXBpLmtyb2dlci5jb20vdjEvLndlbGwta25vd24vandrcy5qc29uIiwia2lkIjoiWjRGZDNtc2tJSDg4aXJ0N0xCNWM2Zz09IiwidHlwIjoiSldUIn0.eyJhdWQiOiJwcm8tMWYwZjcwYmYyYjVhZDk0YzczODdlNjRjMTZkYzQ1NWEyMzEwMTgwNzI0MTQ1MzU0MTgxIiwiZXhwIjoxNjUzOTk0NDY5LCJpYXQiOjE2NTM5OTI2NjQsImlzcyI6ImFwaS5rcm9nZXIuY29tIiwic3ViIjoiYmZiMjgzNWUtODEzZS01ZmI4LThhOTUtNjhjZTA5YjkyNTdjIiwic2NvcGUiOiJwcm9kdWN0LmNvbXBhY3QiLCJhdXRoQXQiOjE2NTM5OTI2Njk3MzE3NzYxODgsImF6cCI6InByby0xZjBmNzBiZjJiNWFkOTRjNzM4N2U2NGMxNmRjNDU1YTIzMTAxODA3MjQxNDUzNTQxODEifQ.PEtxV-Fev3dGkE2j9svsOqsreR7k77bRdHqRQXjxXTtPJJtz9pk__7cTuxpUjy7ZRBbxk10VSeaCKy6JYtR1RPkSOGlDJt7ZWqGTqygAi2i5ZGbXWogEQmqaSg5C-ZKrsKFbWzWcQFxlf6Qk7wc6V61ytKTvjkxarpK0BgslXPKdyqlTqNx_ijRZBk5fOebQFhIFRVA7yaOkaCuovyZFmqYj78ceF2tD4_KVTFVV5g2D67uEbjrdAke12r4YO58pB_owNkb1-567E6jnPrr_P2bAGmqy2F4UyFYdFkIZP0mBZMNrWlmh1eBC550a-gA3Lmby4arEz0kuCKtqz0E-DQ";

    const [transaction, httpSpan] = this.logRequest(req);

    if (!jwt) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => {
          this.apmWrapperService.endTransaction(transaction, httpSpan);
        })
      );
    }

    const headers: { [key: string]: string } =
      req.body instanceof FormData
        ? { Authorization: `Bearer ${jwt}` }
        : {
            "Content-Type": "application/json",
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
