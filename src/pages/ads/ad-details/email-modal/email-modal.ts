import { Component } from "@angular/core";
import {
  LoadingController,
  ViewController,
  NavParams,
  Platform,
} from "ionic-angular";
import { Service } from "../../../../app/services/service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "page-email",
  templateUrl: "email-modal.html",
})
export class EmailModalPage {
  type: string;
  adData: any;
  architectData: any;
  contact: boolean = false;
  showNum: boolean = false;

  ngForm: FormGroup;

  constructor(
    public service: Service,
    public loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
  }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.ngForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }
  get Name() {
    return this.ngForm.get("name");
  }
  get Email() {
    return this.ngForm.get("email");
  }
  get Phone() {
    return this.ngForm.get("phone");
  }
  get Message() {
    return this.ngForm.get("message");
  }

  ionViewDidLoad() {
    this.adData = this.navParams.get("adDetail");
    this.architectData = this.navParams.get("architectDetail");
    var contact = this.navParams.data.contact;

    if (contact) {
      this.contact = true;
    }

    if (this.adData) {
      this.ngForm.patchValue({
        message:
          "I would like to inquire about your property Ref ID-" +
          this.adData._id +
          ". Please contact me at your earliest convenience.",
      });
    }
    if (this.architectData) {
      this.ngForm.patchValue({
        message:
          "I would like to contact architect " + this.architectData.name + "",
      });
    }
  }

  public sendEmail() {
    let message =
      "<p>Name: " +
      this.Name.value +
      "</p><p>Email: " +
      this.Email.value +
      "</p><p>Phone: " +
      this.Phone.value +
      "</p><p>Message: " +
      this.Message.value +
      "";
    let email = {
      email: this.Email.value,
      message: message,
    };

    var loading = this.loadingCtrl.create({
      content: "Please wait...",
    });

    loading.present();
    this.service.sendEmail(email).subscribe(
      () => {
        loading.dismiss();
        this.dismiss();
        this.ngForm.reset();
        this.service.toast("Email Sent");
        console.log("email processed");
      },
      (err) => {
        loading.dismiss();
        this.service.toast(err);
        console.error(err);
      }
    );
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showNumber() {
    this.showNum = !this.showNum;
  }
}
