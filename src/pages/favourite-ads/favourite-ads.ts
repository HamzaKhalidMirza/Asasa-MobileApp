import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  MenuController,
  Platform,
} from "ionic-angular";
import { FilterService } from "../../app/services/filterService";

@Component({
  selector: "page-favourite-ads",
  templateUrl: "favourite-ads.html",
})
export class FavouriteAdsPage {
  processingData: any;
  ads: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private service: FilterService,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FavouriteAdsPage");
    this.menuCtrl.close();

    this.processingData = this.service.processingData;
    // console.log(this.processingData);
    this.processingData.forEach((item, index) => {
      // console.log(item);
      this.processingData[index]["fav"] = false;
      if (localStorage.getItem("favourites"))
        if (JSON.parse(localStorage.getItem("favourites")).length > 0) {
          if (
            JSON.parse(localStorage.getItem("favourites")).includes(
              JSON.stringify(item._id)
            )
          ) {
            this.processingData[index]["fav"] = true;
            this.ads.push(this.processingData[index]);
          }
        }
    });
  }
}
