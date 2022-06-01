import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { LoadingModule } from "../loading/loading.module";
import { MaterialModule } from "../shared/material.module";
import { LandingPageComponent } from "./landing-page.component";

const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
  },
];

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    HttpClientModule,
    LoadingModule,
  ],
  exports: [RouterModule],
})
export class LandingPageModule {}
