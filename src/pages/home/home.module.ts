import { NgModule } from "@angular/core";
import { AdsModule } from "../ads/ads.module";
import { IonicPageModule } from "ionic-angular/module";
import { HomePage } from "./home";
import { PipesModule } from "../../pipes/pipes.module";
import { FavouriteListModule } from "../favourite-ads/favourite.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { HomeSearchModalPage } from "./home-components/search/search-modal";
import { ArchitectPageModule } from "./../architect/architect.module";
import { HomeComponentPage } from "./home-components/home-component";
import { ProjectsPageModule } from "../projects/projects.module";

@NgModule({
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    AdsModule,
    FavouriteListModule,
    NgSelectModule,
    ArchitectPageModule,
    ProjectsPageModule
  ],
  declarations: [HomePage, HomeComponentPage, HomeSearchModalPage],
  entryComponents: [HomePage, HomeComponentPage, HomeSearchModalPage]
})
export class HomeModule {}
