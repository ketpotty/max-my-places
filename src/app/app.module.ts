import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'
import { Geolocation } from '@ionic-native/geolocation';
import { AgmCoreModule } from '@agm/core';
import { HttpModule } from '@angular/http';

import { PlacesService } from '../services/places.service';
import { SyncService } from '../services/sync.service';
import { OptionsService } from '../services/options.service';
import { ThemeProvider } from '../providers/theme.provider';
import { OrderByPipe } from '../pipes/order-by.pipe';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NewPlacePage} from '../pages/new-place/new-place';
import { PlacePage } from '../pages/place/place';
import { OptionsPage } from '../pages/options/options';
import { SyncDialogPage } from '../pages/sync-dialog/sync-dialog';

@NgModule({
  declarations: [
    MyApp,
    OrderByPipe,
    HomePage,
    NewPlacePage,
    PlacePage,
    OptionsPage,
    SyncDialogPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__yourappname',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC0Sw37eJdpZXRAMvwnrc_D60INTyDr5OY'
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewPlacePage,
    PlacePage,
    OptionsPage,
    SyncDialogPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    PlacesService,
    SyncService,
    OptionsService,
    ThemeProvider
  ]
})

export class AppModule {}
