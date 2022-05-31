import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { NgxsModule } from "@ngxs/store";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthModule, CoreModule } from "./modules";
import { MenuFilter, MenuHasChild } from "./modules/shared/pipes";
import { PipeModule } from "./modules/shared/pipe.module";
import { LoadingModule } from "./modules/loading/loading.module";
import { MatTableModule } from "@angular/material/table";
import { MaterialModule } from "./modules/shared/material.module";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [AppComponent, MenuFilter, MenuHasChild],
  imports: [
    MaterialModule,
    MatTableModule,
    LoadingModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthModule.forRoot(environment.api),
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    HttpClientModule,
    TranslateModule,
    PipeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    NgbModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
