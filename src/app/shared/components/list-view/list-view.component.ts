import { Component, Input, Output, EventEmitter } from "@angular/core";
// import {  } from "ionic-angular/navigation/nav-controller";
// import { LoginService } from "../../../../app/services/login.service";
// import { Service } from "../../../../app/services/service";
// import { SignInModalPage } from "../../sign-in-modal/sign-in";
import { ModalController } from "ionic-angular";
import { AdDetailsPage } from "../../../../pages/ads/index";
import { Service } from "../../../../app/services/service";

@Component({
  selector: "asasa-listview",
  templateUrl: "list-view.component.html",
})
export class ListViewComponent {
  @Input() ads: any;
  @Input() processingData: any;
  @Input() stopLoader: boolean;
  @Output() infiniteScrollTrigger = new EventEmitter<any>();
  imgLoad: boolean = true;
  constructor(
    private service: Service,

    public modalCtrl: ModalController
  ) {}

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.infiniteScrollTrigger.emit();
      infiniteScroll.complete();
    }, 700);
  }

  getDemand(demand) {
    return this.service.localeString(demand);
  }

  public priceConverter(value) {
    return this.service.priceFilter(value);
  }
  openDetails(info) {
    let detailModal = this.modalCtrl.create(AdDetailsPage, {
      cssClass: "asasa-modal",
      adDetail: info,
    });

    detailModal.present();
  }
}
