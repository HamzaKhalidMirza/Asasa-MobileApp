import { Service } from "./../../app/services/service";
import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  LoadingController,
  Platform,
} from "ionic-angular";
import { ArchitectDetailsPage } from "./architect-details/architect-details";

@Component({
  selector: "page-architect",
  templateUrl: "architect.html",
})
export class ArchitectPage {
  architects: any;
  searchInput: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private service: Service,
    private loadingCtrl: LoadingController,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    // this.getArchitects();
  }
  notFound: boolean = false;
  getArchitects() {
    var loading = this.loadingCtrl.create({
      content: "Fetching Data...",
    });
    loading.present();
    this.service.getArchitects().subscribe(
      (res) => {
        loading.dismiss();
        this.architects = JSON.parse(res._body);

        if (this.architects.length == 0) {
          this.notFound = true;
        }
      },
      (err) => {
        loading.dismiss();
        console.error("Error getting architectures", err);
      }
    );
  }

  openDetails(id, image, des, expertise) {
    let architect = this.modalCtrl.create(ArchitectDetailsPage, {
      cssClass: "asasa-modal",
      id: id,
      image: image,
      description: des,
      expertise: expertise,
    });
    architect.onDidDismiss((data) => {});
    architect.present();
  }
}
