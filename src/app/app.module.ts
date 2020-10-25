import { LocateUsPage } from "./../pages/locate-us/locate-us";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Geolocation } from "@ionic-native/geolocation";
import { HttpModule } from "@angular/http";

import { CallNumber } from "@ionic-native/call-number";
import { Network } from "@ionic-native/network";
import { Camera } from "@ionic-native/camera";

import { MyApp } from "./app.component";
import { MapService } from "./services/map.service";
import { Service } from "./services/service";
import { FilterModalPage } from "../pages/filter-modal/filter-modal";
import { FilterService } from "./services/filterService";

import { LoginService } from "./services/login.service";

import { LoginModule } from "./../pages/login/login.module";
import { SellPage } from "../pages/sell/sell";
import { TestimonialPage } from "./../pages/testimonial/testimonial";
import { HomeModule } from "./../pages/home/home.module";

import { NativeStorage } from "@ionic-native/native-storage";
import { CodePush } from "@ionic-native/code-push";
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { SmsRetriever } from "@ionic-native/sms-retriever/ngx";
import { LaunchReview } from "@ionic-native/launch-review";

import { Facebook } from "@ionic-native/facebook";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Deeplinks } from "@ionic-native/deeplinks";
import { IonicTelInputModule} from 'ionic-tel-input';

@NgModule({
  declarations: [
    MyApp,
    FilterModalPage,
    EditProfilePage,
    SellPage,
    TestimonialPage,
    LocateUsPage,
    // FavouriteAdsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    HomeModule,
    LoginModule,
    IonicTelInputModule

    // SocialLoginModule
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FilterModalPage,

    EditProfilePage,
    SellPage,
    TestimonialPage,
    LocateUsPage,
    // FavouriteAdsPage
  ],
  providers: [
    SocialSharing,
    Deeplinks,
    StatusBar,
    SplashScreen,
    MapService,
    Service,
    FilterService,
    LoginService,
    Geolocation,
    CallNumber,
    Network,
    Camera,
    NativeStorage,
    CodePush,
    SmsRetriever,
    LaunchReview,
    Facebook,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: getAuthServiceConfigs
    // }
  ],
})
export class AppModule {}
