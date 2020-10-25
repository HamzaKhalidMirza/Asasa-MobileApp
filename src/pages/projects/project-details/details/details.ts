import { Service } from "./../../../../app/services/service";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
declare var google;

@Component({
  selector: "page-details",
  templateUrl: "details.html"
})
export class DetailsPage {
  detail: any;
  @ViewChild("mapProject")
  mapElement: ElementRef;
  map: any;
  latlng: any;
  projectDetail = "photo";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private service: Service
  ) {}

  ionViewWillEnter() {
    console.log("detail", this.detail);
  }
  ionViewDidLoad() {
    this.detail = this.navParams.get("detail");

    this.loadMap();
  }

  public loadMap() {
    this.latlng = new google.maps.LatLng(
      this.detail.latitude,
      this.detail.longitude
    );
    // //set position on map
    let mapOptions = {
      center: this.latlng,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      draggable: true,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoom: 12
    };
    //load map
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    new google.maps.Marker({
      position: this.latlng,
      map: this.map
    });

    // let mapOptions = {
    //   center: this.latlng,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };

    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  scroll(id) {
    let el = document.getElementById(id);

    el.scrollIntoView({ behavior: "smooth" });
  }

  tabs = [
    {
      url: "assets/icon/grain.svg",
      name: "Overview",
      tabname: "overview"
    },
    {
      url: "assets/icon/crane.svg",
      name: "Feature",
      tabname: "Projectfeatures"
    },
    // {
    //   url: "assets/icon/pin.svg",
    //   name: "Map",
    //   tabname: "locationtab"
    // },
    {
      url: "assets/icon/excel.svg",
      name: "Property Type",
      tabname: "propertytype"
    },
    {
      url: "assets/icon/payment.svg",
      name: "Payment Type",
      tabname: "paymenttab"
    },
    {
      url: "assets/icon/worker.svg",
      name: "Developer",
      tabname: "developer"
    }
  ];

  JSONparse(id) {
    console.log("JSONPARSER", JSON.parse(id));
    return JSON.parse(id);
  }

  getDemand(demand) {
    return this.service.priceFilter(demand);
  }
}
