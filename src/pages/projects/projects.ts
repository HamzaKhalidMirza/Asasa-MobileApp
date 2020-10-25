import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { CityProjectDetailsPage } from "./project-details/city-project-details";
import { Service } from "../../app/services/service";

@Component({
  selector: "page-projects",
  templateUrl: "projects.html"
})
export class ProjectsPage {
  projects: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public service: Service
  ) {}

  ionViewDidLoad() {
    var loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loading.present();
    this.service.getCities().subscribe(
      res => {
        this.projects = res;
        console.log("res", res);
        loading.dismiss();
      },
      err => {
        loading.dismiss();
        console.error("error", err);
      }
    );
    // this.projects = [
    //   {
    //     url: "assets/cities/islamabad.jpg",
    //     city: "Islamabad"
    //   },
    //   {
    //     url: "assets/cities/lahore.jpg",
    //     city: "Lahore"
    //   },
    //   {
    //     url: "assets/cities/Peshawar.jpg",
    //     city: "Peshawar"
    //   },
    //   {
    //     url: "assets/cities/balochistan.jpg",
    //     city: "Balochistan"
    //   },
    //   {
    //     url: "assets/cities/karachi.jpg",
    //     city: "Karachi"
    //   },
    //   {
    //     url: "assets/cities/kashmir.jpg",
    //     city: "Kashmir"
    //   }
    // ];
  }

  openDetails(city) {
    this.navCtrl.push(CityProjectDetailsPage, { city: city });
  }
}
