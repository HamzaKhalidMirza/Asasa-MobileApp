import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  LoadingController
} from "ionic-angular";
import { DetailsPage } from "./details/details";
import { Service } from "../../../app/services/service";

@Component({
  selector: "page-city-project-details",
  templateUrl: "city-project-details.html"
})
export class CityProjectDetailsPage {
  projectCity: any;
  projects: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private service: Service,
    private loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    this.projectCity = this.navParams.get("city");
    this.getCityProjects(this.projectCity._id);
  }

  getCityProjects(id) {
    var loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loading.present();
    this.service.getCityProjects(id).subscribe(
      res => {
        console.log(JSON.parse(res._body));
        this.projects = JSON.parse(res._body);
        loading.dismiss();
      },
      err => {
        console.error(err);
        loading.dismiss();
      }
    );
  }

  openDetails(details) {
    details["location"] = {
      lat: this.projectCity.lat,
      lng: this.projectCity.lng
    };
    let porjectDetails = this.modalCtrl.create(DetailsPage, {
      cssClass: "asasa-modal",
      detail: details
    });

    porjectDetails.present();
  }
}
