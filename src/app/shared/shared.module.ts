import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ListViewComponent, FavouriteComponent } from "./components/index";
import { IonicModule } from "ionic-angular";

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ListViewComponent, FavouriteComponent],
  exports: [ListViewComponent, FavouriteComponent, CommonModule, IonicModule],
})
export class SharedModule {}
