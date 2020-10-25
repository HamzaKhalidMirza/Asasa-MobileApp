import { LoginPage } from "./login";
import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular/module";
import { IonicTelInputModule } from "ionic-tel-input";

@NgModule({
  imports: [IonicModule, IonicTelInputModule],
  declarations: [LoginPage],
  entryComponents: [LoginPage],
})
export class LoginModule {}
