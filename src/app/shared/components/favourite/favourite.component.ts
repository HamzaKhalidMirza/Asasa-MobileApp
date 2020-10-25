import { Component, Input } from "@angular/core";
// import { LoginService } from "../../../../app/services/login.service";
// import { Service } from "../../../../app/services/service";
// import { SignInModalPage } from "../../sign-in-modal/sign-in";
import { ModalController } from "ionic-angular";
import { LoginService } from "../../../../app/services/login.service";
import { Service } from "../../../../app/services/service";
import { LoginPage } from "../../../../pages/login/login";

@Component({
  selector: "asasa-heart",
  templateUrl: "favourite.component.html",
})
export class FavouriteComponent {
  @Input() ad: any;
  @Input() processingData: any;
  @Input() index: any;

  user: any;

  constructor(
    private modalCtrl: ModalController,
    private auth: LoginService,
    private service: Service
  ) {}

  public favouriteItOld(id) {
    if (localStorage.getItem("user")) {
      var favourites = JSON.parse(localStorage.getItem("favourites"));

      if (this.processingData) {
        if (this.ad.fav) {
          this.ad.fav = false;
          var index = favourites.findIndex((obj) => obj === this.ad._id);
          if (index > -1) {
            favourites.splice(index, 1);
            localStorage.setItem("favourites", JSON.stringify(favourites));
            this.updateUser(favourites);
          }
          var foundFav = this.processingData.findIndex(
            (find) => find._id == this.ad._id
          );
          if (foundFav > -1) {
            this.processingData[foundFav]["fav"] = false;
          }
        } else if (!this.ad.fav) {
          this.ad.fav = true;
          favourites.push(id);
          localStorage.setItem("favourites", JSON.stringify(favourites));

          var indexAtProcessingData = this.processingData.findIndex(
            (find) => find._id == this.ad._id
          );
          if (indexAtProcessingData > -1) {
            this.processingData[indexAtProcessingData]["fav"] = true;
          }
        }
      } else if (!this.processingData) {
        console.log("yahan kb aati ho ?");
        if (this.ad.fav) {
          this.ad.fav = !this.ad.fav;
          var ind = favourites.findIndex((obj) => obj === this.ad._id);
          if (ind > -1) {
            favourites.splice(ind, 1);
            localStorage.setItem("favourites", JSON.stringify(favourites));
          }
        } else if (!this.ad.fav) {
          this.ad.fav = !this.ad.fav;

          favourites.push(id);
          localStorage.setItem("favourites", JSON.stringify(favourites));
        }
      }
    } else {
      var msg = "Please Sign In to Proceed !";
      this.service.toast(msg);
      let signIn = this.modalCtrl.create(LoginPage, {
        cssClass: "asasa-modal",
      });
      signIn.onDidDismiss((data) => {});
      signIn.present();
    }
  }

  public favouriteIt(id) {
    var foundFav: any;
    this.user = JSON.parse(localStorage.getItem("user"));

    if (this.user) {
      if (this.processingData) {
        if (this.ad.fav) {
          this.ad.fav = false;
          this.removeFav(this.ad._id);
          foundFav = this.processingData.findIndex((a) => a._id == this.ad._id);
          if (foundFav > -1) {
            this.processingData[foundFav]["fav"] = false;
          }
        } else if (!this.ad.fav) {
          this.ad.fav = true;
          this.addFav(this.ad._id);

          foundFav = this.processingData.findIndex((a) => a._id == this.ad._id);
          if (foundFav > -1) {
            this.processingData[foundFav]["fav"] = true;
          }
        }
      } else if (!this.processingData) {
        if (this.ad.fav) {
          this.ad.fav = false;
          this.removeFav(this.ad._id);
        } else if (!this.ad.fav) {
          this.ad.fav = true;
          this.addFav(this.ad._id);
        }
      }
    } else if (!this.user) {
      var msg = "Please Sign In to Proceed !";
      this.service.toast(msg);
      let signIn = this.modalCtrl.create(LoginPage, {
        cssClass: "asasa-modal",
      });

      signIn.present();
    }
  }

  updateUser(user) {
    this.service.favourites = JSON.parse(
      localStorage.getItem("user")
    ).favourites.length;

    this.auth.updateFav(user).subscribe(
      (res) => {
        console.log("added", res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  removeFav(_id) {
    this.service
      .removeFavourite(this.user._id, _id)
      .subscribe((favouriteArray) => {
        localStorage.setItem("favourites", favouriteArray._body);
      });
  }

  addFav(_id) {
    this.service.addFavouriteCount(_id).subscribe(() => {});
    this.service
      .addFavourite(this.user._id, _id)
      .subscribe((favouriteArray) => {
        localStorage.setItem("favourites", favouriteArray._body);
      });
  }
}
