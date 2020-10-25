import { Component } from "@angular/core";
import { LoadingController, ViewController, Platform } from "ionic-angular";
import { FilterService } from "../../../../app/services/filterService";
import { Service } from "../../../../app/services/service";

@Component({
  selector: "page-home-search",
  templateUrl: "search-modal.html",
})
export class HomeSearchModalPage {
  selectedCity: any;

  loading: any;
  purpose: any;
  canEnter: boolean = false;
  location: any;
  //Remove Islamabad, added for initial launch
  cityS: any;
  cities = [];
  locations = [];
  data: any;
  type: any;
  Types: any;
  propType: any;
  homes: boolean = true;
  selectedType: any;

  Subtypes = [];
  Subtype: any = null;
  bedsSelected: any;

  areaTypes = [
    {
      id: 0,
      type: "Square Feet",
      value: "sqft",
    },
    {
      id: 1,
      type: "Marla",
      value: "marla",
    },
    {
      id: 2,
      type: "Kanal",
      value: "kanal",
    },
  ];

  beds = [
    {
      value: "1",
      selected: false,
    },
    {
      value: "2",
      selected: false,
    },
    {
      value: "3",
      selected: false,
    },
    {
      value: "4",
      selected: false,
    },
    {
      value: "5",
      selected: false,
    },
    {
      value: "6",
      selected: false,
    },
    {
      value: "7",
      selected: false,
    },
    {
      value: "8",
      selected: false,
    },
    {
      value: "9",
      selected: false,
    },
    {
      value: "10+",
      selected: false,
    },
  ];

  homeBuy = [
    {
      id: 0,
      type: "buy/rent",
      title: "House",
      selected: false,
    },
    {
      id: 1,
      type: "buy/rent",
      title: "Apartment",
      selected: false,
    },
    {
      id: 2,
      type: "buy/rent",
      title: "Farm House",
      selected: false,
    },
    {
      id: 3,
      type: "buy/rent",
      title: "Pent House",
      selected: false,
    },
  ];
  homeRent = [
    {
      id: 0,
      type: "buy/rent",
      title: "House",
      selected: false,
    },
    {
      id: 1,
      type: "buy/rent",
      title: "Apartment",
      selected: false,
    },
    {
      id: 2,
      type: "buy/rent",
      title: "Farm House",
      selected: false,
    },
    {
      id: 3,
      type: "buy/rent",
      title: "Pent House",
      selected: false,
    },
    {
      id: 4,
      type: "Rent",
      title: "Upper Portion",
      selected: false,
    },
    {
      id: 5,
      type: "Rent",
      title: "Lower Portion",
      selected: false,
    },
  ];

  plot = [
    {
      id: 0,

      title: "Residential Plot",
      selected: false,
    },
    {
      id: 1,

      title: "Commercial Plot",
      selected: false,
    },
  ];

  commercial = [
    {
      id: 0,
      title: "Office",
      selected: false,
    },
    {
      id: 1,
      title: "Shop",
      selected: false,
    },
    {
      id: 2,
      title: "Plaza",
      selected: false,
    },
    {
      id: 3,
      title: "Floor",
      selected: false,
    },
  ];
  minArea: any;
  maxArea: any;
  minPrice: string;
  maxPrice: string;

  constructor(
    public viewCtrl: ViewController,
    private service: Service,
    private filterService: FilterService,
    private loadingCtrl: LoadingController,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismissWithoutData();
    });
  }

  ionViewCanEnter() {
    //Remove this line, This is selecting Islamabad initially
    // this.getLocations(1);

    /***************************************/
    if (this.service.filterParams) {
      this.minPrice = this.service.filterParams.minPrice;
      this.maxPrice = this.service.filterParams.maxPrice;

      if (this.service.areaTypeFilterParams) {
        this.index = this.service.areaTypeFilterParams;
      }

      if (this.service.filterParams.beds) {
        this.selectBed(this.service.filterParams.beds);
      }
      if (this.service.areaTypeFilterParams == 1) {
        this.minArea = this.service.filterParams.minArea / 250;
        this.maxArea = this.service.filterParams.maxArea / 250;
        this.selectedType = this.areaTypes[this.service.areaTypeFilterParams];
      } else if (this.service.areaTypeFilterParams == 2) {
        this.minArea = this.service.filterParams.minArea / 5000;
        this.maxArea = this.service.filterParams.maxArea / 5000;
        this.selectedType = this.areaTypes[this.service.areaTypeFilterParams];
      } else if (this.service.areaTypeFilterParams == 0) {
        this.minArea = this.service.filterParams.minArea;
        this.maxArea = this.service.filterParams.maxArea;
        this.selectedType = this.areaTypes[this.service.areaTypeFilterParams];
      }
    }
    if (this.service.locations) {
      this.locations = this.service.locations;
    }
    this.purpose = this.filterService.purpose;
    this.type = this.filterService.purpose;
    this.propType = "all";
    this.filterService.purposeChange.subscribe((res) => {
      this.purpose = res;
    });
  }

  priceValid: boolean = true;
  comparePrice() {
    if (
      parseInt(this.minPrice) <= parseInt(this.maxPrice) ||
      (this.minPrice && !this.maxPrice) ||
      (!this.minPrice && this.maxPrice)
    ) {
      this.priceValid = true;
    } else if (parseInt(this.minPrice) >= parseInt(this.maxPrice)) {
      this.priceValid = false;
    }
  }

  areaValid: boolean = true;
  compareArea() {
    if (
      parseInt(this.minArea) <= parseInt(this.maxArea) ||
      (this.minArea && !this.maxArea) ||
      (!this.minArea && this.maxArea)
    ) {
      this.areaValid = true;
    } else if (parseInt(this.minArea) >= parseInt(this.maxArea)) {
      this.areaValid = false;
    }
  }

  async ionViewDidLoad() {
    this.getCities();
    this.selectedType = this.areaTypes[0];
    if (this.service.searchParams) {
      this.canEnter = true;
      if (this.service.searchParams.type != "all") {
        this.propType = this.service.searchParams.type;
        if (this.service.searchParams.subType) {
          await this.selectBtn(this.service.searchParams.subType);
        }
      }
      if (this.service.searchParams.city) {
        this.cityS = this.service.searchParams.city;

        await this.getLocations(this.cityS._id);
        if (
          this.service.searchParams.location &&
          this.service.searchParams.location != null
        ) {
          this.location = this.service.searchParams.location;
        }
      }
    }
  }

  selectBtn(opt) {
    this.Subtype = null;

    if (this.propType == "House" && this.purpose == "Rent") {
      for (let i in this.homeRent) {
        if (
          this.homeRent[i].id == opt.id &&
          this.homeRent[i].title == opt.title
        ) {
          this.homeRent[i].selected = !this.homeRent[i].selected;
          if (this.homeRent[i].selected) {
            this.Subtype = this.homeRent[i];
          }
        }
        if (this.homeRent[i].id != opt.id) {
          this.homeRent[i].selected = false;
        }
      }
    }
    if (this.propType == "House" && this.purpose == "Buy") {
      for (let i in this.homeBuy) {
        if (
          this.homeBuy[i].id == opt.id &&
          this.homeBuy[i].title == opt.title
        ) {
          this.homeBuy[i].selected = !this.homeBuy[i].selected;
          if (this.homeBuy[i].selected) {
            this.Subtype = this.homeBuy[i];
          }
        }
        if (this.homeBuy[i].id != opt.id) {
          this.homeBuy[i].selected = false;
        }
      }
    }
    if (this.propType == "Plot") {
      for (let i in this.plot) {
        if (this.plot[i].id == opt.id && this.plot[i].title == opt.title) {
          this.plot[i].selected = !this.plot[i].selected;
          if (this.plot[i].selected) {
            this.Subtype = this.plot[i];
          }
        }
        if (this.plot[i].id != opt.id) {
          this.plot[i].selected = false;
        }
      }
    }
    if (this.propType == "Commercial") {
      for (let i in this.commercial) {
        if (
          this.commercial[i].id == opt.id &&
          this.commercial[i].title == opt.title
        ) {
          this.commercial[i].selected = !this.commercial[i].selected;
          if (this.commercial[i].selected) {
            this.Subtype = this.commercial[i];
          }
        }
        if (this.commercial[i].id != opt.id) {
          this.commercial[i].selected = false;
        }
      }
    }
  }

  selectBed(id) {
    if (typeof id == "string") {
      for (let i in this.beds) {
        if (this.beds[i].value == id) {
          this.beds[i].selected = !this.beds[i].selected;
        }
      }
    } else {
      for (let i in this.beds) {
        if (i == id) {
          this.beds[i].selected = !this.beds[i].selected;
          if (this.beds[i].selected) {
            this.bedsSelected = this.beds[i].value;
          } else {
            this.bedsSelected = null;
          }
        }
        if (i != id) {
          this.beds[i].selected = false;
          // this.bedsSelected = null;
        }
      }
    }
  }

  index: any;
  search() {
    this.service.filterParams = null;
    this.service.filterApplied = false;
    if (this.selectedType.value == "kanal") {
      if (this.minArea && this.maxArea) {
        this.minArea = this.minArea * 5000;
        this.maxArea = this.maxArea * 5000;
      }
      if (this.minArea && (this.maxArea == 0 || !this.maxArea)) {
        this.minArea = this.minArea * 5000;
      }
      if (this.maxArea && (this.minArea == 0 || !this.minArea)) {
        this.maxArea = this.maxArea * 5000;
      }
    } else if (this.selectedType.value == "marla") {
      if (this.minArea && this.maxArea) {
        this.minArea = this.minArea * 250;
        this.maxArea = this.maxArea * 250;
      }
      if (this.minArea && (this.maxArea == 0 || !this.maxArea)) {
        this.minArea = this.minArea * 250;
      }
      if (this.maxArea && (this.minArea == 0 || !this.minArea)) {
        this.maxArea = this.maxArea * 250;
      }
    }
    var filterData = {
      minPrice: parseInt(this.minPrice),
      maxPrice: parseInt(this.maxPrice),
      minArea: parseInt(this.minArea),
      maxArea: parseInt(this.maxArea),
      propertyType: this.selectedType,
      beds: this.bedsSelected,
    };

    if (
      (filterData.minPrice && filterData.minPrice != 0) ||
      (filterData.maxPrice && filterData.maxPrice != 0) ||
      (filterData.minArea && filterData.minArea != 0) ||
      (filterData.maxArea && filterData.maxArea != 0) ||
      filterData.beds
    ) {
      this.service.areaTypeFilterParams = this.index;
      this.service.filterParams = filterData;
      this.service.filterApplied = true;
    }

    var data = {
      location: this.location,
      city: this.cityS,
      type: this.propType,
      subType: this.Subtype,
      filter: filterData,
    };

    this.service.searchParams = data;
    this.viewCtrl.dismiss(data);
  }
  changeType(e) {
    this.filterService.purpose = e._value;
    this.filterService.filterByPurpose();
  }

  changeCanEnter() {
    this.canEnter = false;

    this.Subtype = null;
  }

  changePropType(e, check) {
    this.propType = e._value;

    if (this.propType == "House" || this.propType == "all") {
      this.homes = true;
    } else {
      this.homes = false;
    }
    if (!check) this.Subtype = null;
  }
  selectCity(ev) {
    if (this.cityS != null) {
      this.service.locations = null;
      this.getLocations(ev._id);
    }
    this.location = null;
  }

  getLocations(cityId) {
    if (!this.service.locations) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
      });
      this.loading.present();
    }
    this.service.getLocations().subscribe((data) => {
      this.locations = data;

      if (!this.service.locations) {
        this.loading.dismiss();
      }

      if (cityId)
        this.locations = data.filter(function (loc) {
          return loc.cityId == cityId;
        });

      this.locations.sort((a, b) => {
        return this.service.compareStrings(a.location, b.location, "");
      });
      this.service.locations = this.locations;
    }),
      (err) => {
        this.loading.dismiss();
        console.error(err);
      };
  }

  getCities() {
    this.service.getCities().subscribe((data) => {
      data.sort((a, b) => {
        return this.service.compareStrings(a.city, b.city, "");
      });
      this.service.cities = data;
      this.selectedCity = data;
      this.cities = data;
    }),
      (err) => {
        console.error(err);
      };
  }

  dismissWithoutData() {
    this.viewCtrl.dismiss();
  }

  locationChange() {
    // this.keyBoard.close();
  }

  reset() {
    this.cityS = null;
    this.location = null;
    this.propType = "all";
    this.Subtype = null;

    var data = {
      city: this.cityS,
      location: this.location,
      type: this.propType,
      subType: this.Subtype,
    };

    this.service.filterParams = null;

    this.service.searchParams = data;
    this.viewCtrl.dismiss(data);
  }
}
