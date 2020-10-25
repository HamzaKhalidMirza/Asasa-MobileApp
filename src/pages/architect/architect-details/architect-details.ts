import { Service } from "./../../../app/services/service";
import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  ViewController,
  LoadingController,
  Platform,
} from "ionic-angular";
import { ProjectDetailsPage } from "./project-details/project-details";
import { EmailModalPage } from "../../ads/ad-details/email-modal/email-modal";

@Component({
  selector: "page-architect-details",
  templateUrl: "architect-details.html",
})
export class ArchitectDetailsPage {
  architects: any;
  user: any;
  cover: any;
  profile: any;
  project: any;
  description: any;
  expertise: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private service: Service,
    private loadingCtrl: LoadingController,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
  }

  ionViewDidLoad() {
    this.user = this.navParams.get("id");
    this.profile = this.navParams.get("image");
    this.description = this.navParams.get("description");
    this.expertise = this.navParams.get("expertise");
    this.getProjects(this.user);
  }

  getProjects(id) {
    var loading = this.loadingCtrl.create({
      content: "Fetching Projects...",
    });
    loading.present();
    this.service.getArchitectProjects(id).subscribe(
      (res) => {
        loading.dismiss();
        this.architects = JSON.parse(res._body)[0];
        if (JSON.parse(res._body)[0].projects)
          this.project = JSON.parse(res._body)[0].projects;
        if (this.project.length > 0) {
          this.cover = this.project[0].images[0].fileLocation;
        }
      },
      (err) => {
        loading.dismiss();
        console.error("Error while getting projects", err);
      }
    );
  }

  openDetails(images) {
    let projectDetails = this.modalCtrl.create(ProjectDetailsPage, {
      cssClass: "asasa-modal",
      projectImages: images,
    });

    projectDetails.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  sendEmail() {
    let emailModal = this.modalCtrl.create(EmailModalPage, {
      cssClass: "asasa-modal",
      architectDetail: this.architects,
    });

    emailModal.present();
  }
}
