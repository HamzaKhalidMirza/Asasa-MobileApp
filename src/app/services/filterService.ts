import { Injectable } from "@angular/core";
import { Service } from "./service";
import { Subject } from "rxjs";

@Injectable()
export class FilterService {
  processingData: any;
  processedData: any;
  processingDataWithPurpsoe: any;
  filteredAds: any;
  purpose = "Buy";
  purposeChange: Subject<any> = new Subject<any>();

  filterAdsChange: Subject<any> = new Subject<any>();

  constructor(public service: Service) {}

  public filterByPurpose() {
    this.purposeChange.next(this.purpose);

    this.processingData = this.processingDataWithPurpsoe.filter((ad) => {
      return ad.property_type_rent_buy == this.purpose;
    });

    this.processedData = this.processingData;
    console.log("bypurpose");
    return this.processingData;
  }

  async filterCity(filter) {
    const ads = await this.filterByPurpose().filter(
      (ad) => ad.city.city.city == filter.city.city
    );
    this.processedData = ads;
    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("byCity");
    }
  }

  async filterLocation(filter) {
    var ads = await this.filterByPurpose().filter(
      (ad) =>
        ad.location_data.location_data.location == filter.location.location
    );
    this.processedData = ads;
    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("byLocation");
    }
  }

  async filterType(filter) {
    var ads = await this.filterByPurpose().filter(
      (ad) => ad.property_Type_Name == filter.type
    );
    this.processedData = ads;
    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("bytype");
    }
  }

  async filterSubtype(filter) {
    var ads = await this.filterByPurpose().filter(
      (ad) => ad.property_types == filter.subType.title
    );
    this.processedData = ads;

    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("  bySubtype  ");
    }
  }

  async filterCityType(filter) {
    var ads = await this.filterByPurpose().filter(
      (ad) => ad.city.city.city == filter.city.city
    );

    ads = await ads.filter((ad) => ad.property_Type_Name == filter.type);
    this.processedData = ads;
    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("byCityAndType");
    }
  }

  async filterCitySubtype(filter) {
    var ads = await this.filterByPurpose().filter(
      (ad) => ad.city.city.city == filter.city.city
    );

    ads = await ads.filter((ad) => ad.property_types == filter.subType.title);
    this.processedData = ads;
    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("byCityandSubtype");
    }
  }

  async filterLocationType(filter) {
    var ads = await this.filterByPurpose().filter(
      (ad) =>
        ad.location_data.location_data.location == filter.location.location
    );

    ads = await ads.filter((ad) => ad.property_Type_Name == filter.type);
    this.processedData = ads;
    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("byLocationandType");
    }
  }
  async filterLocationSubtype(filter) {
    var ads = await this.filterByPurpose().filter(
      (ad) =>
        ad.location_data.location_data.location == filter.location.location
    );

    ads = await ads.filter((ad) => ad.property_types == filter.subType.title);
    this.processedData = ads;
    if (this.service.filterParams) {
      this.filterByPriceAndArea(this.service.filterParams, ads);
    } else {
      this.filterAdsChange.next(ads);
      console.log("byLocaitonandSubtype");
    }
  }

  async filterByPriceAndArea(filter, data) {
    if (
      (filter.minPrice && filter.minPrice != 0) ||
      (filter.maxPrice && filter.maxPrice != 0) ||
      (filter.minArea && filter.minArea != 0) ||
      (filter.maxArea && filter.maxArea != 0) ||
      filter.beds
    ) {
      console.log("Price and filter function is calling");

      var ads;
      var filteredByPriceOrArea;

      if (data) {
        ads = data;
      } else {
        ads = this.filterByPurpose();
      }

      if (
        (filter.minPrice || filter.maxPrice) &&
        !filter.minArea &&
        !filter.maxArea
      ) {
        if (filter.minPrice && filter.maxPrice) {
          filteredByPriceOrArea = ads.filter(
            (ad) =>
              parseInt(ad.demand) >= filter.minPrice &&
              parseInt(ad.demand) <= filter.maxPrice
          );
        }
        if (filter.minPrice && !filter.maxPrice) {
          filteredByPriceOrArea = ads.filter(
            (ad) => parseInt(ad.demand) >= filter.minPrice
          );
        }

        if (!filter.minPrice && filter.maxPrice) {
          filteredByPriceOrArea = ads.filter(
            (ad) => parseInt(ad.demand) <= filter.maxPrice
          );
        }
      }

      if (
        !filter.minPrice &&
        !filter.maxPrice &&
        (filter.minArea || filter.maxArea)
      ) {
        if (filter.minArea && filter.maxArea) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) >=
                filter.minArea &&
              this.getArea(res.property_unit, res.land_area) <= filter.maxArea
          );
        }

        if (filter.minArea && !filter.maxArea) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) >= filter.minArea
          );
        }
        if (!filter.minArea && filter.maxArea) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) <= filter.maxArea
          );
        }
      }

      if (
        (filter.minPrice || filter.maxPrice) &&
        (filter.minArea || filter.maxArea)
      ) {
        if (
          filter.minPrice &&
          filter.maxPrice &&
          filter.minArea &&
          filter.maxArea
        ) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) >=
                filter.minArea &&
              this.getArea(res.property_unit, res.land_area) <=
                filter.maxArea &&
              parseInt(res.demand) >= filter.minPrice &&
              parseInt(res.demand) <= filter.maxPrice
          );
        }

        if (
          filter.minPrice &&
          !filter.maxPrice &&
          filter.minArea &&
          filter.maxArea
        ) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) >=
                filter.minArea &&
              this.getArea(res.property_unit, res.land_area) <=
                filter.maxArea &&
              parseInt(res.demand) >= filter.minPrice
          );
        }
        if (
          !filter.minPrice &&
          filter.maxPrice &&
          filter.minArea &&
          filter.maxArea
        ) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) >=
                filter.minArea &&
              this.getArea(res.property_unit, res.land_area) <=
                filter.maxArea &&
              parseInt(res.demand) <= filter.maxPrice
          );
        }
        if (
          filter.minPrice &&
          filter.maxPrice &&
          !filter.minArea &&
          filter.maxArea
        ) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) <=
                filter.maxArea &&
              parseInt(res.demand) >= filter.minPrice &&
              parseInt(res.demand) <= filter.maxPrice
          );
        }
        if (
          filter.minPrice &&
          filter.maxPrice &&
          filter.minArea &&
          !filter.maxArea
        ) {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              this.getArea(res.property_unit, res.land_area) >=
                filter.minArea &&
              parseInt(res.demand) >= filter.minPrice &&
              parseInt(res.demand) <= filter.maxPrice
          );
        }
      }

      if (filter.beds) {
        if (filter.beds != "10+") {
          filteredByPriceOrArea = ads.filter(
            (res) =>
              res.bedrooms <= parseInt(filter.beds) &&
              res.property_Type_Name == "House"
          );

          console.log("FilteredAdsByBed", filteredByPriceOrArea);
        }
        if (filter.beds == "10+") {
          filteredByPriceOrArea = ads.filter(
            (res) => res.bedrooms > 10 && res.property_Type_Name == "House"
          );
        }
      }

      this.filterAdsChange.next(filteredByPriceOrArea);
    }
  }

  // public filterPrice(price) {
  //   if (
  //     (price.minPrice && price.minPrice != 0) ||
  //     (price.maxPrice && price.maxPrice != 0)
  //   ) {
  //     if (price.minPrice && price.maxPrice) {
  //       this.processingData.forEach(ad => {
  //         if (
  //           parseInt(ad.demand) >= price.minPrice &&
  //           parseInt(ad.demand) <= price.maxPrice
  //         ) {
  //           this.filteredAds.push(ad);
  //         }
  //       });
  //     }
  //     if (price.minPrice && (price.maxPrice == 0 || !price.maxPrice)) {
  //       this.processingData.forEach(ad => {
  //         if (parseInt(ad.demand) >= price.minPrice) {
  //           this.filteredAds.push(ad);
  //         }
  //       });
  //     }
  //     if (price.maxPrice && (price.minPrice == 0 || !price.minPrice)) {
  //       this.processingData.forEach(ad => {
  //         if (parseInt(ad.demand) <= price.maxPrice) {
  //           this.filteredAds.push(ad);
  //         }
  //       });
  //     }
  //   }
  // }
  // public filterArea(area) {
  //   if (
  //     (area.minArea && area.minArea != 0) ||
  //     (area.maxArea && area.maxArea != 0)
  //   ) {
  //     if (
  //       (area.minPrice && area.minPrice != 0) ||
  //       (area.maxPrice && area.maxPrice != 0)
  //     ) {
  //       if (area.minArea && area.maxArea) {
  //         this.filteredAds = this.filteredAds.filter(
  //           ad =>
  //             this.getArea(ad.areaType, ad.area) >= area.minArea &&
  //             this.getArea(ad.areaType, ad.area) <= area.maxArea
  //         );
  //       }
  //       if (area.minArea && (area.maxArea == 0 || !area.maxArea)) {
  //         this.filteredAds = this.filteredAds.filter(
  //           ad => this.getArea(ad.areaType, ad.area) >= area.minArea
  //         );
  //       }
  //       if (area.maxArea && (area.minArea == 0 || !area.minArea)) {
  //         this.filteredAds = this.filteredAds.filter(
  //           ad => this.getArea(ad.areaType, ad.area) <= area.maxArea
  //         );
  //       }
  //     } else {
  //       if (area.minArea && area.maxArea) {
  //         this.processingData.forEach(ad => {
  //           if (
  //             this.getArea(ad.areaType, ad.area) >= area.minArea &&
  //             this.getArea(ad.areaType, ad.area) <= area.maxArea
  //           ) {
  //             this.filteredAds.push(ad);
  //           }
  //         });
  //       }
  //       if (area.minArea && (area.maxArea == 0 || !area.maxArea)) {
  //         this.processingData.forEach(ad => {
  //           if (this.getArea(ad.areaType, ad.area) >= area.minArea) {
  //             this.filteredAds.push(ad);
  //           }
  //         });
  //       }
  //       if (area.maxArea && (area.minArea == 0 || !area.minArea)) {
  //         this.processingData.forEach(ad => {
  //           if (this.getArea(ad.areaType, ad.area) <= area.maxArea) {
  //             this.filteredAds.push(ad);
  //           }
  //         });
  //       }
  //     }
  //   }
  // }

  // public filterByPropertyType(filter) {
  //   if (this.filteredAds.length > 0) {
  //     if (filter.propertyType == "all") {
  //     } else {
  //       this.filteredAds = this.filteredAds.filter(
  //         ad => ad.type == filter.propertyType
  //       );
  //     }
  //   } else if (
  //     this.filteredAds.length == 0 &&
  //     !(
  //       (filter.minPrice && filter.minPrice != 0) ||
  //       (filter.maxPrice && filter.maxPrice != 0) ||
  //       (filter.minArea && filter.minArea != 0) ||
  //       (filter.maxArea && filter.maxArea != 0)
  //     )
  //   ) {
  //     if (filter.propertyType == "all") {
  //       this.processingData.forEach(ad => {
  //         this.filteredAds.push(ad);
  //       });
  //     } else {
  //       this.filteredAds = this.processingData.filter(
  //         ad => ad.type == filter.propertyType
  //       );
  //     }
  //   }
  // }

  getArea(areaType, area) {
    return this.service.convertArea(areaType, area);
  }
}
