import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AdministratorComponent } from "./administrator.component";
import { MaterialModule } from "../shared/material.module";
import { GenerateSettingsComponent } from "./generate-settings/generate-settings.component";
import { HomepageSettingsComponent } from "./homepage-settings/homepage-settings.component";
import { StoreMenuComponent } from "./store-menu/store-menu.component";
import { ImageGalleryComponent } from "./image-gallery/image-gallery.component";
import { SpecialsComponent } from "./specials/specials.component";
import { PromotionComponent } from "./promotion/promotion.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { BusinessSetupComponent } from "./business-setup/business-setup.component";

const routes: Routes = [
  {
    path: "",
    component: AdministratorComponent,
    children: [
      {
        path: "/",
        redirectTo: "administrator/general-settings",
        pathMatch: "full",
      },
      {
        path: "general-settings",
        component: GenerateSettingsComponent,
      },
      {
        path: "homepage-settings",
        component: HomepageSettingsComponent,
      },
      {
        path: "store-menu",
        component: StoreMenuComponent,
      },
      {
        path: "image-gallery",
        component: ImageGalleryComponent,
      },
      {
        path: "specials",
        component: SpecialsComponent,
      },
      {
        path: "promotion",
        component: PromotionComponent,
      },
      {
        path: "feedback",
        component: FeedbackComponent,
      },
      {
        path: "notifications",
        component: NotificationsComponent,
      },
      {
        path: "business-setup",
        component: BusinessSetupComponent,
      },
      // {
      //     path: 'campaigns',
      //     loadChildren: () => import('./campaign/campaign.module').then(m => m.CampaignModule),
      // },
    ],
  },
];

@NgModule({
  declarations: [
    AdministratorComponent,
    GenerateSettingsComponent,
    HomepageSettingsComponent,
    StoreMenuComponent,
    ImageGalleryComponent,
    SpecialsComponent,
    PromotionComponent,
    FeedbackComponent,
    NotificationsComponent,
    BusinessSetupComponent,
  ],
  imports: [MaterialModule, CommonModule, RouterModule.forChild(routes)],
  entryComponents: [AdministratorComponent],
  // providers: [
  //     {
  //         provide: MatDialogRef,
  //         useValue: {},
  //     },
  // ],
})
export class AdministratorModule {}
