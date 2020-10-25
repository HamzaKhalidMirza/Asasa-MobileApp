import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular/module";
import { FavouriteAdsPage } from "./favourite-ads";
import { SharedModule } from "../../app/shared/shared.module";

@NgModule({
  imports: [IonicPageModule.forChild(FavouriteAdsPage), SharedModule],
  declarations: [FavouriteAdsPage],
  entryComponents: [FavouriteAdsPage]
})
export class FavouriteListModule {}
