import { HomePage } from "./../home";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  NavController,
  MenuController,
  ModalController,
  Tabs,
} from "ionic-angular";
import { AdsViewPage } from "../../ads";
import { FilterService } from "../../../app/services/filterService";
import { FilterModalPage } from "../../filter-modal/filter-modal";
import { Service } from "../../../app/services/service";
import { HomeSearchModalPage } from "./search/search-modal";

@Component({
  selector: "page-home-components",
  templateUrl: "home-component.html",
})
export class HomeComponentPage implements OnInit {
  @ViewChild("myTabs") tabRef: Tabs;
  selectedCity: any;
  sateliteView: boolean = false;
  address: any;
  city: any;
  formattedAddress: any;
  latLng: any;
  locationData: any;
  adsData: any;
  adsFiltered: any;
  markerss = [];
  tab1 = HomePage;
  tab2 = AdsViewPage;
  purpose: any;

  location: any;
  cityS: any;

  locations = [];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,

    private modalCtrl: ModalController,
    private service: Service,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.filterService.filterAdsChange.subscribe((res) => {
      this.adsFiltered = res;
    });
    this.purpose = this.filterService.purpose;
    this.filterService.purposeChange.subscribe((res) => {
      this.purpose = res;
    });
    this.getAdsData();
  }

  resetLocation() {
    this.city = undefined;
    this.formattedAddress = undefined;
    this.service.searchParams = undefined;
    this.cityS = undefined;
    this.locations = [];

    this.filters = { type: "all" };

    this.filterService.filterAdsChange.next(
      this.filterService.filterByPurpose()
    );
  }

  filters: any = { type: "all" };
  searchModal() {
    let searchModal = this.modalCtrl.create(HomeSearchModalPage);
    searchModal.onDidDismiss(async (data) => {
      if (data) {
        if (!data.city) this.city = data.city;
        if (!data.location) this.formattedAddress = data.location;
        this.filters = data;

        await this.outputFilters(data);

        this.locationData = data;
        if (this.locationData.location && this.locationData.city) {
          this.city = this.locationData.city.city;
          this.formattedAddress = this.locationData.location.location;
        }
        if (this.locationData.city && !this.locationData.location) {
          this.city = this.locationData.city.city;
          this.formattedAddress = null;
        }
      }
    });
    searchModal.present();
  }

  outputAds(ad) {
    this.service.emitAds.next(ad);
  }

  outputFilters(data) {
    this.service.emitFilters.next(data);
  }

  changeMapView() {
    this.sateliteView = !this.sateliteView;

    this.service.emitMapView.next(this.sateliteView);
  }

  isMap: boolean = true;
  getSelectedTab() {
    if (this.tabRef.getSelected().tabTitle == "Map") {
      this.isMap = true;
    } else if (this.tabRef.getSelected().tabTitle == "List") {
      this.isMap = false;
    }
  }

  filterModal() {
    let filterModal = this.modalCtrl.create(FilterModalPage, {
      cssClass: "asasa-modal",
    });
    filterModal.onDidDismiss((data) => {
      if (data) {
        this.filterService.filteredAds = [];

        this.filter(data.filter);
      }
    });
    filterModal.present();
  }

  public async filter(filter) {
    if (
      (filter.minPrice && filter.minPrice != 0) ||
      (filter.maxPrice && filter.maxPrice != 0) ||
      (filter.minArea && filter.minArea != 0) ||
      (filter.maxArea && filter.maxArea != 0)
    ) {
      if (this.service.searchParams) {
        if (
          this.service.searchParams.location ||
          this.service.searchParams.city ||
          this.service.searchParams.type != "all" ||
          this.service.searchParams.subType
        ) {
          this.filterService.filterByPriceAndArea(
            filter,
            this.filterService.processedData
          );
        } else if (
          !this.service.searchParams.location &&
          !this.service.searchParams.city &&
          this.service.searchParams.type == "all" &&
          !this.service.searchParams.subType
        ) {
          this.filterService.filterByPriceAndArea(
            filter,
            this.filterService.processingData
          );
        }
      } else if (!this.service.searchParams) {
        this.filterService.filterByPriceAndArea(
          filter,
          this.filterService.processingData
        );
      }
    }
  }

  public getAdsData() {
    this.service.emitLoader.next("emittingAds");

    this.service.getAds().subscribe((res) => {
      var response = res.property.reverse();
      this.filterService.processingData = response;
      this.filterService.processingDataWithPurpsoe = response;
      this.filterService.filterByPurpose();

      if (this.filterService.processedData) {
        this.outputAds(this.filterService.processedData);
      } else {
        this.outputAds(this.filterService.filterByPurpose());
      }
    });
  }
}
