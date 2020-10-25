import { NgModule } from "@angular/core";
import { AdDetailsPage } from "./ad-details/ad-details";
import { AdsViewPage } from "./ads-view/ads-view";
import { IonicModule } from "ionic-angular/module";
import { PipesModule } from "../../pipes/pipes.module";
import { SharedModule } from "../../app/shared/shared.module";
import { EmailModalPage } from "./ad-details/email-modal/email-modal";
// import { FavouriteComponent, ListViewComponent } from "./components/index";

@NgModule({
  imports: [IonicModule, PipesModule, SharedModule],
  declarations: [AdDetailsPage, AdsViewPage, EmailModalPage],
  entryComponents: [AdDetailsPage, AdsViewPage, EmailModalPage]
})
export class AdsModule {}
