import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ThemeProvider } from '../providers/theme.provider';
import { OptionsService } from '../services/options.service';

import { HomePage } from '../pages/home/home';
import { OptionsPage } from '../pages/options/options';
import { SyncDialogPage } from '../pages/sync-dialog/sync-dialog';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  selectedTheme: string;
  rootPage:any = HomePage;

  constructor(
      platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen,
      private modalCtrl: ModalController,
      private themeProvider: ThemeProvider,
      private optionsService: OptionsService
    ) {
    this.themeProvider.getActiveTheme()
      .subscribe(
        (themeName: string) => {
          this.selectedTheme = themeName;
        }
      );

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onSaveToCloud() {
    //alert("Save to cloud...");
    var options: any = {
      syncUploadMode: 'add-replace',
      syncDownloadMode: ''
    };
    var syncOptions: any = this.optionsService.getSyncOptionsFromOptions(options);
    let modal = this.modalCtrl.create(SyncDialogPage, syncOptions, {cssClass: this.optionsService.themeName()});
    modal.onDidDismiss(
      () => {
        return;
      }
    );
    modal.present();
  }

  onGetFromCloud() {
    //alert("Get from cloud...");
    var options: any = {
      syncUploadMode: '',
      syncDownloadMode: 'add-replace'
    };
    var syncOptions: any = this.optionsService.getSyncOptionsFromOptions(options);
    let modal = this.modalCtrl.create(SyncDialogPage, syncOptions, {cssClass: this.optionsService.themeName()});
    modal.onDidDismiss(
      () => {
        return;
      }
    );
    modal.present();
}

  onSettings() {
    //alert("Settings...");
    //this.navCtrl.push(OptionsPage);
    let modal = this.modalCtrl.create(OptionsPage, null, {cssClass: this.optionsService.themeName()});
    modal.onDidDismiss(
      () => {
        return;
      }
    );
    modal.present();
  }

}
