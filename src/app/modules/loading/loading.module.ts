import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from "./loading.component";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [LoadingComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LoadingComponent],
})
export class LoadingModule {}
