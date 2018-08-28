import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { PlacesService } from '../../services/places.service';
import { Place } from '../../model/place.model'

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;
  inEditMode: boolean = false;

  constructor(private viewCtrl: ViewController, private placesService: PlacesService, private navParams: NavParams) {
    if (this.navParams != null && this.navParams.data != undefined) {
      let placeParam = this.navParams.data;
      this.place = {
        title: placeParam.title,
        location: {
          lat: +placeParam.location.lat,
          lng: +placeParam.location.lng,
        }
      }
    }
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

  onEdit() {
    this.inEditMode = true;
  }

  onEditOk() {
    this.placesService.updatePlace(this.place)
      .then(
        (places: Place[]) => {
          this.inEditMode = false;
        }
      )
      .catch(
        (error) => {
          console.log('Save changes failed!', error);
        }
      );
  }

  onCancel() {
    this.inEditMode = false;
  }

}
