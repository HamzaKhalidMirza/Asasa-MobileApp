import { LoginPage } from "./../../login/login";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  NavController,
  NavParams,
  Segment,
  LoadingController,
  ModalController,
  ViewController,
  Platform, ToastController
} from "ionic-angular";
import { CallNumber } from "@ionic-native/call-number";

import { Service } from "../../../app/services/service";
import { MapService } from "../../../app/services/map.service";

import { EmailModalPage } from "./email-modal/email-modal";
import { ProjectDetailsPage } from "../../architect/architect-details/project-details/project-details";
import { SocialSharing } from '@ionic-native/social-sharing';

declare var google;

@Component({
  selector: "page-ad-details",
  templateUrl: "ad-details.html",
})
export class AdDetailsPage {
  i: any = "detail";
  name: any;
  phone: any;
  email: any;
  type: any;
  kuulaUrl: SafeResourceUrl;
  favourite: boolean = false;
  safeUrl: any;
  @ViewChild("map2")
  mapElement: ElementRef;
  @ViewChild(Segment)
  private segment: Segment;
  map: any;
  public topBar: string;
  public adData: any;
  public latLng: any;

  loading: any;
  loaded: boolean;
  imgLoad: boolean = true;
  imgLoaded: boolean = false;
  currency: any;

  openGalaryCheck: boolean = false;
  features: any = [];
  noVR: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: Service,
    public mapService: MapService,
    public loadingCtrl: LoadingController,
    private _sanitizer: DomSanitizer,
    private call: CallNumber,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private socialShare: SocialSharing,
    private toastCtrl: ToastController,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      console.log("backbutton");
      this.dismiss();
    });
  }

  ionViewDidLoad() {
    this.loadMap();
  }
  async ionViewWillEnter() {
    if (!this.openGalaryCheck) {
      if (this.navParams.get("adDetail")) {
        var id = this.navParams.get("adDetail")._id;
        this.service.addPropertyCount(id).subscribe(() => {});
        this.adData = this.navParams.get("adDetail");
        if (this.adData.property_Type_Name == "Plot") {
          this.topBar = "map";
        }
        if (this.adData.property_Type_Name == "House") {
          if (this.adData.images.length > 0) {
            this.topBar = "photo";
          } else {
            this.topBar = "map";
          }
        }
        if (this.adData.property_Type_Name == "Commercial") {
          if (this.adData.images.length > 0) {
            this.topBar = "photo";
          } else {
            this.topBar = "map";
          }
        }
        if (this.adData.video_link) {
          this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
            "//www.youtube.com/embed/" + this.getId(this.adData.video_link)
          );
        }
        // await this.loadMap();
        await this.loadMarkerAndOverlay();
        this.getAdById(this.adData._id);
      } else if (this.navParams.get("adDetails")) {
        this.adData = this.navParams.get("adDetails");
        if (this.adData.property_Type_Name == "Plot") {
          for (let i of this.adData.property_features_plot) {
            if (i.checked) {
              this.features.push(i);
            }
          }
          this.topBar = "map";
        }
        if (this.adData.property_Type_Name == "House") {
          if (this.adData.images.length > 0) {
            this.topBar = "photo";
          } else {
            this.topBar = "map";
          }
          for (let i of this.adData.property_features_house_rooms) {
            if (i.checked) {
              this.features.push(i);
            }
          }
        }
        if (this.adData.property_Type_Name == "Commercial") {
          if (this.adData.images.length > 0) {
            this.topBar = "photo";
          } else {
            this.topBar = "map";
          }
          for (let i of this.adData.property_features_commercial) {
            if (i.checked) {
              this.features.push(i);
            }
          }
        }
        if (this.adData.video_link) {
          this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
            "//www.youtube.com/embed/" + this.getId(this.adData.video_link)
          );
        }
        // await this.loadMap();
        await this.loadMarkerAndOverlay();
      }
    }
  }

  getAdById(id) {
    this.loaded = true;
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
    });

    this.loading.present();
    this.loading.onDidDismiss(() => {
      this.loaded = false;
    });
    setTimeout(() => {
      if (this.loaded) {
        this.loading.dismiss();
      }
    }, 5000);
    this.service.getAdByRefId(id).subscribe(
      (res) => {
        var adData = res.property;

        this.adData["three_sixty_link"] = adData.three_sixty_link;

        if (!this.adData.three_sixty_link) {
          this.noVR = false;
        }

        if (adData.property_Type_Name == "Plot") {
          for (let i of adData.property_features_plot) {
            if (i.checked) {
              this.features.push(i);
            }
          }
        }

        if (adData.property_Type_Name == "House") {
          this.adData["bedrooms"] = adData.bedrooms;
          this.adData["bathrooms"] = adData.bathrooms;
          this.adData["kitchens"] = adData.kitchens;
          this.adData["drawing_room"] = adData.drawing_room;
          this.adData["guest_room"] = adData.guest_room;
          this.adData["dinning_room"] = adData.dinning_room;
          this.adData["tv_lounge"] = adData.tv_lounge;
          this.adData["parking_spaces_for_house"] =
            adData.parking_spaces_for_house;
          this.adData["servant_quarters"] = adData.servant_quarters;
          for (let i of adData.property_features_house_rooms) {
            if (i.checked) {
              this.features.push(i);
            }
          }
        }
        if (adData.property_Type_Name == "Commercial") {
          for (let i of adData.property_features_commercial) {
            if (i.checked) {
              this.features.push(i);
            }
          }
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  openGalary() {
    this.openGalaryCheck = true;
    let porjectDetails = this.modalCtrl.create(ProjectDetailsPage, {
      cssClass: "asasa-modal",
      adImages: this.adData.images,
    });

    porjectDetails.present();
  }

  share() {
    console.log(this.adData._id);
    this.socialShare.share('Check our product:\n', null, null,
                          `https://asasa.com/property/${this.adData._id}`)
    .then(data => {
      console.log('Shared');
    })
    .catch(err => {
      let toast = this.toastCtrl.create({
        message: 'Error: '+err,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      console.log(err);
    });
  }

  segmentChanged(e) {}

  load360() {
    if (!this.kuulaUrl) {
      this.kuulaUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
        this.adData.three_sixty_link
      );
    }
  }

  private getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return "error";
    }
  }
  callNumber() {
    this.call
      .callNumber("+92-3111170111", true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  //Generates the Map
  public loadMap() {
    //set position on map
    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.HYBRID,
      draggable: true,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      maxZoom: 18,
    };
    //load map
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  async loadMarkerAndOverlay() {
    this.latLng = new google.maps.LatLng(
      this.adData.location_data.marker_data.mlatitide,
      this.adData.location_data.marker_data.mlongitude
    );
    await this.updateOverlay(this.map, this.adData.location_data.location_data);

    new google.maps.Marker({
      position: this.latLng,
      map: this.map,
    });
  }

  //Tile Overlay (MapTiler)
  async updateOverlay(map, location) {
    if (location.overlayData.imgLoc) {
      var bounds = {
        lat0: location.overlayData.lat0,
        lng0: location.overlayData.lng0,
        lat1: location.overlayData.lat1,
        lng1: location.overlayData.lng1,
      };
      await this.mapService.addOverLay(
        map,
        bounds,
        location.overlayData.imgLoc
      );

      setTimeout(() => {
        this.map.setZoom(16);
        this.map.setCenter(this.latLng);
        this.loading.dismiss();
        if (this.segment) {
          this.segment.ngAfterContentInit();
        }
      }, 1000);
    }
  }

  public onLoad() {
    this.imgLoad = false;
  }
  public favouriteIt() {
    if (localStorage.getItem("user")) {
      this.favourite = !this.favourite;
    } else {
      this.openGalaryCheck = true;
      var msg = "Please Sign In to Proceed !";
      this.service.toast(msg);
      let signIn = this.modalCtrl.create(LoginPage, {
        cssClass: "asasa-modal",
      });
      signIn.onDidDismiss((data) => {});
      signIn.present();
    }
  }
  iframeLoaded() {}
  public sendEmail() {
    this.openGalaryCheck = true;
    let emailModal = this.modalCtrl.create(EmailModalPage, {
      cssClass: "asasa-modal",
      adDetail: this.adData,
    });

    emailModal.present();
  }
  getDemand(demand) {
    return this.service.localeString(demand);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  collapse: boolean = false;
  collapse1: boolean = false;
  collapse2: boolean = false;
  collapseDiv() {
    this.collapse = !this.collapse;
  }
  collapseDiv1() {
    this.collapse1 = !this.collapse1;
  }
  collapseDiv2() {
    this.collapse2 = !this.collapse2;
  }

  public priceConverter(value) {
    return this.service.priceFilter(value);
  }

  removeSpace(str) {
    var string = str.toLowerCase();
    return string.replace(/ /g, "_");
  }
}
