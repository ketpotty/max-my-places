import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Place } from '../model/place.model'

@Injectable()
export class PlacesService {
  private places: Place [] = [];

  constructor(private storage: Storage) {}

  storePlaces(places: Place[]) {
    this.places = places == null ? [] : places.slice();
    return this.storage.set('places', this.places)
      .then(
        (places: Place[]) => {
          return places.slice();
        }
      )
      .catch(
        (error) => {
          return console.log('storePlaces failed!', error);
        }
      );
  }

  addPlace(place: Place) {
    return this.getPlaces()
      .then(
        (places: Place[]) => {
          this.places = places == null ? [] : places.slice();
          this.places.push(place);
          return this.storage.set('places', this.places)
            .then(
              (places: Place[]) => {
                return places.slice();
              }
            )
            .catch(
              (error) => {
                return console.log('addPlace failed!', error);
              }
            );
        }
      )
      .catch(
        (error) => {
          return console.log('getPlaces failed!', error);
        }
      );
  }

  getPlaces() {
    return this.storage.get('places')
      .then(
        (places) => {
          this.places = places == null ? [] : places;
          return this.places.slice();
        }
      );
  }

  removePlace(title: string) {
    return this.getPlaces()
      .then(
        (places: Place[]) => {
          this.places = places == null ? [] : places.slice();
          this.places.forEach(
            (item, index) => {
              if (item.title === title) {
                this.places.splice(index, 1);
              }
            }
          );
          return this.storage.set('places', this.places)
            .then(
              (places: Place[]) => {
                return places.slice();
              }
            )
            .catch(
              (error) => {
                return console.log('removePlace failed!', error);
              }
            );
        }
      )
      .catch(
        (error) => {
          return console.log('getPlaces failed!', error);
        }
      );
  }

  removePlaces(titles: any) {
    return this.getPlaces()
      .then(
        (places: Place[]) => {
          this.places = places == null ? [] : places.slice();
          for(let key in titles) {
            let itemChecked: boolean = titles[key];
            if (itemChecked) {
              this.places.forEach(
                (item, index) => {
                  if (item.title === key) {
                    this.places.splice(index, 1);
                  }
                }
              );
            }
          }
          return this.storage.set('places', this.places)
            .then(
              (places: Place[]) => {
                return places.slice();
              }
            )
            .catch(
              (error) => {
                return console.log('removePlaces failed!', error);
              }
            );
        }
      )
      .catch(
        (error) => {
          return console.log('getPlaces failed!', error);
        }
      );
  }

  updatePlace(place: Place) {
    return this.getPlaces()
      .then(
        (places: Place[]) => {
          this.places = places == null ? [] : places.slice();
          let itemFound: boolean = false;
          this.places.forEach(
            (item, index) => {
              if (item.title === place.title) {
                item.location.lat = +place.location.lat;
                item.location.lng = +place.location.lng;
                itemFound = true;
              }
            }
          );
          if (!itemFound) {
            this.places.push(place);
          }
          return this.storage.set('places', this.places)
            .then(
              (places: Place[]) => {
                return places.slice();
              }
            )
            .catch(
              (error) => {
                return console.log('updatePlace failed!', error);
              }
            );
        }
      )
      .catch(
        (error) => {
          return console.log('getPlaces failed!', error);
        }
      );
  }

}
