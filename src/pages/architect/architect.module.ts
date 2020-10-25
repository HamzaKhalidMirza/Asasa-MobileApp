import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ArchitectPage } from "./architect";
import { ArchitectDetailsPage } from "./architect-details/architect-details";
import { ProjectDetailsPage } from "./architect-details/project-details/project-details";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ArchitectPage, ArchitectDetailsPage, ProjectDetailsPage],
  entryComponents: [ArchitectDetailsPage, ProjectDetailsPage],
  imports: [IonicPageModule.forChild(ArchitectPage), PipesModule]
})
export class ArchitectPageModule {}
