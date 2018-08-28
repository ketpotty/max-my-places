import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, Events } from 'ionic-angular';

import { OptionsService } from '../../services/options.service';
import { SyncService } from '../../services/sync.service';

@IonicPage()
@Component({
  selector: 'page-sync-dialog',
  templateUrl: 'sync-dialog.html',
})
export class SyncDialogPage {
  isSyncProgressing: boolean = false;
  syncStatus: string = 'Preparing sync';
  hasError: boolean = false;
  themeName: string;

  constructor(
      private viewCtrl: ViewController,
      public navCtrl: NavController,
      public navParams: NavParams,
      private syncService: SyncService,
      private optionsService: OptionsService,
      public events: Events
    ) { }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SyncDialogPage');
  }

  ionViewDidEnter() {
    this.themeName = this.optionsService.themeName();
    if (this.navParams == null || this.navParams.data == undefined) {
      return;
    }
    var syncOptions = this.navParams.data;
    setTimeout(
      () => {
        console.log('Sync options', syncOptions);
        this.isSyncProgressing = true;
        this.hasError = false;
        this.syncStatus = "Syncing data";
        this.syncService.fullSync(syncOptions)
          .subscribe(
            (response) => {
              //console.log('Sync response', response);
              this.isSyncProgressing = response.isSyncProgressing;
              this.hasError = response.hasError;
              this.syncStatus = response.syncStatus;
              if (!response.isSyncProgressing) {
                this.events.publish('sync:finished');
                this.viewCtrl.dismiss();
              }
            }
          )
      }, 50
    );
  }

}
