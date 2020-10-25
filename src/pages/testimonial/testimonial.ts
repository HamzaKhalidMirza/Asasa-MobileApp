import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Platform,
} from "ionic-angular";
import { Service } from "../../app/services/service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "page-testimonial",
  templateUrl: "testimonial.html",
})
export class TestimonialPage {
  user: any;
  message: any;
  purpose: any;

  ngForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private service: Service,
    platform: Platform,
    private formBuilder: FormBuilder
  ) {
    platform.registerBackButtonAction(() => {
      this.closeModal();
    });
  }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.ngForm = this.formBuilder.group({
      purpose: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }
  get Purpose() {
    return this.ngForm.get("purpose");
  }
  get Message() {
    return this.ngForm.get("message");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TestimonialPage");
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  postTestimoial() {
    var data;
    if (this.user.image) {
      data = {
        userId: this.user._id,
        name: this.user.name,
        image: this.user.image.fileLocation,
        reason: this.purpose,
        comment: this.message,
      };
    } else {
      data = {
        userId: this.user._id,
        name: this.user.name,
        image: null,
        reason: this.purpose,
        comment: this.message,
      };
    }

    this.service.addTestimonial(data).subscribe(
      (data) => {
        this.closeModal();
        this.service.toast(JSON.parse(data._body).message);
      },
      (error) => {}
    );
  }
}
