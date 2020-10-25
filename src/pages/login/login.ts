import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ViewController,
  AlertController,
  ModalController,
  Platform,
} from "ionic-angular";
import { LoginService } from "../../app/services/login.service";
import { Service } from "../../app/services/service";
import { EditProfilePage } from "../edit-profile/edit-profile";

declare var window;

@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
  @ViewChild("telInput") telInput: ElementRef;
  register: boolean = false;
  phone: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public auth: LoginService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public service: Service,
    private alertCtrl: AlertController,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
  }

  changeModal() {
    this.register = !this.register;
  }

  pageDismissed: boolean;
  dismiss() {
    this.viewCtrl.dismiss();
    this.pageDismissed = true;
  }

  invalid = false;

  saveData(data) {
    localStorage.setItem("user", data);
    localStorage.setItem(
      "favourites",
      JSON.stringify(JSON.parse(data).favourites)
    );
    var parsedData = JSON.parse(data);
    if (!parsedData.name) {
      this.editProfile();
    }

    this.auth.userData = JSON.parse(data);

    this.auth.userChange.next(this.auth.userData);
  }

  verifyNumber: boolean = false;
  timeout: boolean;
  sendVerificationCode() {
    this.telInput.nativeElement.blur();
    if (this.phone && this.hasErrorBoolean) {
      var loading = this.loadingCtrl.create({
        content: "Please wait...",
      });

      loading.present();

      this.service.sendVerificationCode(this.phone).subscribe(
        (res) => {
          loading.dismiss();
          var res = JSON.parse(res._body);

          var data = {
            userId: res.id,
            phone: this.phone,
          };
          localStorage.setItem("loginData", JSON.stringify(data));

          this.verifyNumber = true;
          this.timeout = false;
          this.timeOut();

          this.service.toast(res.message);
          this.getSMS();

          // this.start();
        },
        (err) => {
          loading.dismiss();
          console.log(err);

          var res = JSON.parse(err._body);
          console.error("Error Verification", res);
          this.presentAlert(res.message);
        }
      );
    }
  }

  getSMS() {
    window["cordova"]["plugins"]["smsRetriever"]["startWatching"](
      (res) => {
        var message = res.Message;
        const result = (message.match(/\d+/g) || []).map((n) => parseInt(n));

        this.code = result[0];
        this.verify();
      },
      (err) => {
        console.log("Error getitng sms", err);
      }
    );
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: message,
      buttons: ["Dismiss"],
    });
    alert.present();
  }

  time: any = 59;
  timeOut() {
    this.time--;

    setTimeout(() => {
      if (this.time != 0 && !this.pageDismissed) {
        this.timeOut();
      }
      if (this.time == 0) {
        this.timeout = true;
      }
    }, 1000);
  }

  resend() {
    //add this line to sendVerificationCode

    var body = {
      phone: this.phone,
      userId: JSON.parse(localStorage.getItem("loginData")).userId,
    };

    this.service.resendCode(body).subscribe(
      (res) => {
        this.service.toast(JSON.parse(res._body).message);
      },
      (err) => {
        this.service.toast(JSON.parse(err._body).message);
      }
    );
    this.timeout = false;
    this.timeOut();
    this.time = 59;
  }
  changeFocus() {
    this.errorMessage = null;
  }
  code: any;
  errorMessage: any;
  verify() {
    var loading = this.loadingCtrl.create({
      content: "Please wait...",
    });

    loading.present();

    var body = {
      code: this.code,
      userId: JSON.parse(localStorage.getItem("loginData")).userId,
    };

    this.service.verifyCode(body).subscribe(
      (res) => {
        loading.dismiss();
        this.service.toast(JSON.parse(res._body).message);
        const user = JSON.stringify(JSON.parse(res._body).user);
        this.dismiss();
        this.saveData(user);
      },
      (err) => {
        loading.dismiss();
        this.errorMessage = JSON.parse(err._body).message;
        this.service.toastFromTop(this.errorMessage);
        this.code = null;
      }
    );
  }

  editProfile() {
    let edit = this.modalCtrl.create(EditProfilePage, {
      cssClass: "asasa-modal",
    });

    edit.present();
  }

  hasErrorBoolean: boolean = true;
  hasError(event) {
    this.hasErrorBoolean = event;
  }
  getNumber(event) {
    this.phone = event;
  }
}
