import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  Content
} from "ionic-angular";
import { Service } from "../../../app/services/service";
import { AdDetailsPage } from "../ad-details/ad-details";

import { FilterService } from "../../../app/services/filterService";

@Component({
  selector: "page-ads-view",
  templateUrl: "ads-view.html"
})
export class AdsViewPage {
  @ViewChild("scrollableContent") content: Content;
  display: boolean = false;
  favourite: boolean = false;
  stopLoader: boolean;
  processingData: any;
  ads: any = [];
  loading: any;

  highAndLow = "lth";
  sort: any;
  lazyLoadedData: any;
  loadedAds: number = 20;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private service: Service,
    private modalCtrl: ModalController,

    public filterService: FilterService,
    private change: ChangeDetectorRef
  ) {}

  ionViewDidLoad() {
    this.processingData = this.filterService.processingData;

    this.lazyLoadedData = this.filterService.processedData;
    this.stopLoader = false;

    this.loadingLazyLoadedAds();

    this.filterService.filterAdsChange.subscribe(res => {
      this.stopLoader = false;
      this.ads = [];
      if (this.display) {
        this.content.scrollToTop();
      }
      this.lazyLoadedData = res;
      this.loadingLazyLoadedAds();
    });
    if (this.processingData) {
      this.checkFavourite();
    }
  }

  loadingLazyLoadedAds() {
    if (!this.lazyLoadedData) {
      this.service.emitAds.subscribe(res => {
        this.lazyLoadedData = res;
        this.loadingLazyLoadedAds();
      });
    }

    if (this.lazyLoadedData) {
      for (let i = 0; i < this.loadedAds; i++) {
        if (i < this.lazyLoadedData.length) {
          this.ads.push(this.lazyLoadedData[i]);
        } else break;
      }
    }
  }

  infiniteScroll() {
    var previosAdsCount = this.loadedAds;

    this.loadedAds = this.loadedAds + 20;

    if (this.loadedAds > this.lazyLoadedData.length) {
      this.stopLoader = true;
    }

    for (let i = previosAdsCount; i < this.loadedAds; i++) {
      if (i < this.lazyLoadedData.length) {
        this.ads.push(this.lazyLoadedData[i]);
      } else break;
    }
  }

  getArea(areaType, area) {
    return this.service.convertArea(areaType, area);
  }

  getDemand(demand) {
    return this.service.localeString(demand);
  }

  openDetails(info) {
    let detailModal = this.modalCtrl.create(AdDetailsPage, {
      cssClass: "asasa-modal",
      adDetail: info
    });
    detailModal.onDidDismiss(data => {});
    detailModal.present();
  }

  public sortArray(e) {
    this.ads = [];
    this.loadedAds = 20;
    if (e != "htl" && e != "lth") {
      this.sort = e;
    }
    if (e != "demand" && e != "area") {
      this.highAndLow = e;
    }

    if (this.sort == "demand") {
      if (this.highAndLow == "lth") {
        this.lazyLoadedData = this.lazyLoadedData.sort(
          (a, b) => parseInt(a.demand) - parseInt(b.demand)
        );
        this.loadingLazyLoadedAds();
      } else if (this.highAndLow == "htl") {
        this.lazyLoadedData = this.lazyLoadedData.sort(
          (a, b) => parseInt(b.demand) - parseInt(a.demand)
        );
        this.loadingLazyLoadedAds();
      }
    } else if (this.sort == "area") {
      if (this.highAndLow == "lth") {
        this.lazyLoadedData.sort((a, b) => {
          return this.service.compareStrings(
            this.getArea(a.property_unit, a.land_area),
            this.getArea(b.property_unit, b.land_area),
            "isNum"
          );
        });
        this.loadingLazyLoadedAds();
      } else if (this.highAndLow == "htl") {
        this.lazyLoadedData.sort((a, b) => {
          return this.service.compareStrings(
            this.getArea(b.property_unit, b.land_area),
            this.getArea(a.property_unit, a.land_area),
            "isNum"
          );
        });

        this.loadingLazyLoadedAds();
      }
    }
  }

  public scrollToTop() {
    this.content.scrollToTop(500);
  }

  public getScroll(e) {
    if (e.scrollTop > 230) {
      this.display = true;
      this.change.detectChanges();
    } else if (e.scrollTop < 230) {
      this.display = false;
      this.change.detectChanges();
    }
  }

  checkFavourite() {
    this.processingData.forEach((item, index) => {
      this.processingData[index]["fav"] = false;
      if (localStorage.getItem("favourites"))
        if (JSON.parse(localStorage.getItem("favourites")).length > 0) {
          if (
            JSON.parse(localStorage.getItem("favourites")).includes(
              JSON.stringify(item._id)
            )
          ) {
            this.processingData[index]["fav"] = true;
          }
        }
    });
  }
}
