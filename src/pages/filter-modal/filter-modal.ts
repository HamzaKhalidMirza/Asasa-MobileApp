import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Platform,
} from "ionic-angular";
import { Service } from "../../app/services/service";
import { FilterService } from "../../app/services/filterService";

@Component({
  selector: "page-filter-modal",
  templateUrl: "filter-modal.html",
})
export class FilterModalPage {
  minPrice: any;
  maxPrice: any;
  minArea: any;
  maxArea: any;
  filterParams: any;
  selectedType: any;
  selectedProperty: any = "all";
  index = 0;
  purpose: any;
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
  homes: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public service: Service,
    private filterService: FilterService,
    platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
  }

  ionViewDidLoad() {
    if (this.service.searchParams) {
      if (this.service.searchParams.type == "House") {
        this.homes = true;
      }
    } else {
      this.homes = false;
    }
    this.purpose = this.filterService.purpose;
    this.filterService.purposeChange.subscribe((res) => {
      this.purpose = res;
    });
    this.selectedType = this.areaTypes[0];

    if (this.service.filterParams) {
      this.minPrice = this.service.filterParams.minPrice;
      this.maxPrice = this.service.filterParams.maxPrice;

      if (this.service.areaTypeFilterParams) {
        this.index = this.service.areaTypeFilterParams;
      }

      this.selectedProperty = this.service.filterParams.propertyType;
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

  dismiss() {
    this.viewCtrl.dismiss();
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
  dismissWithData() {
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

    this.service.areaTypeFilterParams = this.index;
    this.service.filterParams = filterData;
    this.service.filterApplied = true;
    this.viewCtrl.dismiss({ filter: filterData });
  }

  reset() {
    console.log("reseting");
    this.minArea = null;
    this.maxArea = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedType = this.areaTypes[0];
    this.bedsSelected = null;

    var filterData = {
      minPrice: null,
      maxPrice: null,
      minArea: null,
      maxArea: null,
      area: 0,
      beds: this.bedsSelected,
    };
    this.service.filterParams = filterData;
    this.service.filterApplied = false;
    this.viewCtrl.dismiss({ filter: filterData });
  }
}
