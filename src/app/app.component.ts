import { Component, ViewChild } from "@angular/core";
import {
  Platform,
  ModalController,
  LoadingController,
  Nav,
  MenuController,
  AlertController,
  ToastController
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { CodePush } from "@ionic-native/code-push";
import { Network } from "@ionic-native/network";

import { Service } from "./services/service";
import { LoginService } from "./services/login.service";

import { LoginPage } from "../pages/login/login";
import { FavouriteAdsPage } from "../pages/favourite-ads/favourite-ads";
import { SellPage } from "../pages/sell/sell";
import { AdDetailsPage } from "../pages/ads";
import { ArchitectPage } from "../pages/architect/architect";
import { ProjectsPage } from "../pages/projects/projects";
import { TestimonialPage } from "../pages/testimonial/testimonial";
import { HomeComponentPage } from "../pages/home/home-components/home-component";
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { EmailModalPage } from "./../pages/ads/ad-details/email-modal/email-modal";
import { LaunchReview } from "@ionic-native/launch-review";
import { Facebook } from "@ionic-native/facebook";
import { LocateUsPage } from "./../pages/locate-us/locate-us";
import { Deeplinks } from "@ionic-native/deeplinks";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  loggedIn: boolean = false;
  loginCheck: boolean = true;
  userData: any;
  rootPage: any;
  loggedInText = "Signed In Successfully!";
  loggedOutText = "Signed Out Successfully!";
  favouriteCount: any;
  myInput: any;
  connectionStatus: boolean;
  platform: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    fb: Facebook,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private service: Service,
    private loginService: LoginService,
    private menu: MenuController,
    private codePush: CodePush,
    private network: Network,
    private launchReview: LaunchReview,
    private deeplinks: Deeplinks,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    platform.ready().then(() => {
      this.platform = platform;
      this.rootPage = HomeComponentPage;

      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      splashScreen.hide();

      this.deeplinks.route({ '/property/:ad_id': '' }).subscribe(
        match => {
          let toast = this.toastCtrl.create({
            message: 'Ad-Id: ' + match.$args['ad_id'],
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        },
        nomatch => {
          let toast = this.toastCtrl.create({
            message: "Got a deeplink that didn't match" + nomatch,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          console.error("Got a deeplink that didn't match", nomatch);
        });

      this.loginService.userChange.subscribe((value) => {
        this.userData = value;
        this.loginCheck = false;
        this.loggedIn = true;
      });

      //Checking internet connectivity...

      if (this.network.type == "none") {
        this.connectionStatus = false;
        this.service.connection.next(false);
      }
      if (this.network.type != "none") {
        this.connectionStatus = true;
      }

      this.network.onDisconnect().subscribe(() => {
        this.service.connection.next(false);
        this.connectionStatus = false;
        this.service.toastError("No Internet!");
      });

      // // stop disconnect watch
      // // disconnectSubscription.unsubscribe();

      // watch network for a connection
      this.network.onConnect().subscribe(() => {
        if (!this.connectionStatus) {
          this.service.toastError("Reconnecting...");
          this.service.connection.next(true);
          location.reload();
        }

        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
      });

      // stop connect watch
      // connectSubscription.unsubscribe();

      if (platform.is("cordova")) {
        console.log("platform", platform);

        var count = 0;
        if (!localStorage.getItem("count")) {
          localStorage.setItem("count", JSON.stringify(count));
        } else if (localStorage.getItem("count")) {
          var item = JSON.parse(localStorage.getItem("count"));
          item++;
          localStorage.setItem("count", JSON.stringify(item));
        }
        var counted = JSON.parse(localStorage.getItem("count"));
        if (counted == 8) {
          this.rateUsActionSheet();
        }

        // this.codePush.sync().subscribe((syncStatus) => {
        //   console.log("sync", syncStatus);
        // });
        // this.codePush.notifyApplicationReady().then((res) => {
        //   console.log("notifyApplicationReady", res);
        // });
        // const downloadProgress = (progress) => {
        //   console.log(
        //     `Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`
        //   );
        // };
        // this.codePush.sync({}, downloadProgress).subscribe((syncStatus) => {
        //   console.log("downloadProgess", syncStatus);
        // });

        fb.logEvent("EVENT_NAME_CONTACT");
        fb.logEvent("FBSDKAppEventNameSubmitApplication");
        fb.logEvent("EVENT_NAME_SCHEDULE");
        fb.logEvent("EVENT_NAME_ADDED_PAYMENT_INFO");
        fb.logEvent("EVENT_NAME_COMPLETED_TUTORIAL");
        fb.logEvent("EVENT_NAME_COMPLETED_REGISTRATION");
        fb.logEvent("EVENT_NAME_ADDED_TO_CART");
        fb.logEvent("EVENT_NAME_ADDED_TO_WISHLIST");
        fb.logEvent("EVENT_NAME_VIEWED_CONTENT");
        fb.logEvent("EVENT_NAME_ACHIEVED_LEVEL");
      }

      this.menu.swipeEnable(false);

      if (localStorage.getItem("user")) {
        this.loginCheck = false;
        this.loggedIn = true;
        this.userData = JSON.parse(localStorage.getItem("user"));
        this.service.favourites = JSON.parse(
          localStorage.getItem("favourites")
        ).length;

        this.loginService.userData = this.userData;
      }
    });
  }

  rateUsActionSheet() {
    const prompt = this.alertCtrl.create({
      title: "Rate us!",
      message: "Do you like using ASASA.",

      buttons: [
        {
          text: "Later",
          handler: () => {
            console.log("remind me later called");
            var count = 0;
            localStorage.setItem("count", JSON.stringify(count));
          },
        },
        {
          text: "Rate now",
          handler: () => {
            this.rateUs();
          },
        },
      ],
    });
    prompt.present();
  }

  rateUs() {
    this.launchReview.launch().then(() => {
      console.log("launch");
    });

    if (this.launchReview.isRatingSupported()) {
      this.launchReview
        .rating()
        .then(() => console.log("Successfully launched rating dialog"));
    }
  }
  openSellForm() {
    let sell = this.modalCtrl.create(SellPage, {
      cssClass: "asasa-modal",
    });
    sell.present();
  }

  locateUs() {
    let locateUs = this.modalCtrl.create(LocateUsPage, {
      cssClass: "asasa-modal",
    });
    locateUs.present();
  }

  openFavourites() {
    this.nav.push(FavouriteAdsPage);
  }
  openTestimonial() {
    let testimonial = this.modalCtrl.create(TestimonialPage, {
      cssClass: "asasa-modal",
    });

    testimonial.present();
  }

  contactUs() {
    let contactUs = this.modalCtrl.create(EmailModalPage, {
      cssClass: "asasa-modal",
      contact: true,
    });

    contactUs.present();
  }

  architect() {
    this.nav.push(ArchitectPage);
  }

  projects() {
    this.nav.push(ProjectsPage);
  }

  public logout() {
    this.userData = null;
    this.loginService.userData = null;
    localStorage.removeItem("user");
    localStorage.removeItem("favourites");
    localStorage.removeItem("loginData");
    this.loggedIn = false;
  }

  login() {
    let signIn = this.modalCtrl.create(LoginPage, {
      cssClass: "asasa-modal",
    });

    signIn.present();
  }

  editProfile() {
    let edit = this.modalCtrl.create(EditProfilePage, {
      cssClass: "asasa-modal",
    });

    edit.present();
  }

  onCancel(e) {
    this.service.getAdByRefId(this.myInput).subscribe(
      (res) => {
        this.openDetails(res.property);
      },
      (err) => {
        this.service.toast(JSON.parse(err._body).message);
      }
    );
  }

  openDetails(info) {
    let detailModal = this.modalCtrl.create(AdDetailsPage, {
      cssClass: "asasa-modal",
      adDetails: info,
    });
    detailModal.onDidDismiss((data) => {});
    detailModal.present();
  }
}
