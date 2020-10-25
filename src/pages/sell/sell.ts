import { Component } from "@angular/core";
import { ViewController, Platform, LoadingController } from "ionic-angular";
import { Service } from "../../app/services/service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "page-sell",
  templateUrl: "sell.html",
})
export class SellPage {
  cities = [];
  locations = [];
  loading: any;
  data: any;
  purpose: any = "buy";

  ngForm: FormGroup;

  constructor(
    private viewCtrl: ViewController,
    private service: Service,
    platform: Platform,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
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
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      city: ["", [Validators.required]],
      propertyDetails: ["", [Validators.required]],
      propertyType: ["", [Validators.required]],
      landArea: ["", [Validators.required]],
      landAreaUnit: ["", [Validators.required]],
      demand: ["", [Validators.required]],
      message: [""],
    });
  }

  get Purpose() {
    return this.ngForm.get("purpose");
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
  get City() {
    return this.ngForm.get("city");
  }
  get PropertyDetails() {
    return this.ngForm.get("propertyDetails");
  }
  get PropertyType() {
    return this.ngForm.get("propertyType");
  }
  get LandArea() {
    return this.ngForm.get("landArea");
  }
  get LandAreaUnit() {
    return this.ngForm.get("landAreaUnit");
  }
  get Demand() {
    return this.ngForm.get("demand");
  }
  get Message() {
    return this.ngForm.get("message");
  }

  ionViewDidLoad() {}

  closeModal() {
    this.viewCtrl.dismiss();
  }

  selectSale() {
    this.purpose = "buy";
  }
  selectRent() {
    this.purpose = "rent";
  }

  postProperty() {
    const data = {
      email: this.Email.value,
      name: this.Name.value,
      phone: this.Phone.value,
      area: this.LandArea.value,
      demand: this.Demand.value,
      property_type: this.PropertyType.value,
      city: this.City.value,
      location: this.PropertyDetails.value,
      landarea_unit: this.LandAreaUnit.value,
      message: this.Message.value,
      purpose: this.purpose,
    };

    console.log(data);

    var loading = this.loadingCtrl.create({
      content: "Please wait...",
    });

    loading.present();

    this.service.saveCustomerProperty(data).subscribe(
      (res) => {
        loading.dismiss();
        this.viewCtrl.dismiss();
        var msg = "Request Sent Successfully!";
        this.service.toast(msg);
      },
      (err) => {
        console.error("error", err);
        var msg = "Some Error Occured While Posting Your Request.";
        this.service.toast(msg);
      }
    );
  }
}
