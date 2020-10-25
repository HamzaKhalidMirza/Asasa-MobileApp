import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProjectsPage } from "./projects";
import { CityProjectDetailsPage } from "./project-details/city-project-details";
import { DetailsPage } from "./project-details/details/details";

@NgModule({
  declarations: [ProjectsPage, CityProjectDetailsPage, DetailsPage],
  entryComponents: [CityProjectDetailsPage, DetailsPage],
  imports: [IonicPageModule.forChild(ProjectsPage)]
})
export class ProjectsPageModule {}
