import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Platform,
} from "ionic-angular";

@Component({
  selector: "page-project-details",
  templateUrl: "project-details.html",
})
export class ProjectDetailsPage {
  images: any;
  projectImages: any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
  }

  ionViewDidLoad() {
    if (this.navParams.get("adImages")) {
      this.images = this.navParams.get("adImages");
    } else if (this.navParams.get("projectImages")) {
      this.projectImages = this.navParams.get("projectImages");
    }
  }

  ionViewCanEnter() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
