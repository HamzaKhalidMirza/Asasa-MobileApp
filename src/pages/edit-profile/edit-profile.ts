import { Component } from "@angular/core";
import { LoadingController, ViewController, Platform } from "ionic-angular";
import { Service } from "../../app/services/service";
import { LoginService } from "../../app/services/login.service";

import { Camera, CameraOptions } from "@ionic-native/camera";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "page-edit-profile",
  templateUrl: "edit-profile.html",
})
export class EditProfilePage {
  user: any;
  file: any;
  image: any = "https://asasa.com/assets/images/profile_picture.jpg";

  ngForm: FormGroup;

  constructor(
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public service: Service,
    public auth: LoginService,
    private camera: Camera,
    private formBuilder: FormBuilder,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
    if (JSON.parse(localStorage.getItem("user"))) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
  }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.ngForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      email: ["", [Validators.required]],
    });

    this.ngForm.patchValue({ name: this.user.name });
    this.ngForm.patchValue({ phone: this.user.phone });
    if (this.user.phone != this.user.email) {
      this.ngForm.patchValue({ email: this.user.email });
    }

    if (this.user.image) {
      this.image = this.user.image.fileLocation;
    }
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  cameraClick() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.valChange = true;

        this.image = "data:image/jpeg;base64," + imageData;
        this.file = this.dataURItoBlob("data:image/jpeg;base64," + imageData);
      },
      (err) => {
        // Handle error
        console.log(err);
      }
    );
  }

  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  valChange: boolean = false;
  valueChanged() {
    if (!this.valChange) {
      this.valChange = true;
    }
  }

  updateUser() {
    var loading = this.loadingCtrl.create({
      content: "Please wait...",
    });

    loading.present();
    var data = {
      name: this.Name.value,
      email: this.Email.value,
    };

    this.service.updateUser(data, this.file, this.user._id).subscribe(
      (res) => {
        loading.dismiss();
        var data = JSON.parse(res._body);
        console.log(data);
        this.saveData(JSON.stringify(data.user));
        this.service.toast("Updated Successfully!");
        this.valChange = false;
        this.dismiss();
      },
      (err) => {
        loading.dismiss();
        console.error("update error", err);
        this.service.toast(
          "Error updating your profile. Kindly use a different Email."
        );
        this.valChange = false;
      }
    );
  }

  saveData(data) {
    localStorage.setItem("user", data);
    localStorage.setItem(
      "favourites",
      JSON.stringify(JSON.parse(data).favourites)
    );

    this.auth.userData = JSON.parse(data);

    this.auth.userChange.next(this.auth.userData);
  }
}
