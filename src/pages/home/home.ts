import { Component } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';

import { OptionsService } from '../../services/options.service';
import { PlacesService } from '../../services/places.service';
import { ThemeProvider } from '../../providers/theme.provider';

import { NewPlacePage } from '../new-place/new-place';
import { PlacePage } from '../place/place';
import { Place } from '../../model/place.model'
import { SyncDialogPage } from '../sync-dialog/sync-dialog';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  places: {title: string, location: {lat: number, lng: number}}[] = [];
  isMultiSelect: boolean = false;
  checkItems: any;
  allSelectIcon: string = "checkbox";
  version: string = "1.00.180809.02";

  constructor(
      public navCtrl: NavController,
      private placesService: PlacesService,
      private modalCtrl: ModalController,
      private optionsService: OptionsService,
      private themeProvider: ThemeProvider,
      public events: Events
    ) {
    this.events.subscribe('sync:finished', () => {
      this.onRefresh();
    });
  }

  ionViewWillEnter() {
    this.themeProvider.setActiveTheme(this.optionsService.themeName());
    this.onRefresh();
  }

  onRefresh() {
    return this.placesService.getPlaces()
      .then(
        (places) => {
          this.places = places;
          this.isMultiSelect = false;
        }
      );
  }

  onLoadNewPlace() {
    this.navCtrl.push(NewPlacePage);
  }

  onOpenPlace(place: Place) {
    let modal = this.modalCtrl.create(PlacePage, place, {cssClass: this.optionsService.themeName()});
    modal.onDidDismiss(
      () => {
        return this.onRefresh();
      }
    );
    modal.present();
  }

  onRemove() {
    this.isMultiSelect = true;
    this.allSelectIcon = "checkbox";
    this.checkItems = {};
  }

  onCancel() {
    this.isMultiSelect = false;
  }

  onRemoveOk() {
    console.log(this.checkItems);
    this.placesService.removePlaces(this.checkItems)
      .then(
        (places: Place[]) => {
          this.places = places;
          this.isMultiSelect = false;
        }
      );
  }

  countSelected() {
    let retVal: number = 0;
    for(let key in this.checkItems) {
      retVal += this.checkItems[key] ? 1 : 0;
    }
    return retVal;
  }

  onAllSelect() {
    if (this.allSelectIcon === "checkbox") {
      this.allSelectIcon = "square";
    } else {
      this.allSelectIcon = "checkbox";
    }
    this.checkItems = {};
    this.places.forEach(
      (item, index) => {
        this.checkItems[item.title] = (this.allSelectIcon != "checkbox");
      }
    )
  }

  onSync() {
    var syncOptions = this.optionsService.getSyncOptions();
    let modal = this.modalCtrl.create(SyncDialogPage, syncOptions, {cssClass: this.optionsService.themeName()});
    modal.onDidDismiss(
      () => {
        return;
      }
    );
    modal.present();
  }

}
