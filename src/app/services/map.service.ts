/// <reference types="@types/googlemaps"/>

import { Injectable } from "@angular/core";
import * as $ from "jquery";

declare var klokantech: any;
@Injectable()
export class MapService {
  mapBounds: any;
  mapMinZoom: any;
  mapMaxZoom: any;
  overlay: any;
  opacitycontrol: any;

  constructor() {}

  addOverLay(map, bounds, imgLoc) {
    this.mapBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(bounds.lat0, bounds.lng0),
      new google.maps.LatLng(bounds.lat1, bounds.lng1)
    );
    this.mapMinZoom = 10;
    this.mapMaxZoom = 18;

    map.overlayMapTypes.clear();

    this.overlay = new klokantech.MapTilerMapType(
      map,
      function (x, y, z) {
        return (
          "https://asasamaps.s3.us-east-2.amazonaws.com/map/" +
          imgLoc +
          "/{z}/{x}/{y}.png"
            .replace("{z}", z)
            .replace("{x}", x)
            .replace("{y}", y)
        );
      },

      this.mapBounds,
      this.mapMinZoom,
      this.mapMaxZoom
    );

    if (this.opacitycontrol) {
      $(".goog-slider-horizontal").remove();
    }

    this.opacitycontrol = new klokantech.OpacityControl(map, this.overlay);

    map.fitBounds(this.mapBounds);
    map.setZoom(16);
  }

  setDefault() {
    if (this.mapBounds) {
      delete this.mapBounds;
    }
    if (this.overlay) {
      delete this.overlay;
    }
  }
}
