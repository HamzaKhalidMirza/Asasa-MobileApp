import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  NavController,
  MenuController,
  ModalController,
  LoadingController,
  Platform,
} from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import * as MarkerClusterer from "@google/markerclusterer";

import { MapService } from "../../app/services/map.service";
import { Service } from "../../app/services/service";
import { AdDetailsPage } from "../ads";
import { FilterService } from "../../app/services/filterService";

declare var google;
declare var MarkerClusterer: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  selectedCity: any;
  @ViewChild("map")
  mapElement: ElementRef;
  loadingElement: boolean;
  map: any;
  address: any;
  filters = { type: "all" };
  latLng: any;
  locationData: any;
  adsData: any;
  markerss = [];
  cluster: any;
  sateliteView: boolean = false;

  loading: any;
  purpose: any;
  collapsable: boolean = true;

  location: any;
  cityS: any;
  cities = [];
  locations = [];
  data: any;
  type: any;

  displayedMarkers = [];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    private geoLocation: Geolocation,
    private mapService: MapService,
    private modalCtrl: ModalController,
    private service: Service,
    private filterService: FilterService,
    private loadingCtrl: LoadingController,
    platform: Platform
  ) {
    // set certain preferences

    var counter = 0;
    platform.registerBackButtonAction(() => {
      counter++;

      if (counter == 1) {
        setTimeout(() => {
          counter = 0;
        }, 2000);
        this.service.toast("Press back again to exit...");
      }

      if (counter == 2) {
        platform.exitApp();
      }
    });
  }

  async ionViewCanEnter() {
    this.purpose = this.filterService.purpose;
    this.filterService.purposeChange.subscribe((res) => {
      this.purpose = res;
    });

    this.filterService.filterAdsChange.subscribe(async (res) => {
      this.filterService.filteredAds = res;
      var data = res;

      await this.removeMarkers();

      this.markerss = [];
      this.displayedMarkers = [];

      this.drawMarkers(data);
    });

    this.service.emitAds.subscribe((res) => {
      this.emittedAds(res);
    });
    this.service.emitFilters.subscribe((res) => {
      this.emittedFilters(res);
    });
    this.service.emitMapView.subscribe((res) => {
      this.changeMapView();
    });
    this.service.emitLoader.subscribe(() => {
      this.loading = this.loadingCtrl.create({
        content: this.customContent,
        cssClass: `myloading-wrapper`,
        spinner: "hide",
      });
      this.loading.present();
      this.timeOut();
    });
  }

  ionViewDidLoad() {
    if (!this.map) {
      this.latLng = new google.maps.LatLng(33.6844, 73.0479);
      this.generateMap();
      this.loadMap();
    }
  }

  public loadMap() {
    //Get Lat Lng
    this.geoLocation
      .getCurrentPosition()
      .then((resp) => {
        if (resp) {
          //undo this comment after production
          // this.latLng = new google.maps.LatLng(
          //   resp.coords.latitude,
          //   resp.coords.longitude
          // );
          //remove this line after production
          this.latLng = new google.maps.LatLng(33.6844, 73.0479);
        }

        this.map.setCenter(this.latLng);
        this.getAddress(this.latLng);
      })
      .catch((error) => {
        console.error("Error getting location", error);
      });

    // This code is necessary for browser
  }

  time: any = 1;
  timeOut() {
    this.time++;

    setTimeout(() => {
      if (this.time <= 99 && this.loading) {
        this.timeOut();
        // document.getElementById("inner").style.width = this.time + "%";
        if (this.time < 10 && this.time > 5) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader1'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time < 20 && this.time > 10) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader2'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time < 30 && this.time > 20) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader3'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time <= 40 && this.time > 30) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader4'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time <= 50 && this.time > 40) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader5'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time <= 60 && this.time > 50) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader6'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time <= 70 && this.time > 60) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader7'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time <= 80 && this.time > 70) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader8'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time <= 90 && this.time > 80) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader9'></div></div>";
          this.loading.setContent(this.customContent);
        } else if (this.time <= 100 && this.time > 90) {
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader10'></div></div>";
          this.loading.setContent(this.customContent);
        }
      }
    }, 200);
  }

  public generateMap() {
    // set position on map
    if (!this.latLng) {
      this.latLng = new google.maps.LatLng(33.6844, 73.0479);
    }
    let mapOptions = {
      center: this.latLng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.roadmap,
      maxZoom: 18,
      draggable: true,
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      },
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };
    //load map
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  ico: any;
  customLoading: any = 2;
  customContent =
    " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
    0 +
    "% </div><div class='customLoader' ></div></div>";
  public async drawMarkers(adsData) {
    if (adsData.length == 0) {
      var msg = "No ads found in given area ! ";
      this.service.toastError(msg);
      this.drawCluster(this.markerss);
    }
    var marker: any;
    var iconBase = "assets/icon/";
    var icons = {
      house: {
        icon: {
          url: iconBase + "house.png",
          scaledSize: new google.maps.Size(70, 26),
          labelOrigin: new google.maps.Point(35, 10),
        },
      },
      residentialPlot: {
        icon: {
          url: iconBase + "resPlot.png",
          scaledSize: new google.maps.Size(70, 26),
          labelOrigin: new google.maps.Point(35, 10),
        },
      },
      commercialPlot: {
        icon: {
          url: iconBase + "comPlot.png",
          scaledSize: new google.maps.Size(70, 26),
          labelOrigin: new google.maps.Point(35, 10),
        },
      },
      commercial: {
        icon: {
          url: iconBase + "commercialPin.png",
          scaledSize: new google.maps.Size(70, 26),
          labelOrigin: new google.maps.Point(35, 10),
        },
      },
      apartment: {
        icon: {
          url: iconBase + "apartment.png",
          scaledSize: new google.maps.Size(70, 26),
          labelOrigin: new google.maps.Point(35, 10),
        },
      },
    };
    for (let i in adsData) {
      if (adsData[i].property_Type_Name == "Commercial") {
        this.ico = icons.commercial.icon;
      } else if (
        adsData[i].property_Type_Name == "House" &&
        adsData[i].property_types != "Apartment"
      ) {
        this.ico = icons.house.icon;
      } else if (adsData[i].property_types == "Apartment") {
        this.ico = icons.apartment.icon;
      } else if (adsData[i].property_types == "Residential Plot") {
        this.ico = icons.residentialPlot.icon;
      } else if (adsData[i].property_types == "Commercial Plot") {
        this.ico = icons.commercialPlot.icon;
      }

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          adsData[i].location_data.marker_data.mlatitide,
          adsData[i].location_data.marker_data.mlongitude
        ),
        icon: this.ico,
        label: {
          text: String(this.priceFilter(adsData[i].demand)),
          color: "white",
          fontWeight: "bold",
          fontFamily: "TrajanProBold",
          fontSize: "12px",
        },
        optimized: false,
        map: this.map,
        visible: true,
        optimised: true,
      });

      marker.setZIndex(parseInt(i));

      if (this.map.getBounds().contains(marker.getPosition())) {
        this.markerss.push(marker);
      } else if (!this.map.getBounds().contains(marker.getPosition())) {
        marker.setMap(null);
      }

      this.displayedMarkers.push(marker);

      google.maps.event.addListener(marker, "click", () => {
        this.openDetails(adsData[i]);
      });

      if (parseInt(i) == adsData.length - 1) {
        this.time = 100;
        this.customContent =
          " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
          this.time +
          "%</div><div  class='customLoader10'></div></div>";
        this.loading.setContent(this.customContent);

        this.loading.dismiss().then(() => {
          this.time = 0;
          this.customContent =
            " <div class='custom-spinner-container'><div class='custom-spinner-box'>" +
            this.time +
            "%</div><div  class='customLoader'></div></div>";
        });

        this.drawCluster(this.markerss);
      }
    }

    google.maps.event.addListener(this.map, "idle", async () => {
      this.loadingElement = true;

      await this.updateMarkers(this.map.getBounds());
    });
  }

  async updateMarkers(newBounds) {
    this.markerss = await this.displayedMarkers.filter((marker) => {
      if (!newBounds.contains(marker.getPosition())) {
        marker.setMap(null);
      } else return newBounds.contains(marker.getPosition());
    });

    this.drawCluster(this.markerss);
  }

  async drawCluster(markers) {
    if (this.cluster) {
      this.cluster.clearMarkers();
    }
    this.cluster = new MarkerClusterer(this.map, markers, {
      ignoreHidden: true,
      minimumClusterSize: 15,
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });

    this.loadingElement = false;
  }

  async removeMarkers() {
    for (let i in this.displayedMarkers) {
      await this.displayedMarkers[i].setMap(null);
      await this.displayedMarkers[i].setVisible(false);
    }
  }

  async emittedAds(ad) {
    if (!this.map) {
      console.log("GENERATING MAPS");
      await this.generateMap();
    }
    if (this.filterService.filteredAds) {
      this.drawMarkers(this.filterService.filteredAds);
    } else {
      this.drawMarkers(ad);
    }
  }

  emittedFilters(filter) {
    this.filters = filter;
    if (
      !filter.location &&
      !filter.city &&
      filter.type == "all" &&
      !filter.subType
    ) {
      if (this.service.filterParams) {
        this.filterService.filterByPriceAndArea(
          this.service.filterParams,
          this.filterService.filterByPurpose()
        );
      } else if (!this.service.filterParams) {
        console.log("emitting ads else if");
        this.filterService.filterAdsChange.next(
          this.filterService.filterByPurpose()
        );
      }
    }
    if (
      !filter.location &&
      filter.city &&
      filter.type == "all" &&
      !filter.subType
    ) {
      this.filterService.filterCity(filter);
    }
    if (
      filter.location &&
      filter.city &&
      filter.type == "all" &&
      !filter.subType
    ) {
      this.filterService.filterLocation(filter);
    }
    if (
      !filter.location &&
      !filter.city &&
      filter.type != "all" &&
      !filter.subType
    ) {
      this.filterService.filterType(filter);
    }
    if (
      !filter.location &&
      !filter.city &&
      filter.type != "all" &&
      filter.subType
    ) {
      this.filterService.filterSubtype(filter);
    }
    if (
      !filter.location &&
      filter.city &&
      filter.type != "all" &&
      !filter.subType
    ) {
      this.filterService.filterCityType(filter);
    }
    if (
      !filter.location &&
      filter.city &&
      filter.type != "all" &&
      filter.subType
    ) {
      this.filterService.filterCitySubtype(filter);
    }

    if (
      filter.location &&
      filter.city &&
      filter.type != "all" &&
      !filter.subType
    ) {
      this.filterService.filterLocationType(filter);
    }
    if (
      filter.location &&
      filter.city &&
      filter.type != "all" &&
      filter.subType
    ) {
      this.filterService.filterLocationSubtype(filter);
    }

    if (filter) {
      this.locationData = filter;
      if (this.locationData.location && this.locationData.city) {
        this.latLng = new google.maps.LatLng(
          this.locationData.location.lat,
          this.locationData.location.lng
        );

        this.updateOverlay(this.map, filter.location);

        this.getAddress(this.latLng);
        this.map.setCenter(this.latLng);
        this.map.setZoom(14);
      }
      if (this.locationData.city && !this.locationData.location) {
        this.latLng = new google.maps.LatLng(
          this.locationData.city.lat,
          this.locationData.city.lng
        );

        this.getAddress(this.latLng);
        this.map.setCenter(this.latLng);
        this.map.setZoom(10);
      }
    }
  }
  priceFilter(value) {
    var val: any = Math.abs(value);
    if (val >= 1000000000) {
      val = Number((val / 1000000000).toFixed(2)) + " B";
    } else if (val >= 10000000) {
      val = Number((val / 10000000).toFixed(2)) + " Cr.";
    } else if (val >= 100000) {
      val = Number((val / 100000).toFixed(2)) + " Lac";
    } else if (val >= 1000) val = Number((val / 1000).toFixed(2)) + " Th";
    return val;
  }

  public getAddress(latLng) {
    // let geocode = new google.maps.Geocoder();
    // // Get Address
    // geocode.geocode({ location: latLng }, (results, status) => {
    //   if (results.length > 0) {
    //     let ad = this.selectedCity.filter(
    //       city =>
    //         city.city ==
    //         results[0].address_components[
    //           results[0].address_components.length - 3
    //         ].long_name
    //     );
    //     var data = {
    //       city: ad[0]
    //     };
    //     this.service.currentCity = data;
    //     this.change.detectChanges();
    //   }
    // });
  }

  updateOverlay(map, location) {
    if (location.overlayData.imgLoc) {
      var bounds = {
        lat0: location.overlayData.lat0,
        lng0: location.overlayData.lng0,
        lat1: location.overlayData.lat1,
        lng1: location.overlayData.lng1,
      };
      this.mapService.addOverLay(map, bounds, location.overlayData.imgLoc);
    }
  }

  setMapLocation(data) {
    this.locationData = data;

    if (data) {
      if (this.locationData.location && this.locationData.city) {
        this.latLng = new google.maps.LatLng(
          this.locationData.location.lat,
          this.locationData.location.lng
        );

        this.updateOverlay(this.map, data.location);

        this.map.setCenter(this.latLng);
        this.map.setZoom(14);
      }
      if (this.locationData.city && !this.locationData.location) {
        this.latLng = new google.maps.LatLng(
          this.locationData.city.lat,
          this.locationData.city.lng
        );

        this.getAddress(this.latLng);
        this.map.setCenter(this.latLng);
        this.map.setZoom(10);
      }
    }
  }

  openDetails(info) {
    let detailModal = this.modalCtrl.create(AdDetailsPage, {
      cssClass: "asasa-modal",
      adDetail: info,
    });
    detailModal.onDidDismiss((data) => {});
    detailModal.present();
  }

  public changeMapView() {
    if (!this.sateliteView) {
      this.map.setMapTypeId("hybrid");
      this.sateliteView = !this.sateliteView;
    } else if (this.sateliteView) {
      this.map.setMapTypeId("roadmap");
      this.sateliteView = !this.sateliteView;
    }
  }
}
