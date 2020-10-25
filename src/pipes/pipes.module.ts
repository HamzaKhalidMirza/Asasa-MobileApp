import { NgModule } from "@angular/core";
import { KeysPipe } from "./keys/keys";
import { FilterPipe } from "./keys/filter";
@NgModule({
  declarations: [KeysPipe, FilterPipe],
  imports: [],
  exports: [KeysPipe, FilterPipe]
})
export class PipesModule {}
