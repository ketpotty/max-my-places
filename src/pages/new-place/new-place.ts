import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { PlacesService } from '../../services/places.service';

@IonicPage()
@Component({
  selector: 'page-new-place',
  templateUrl: 'new-place.html',
})
export class NewPlacePage {
  location: {lat: number, lng: number} = {lat: 0, lng: 0};
  queryInProgress: boolean = false;
  hasLocation: boolean = false;
  hasError: boolean = false;
  errorMessage: string;

  constructor(public navCtrl: NavController, private placesService: PlacesService, private geolocation: Geolocation) {
  }

  onAddPlace(value: {title: string}) {
    this.placesService.addPlace({title: value.title, location: this.location});
    this.navCtrl.pop();
  }

  onLocateUser() {
    this.queryInProgress = true;
    this.hasError = false;
    this.geolocation.getCurrentPosition({ timeout: 10000 })
      .then(
        (location) => {
          console.log('Location fetched successfully.', location);
          this.location.lat = location.coords.latitude;
          this.location.lng = location.coords.longitude;
          this.queryInProgress = false;
          this.hasLocation = true;
        }
      )
      .catch(
        (error) => {
          console.log('An error occurred!', error);
          this.hasError = true;
          this.errorMessage = error;
          this.queryInProgress = false;
        }
      );
  }

}
