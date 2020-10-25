import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Platform,
} from "ionic-angular";

@Component({
  selector: "page-locate-us",
  templateUrl: "locate-us.html",
})
export class LocateUsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
