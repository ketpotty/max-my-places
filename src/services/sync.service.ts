import { Injectable } from '@angular/core';
import { Headers, Response, Http } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { Place } from '../model/place.model'
import { PlacesService } from './places.service'

@Injectable()
export class SyncService {
  private isSyncProgressing: boolean = false;
  private syncStatus: string;
  private hasError: boolean = false;

  constructor(private http: Http, private placesService: PlacesService) {}

  dbStorePlaces(places: Place[]) {
      const myHeaders = new Headers({
        'Content-Type': 'application/json'
      });
      return this.http.put('https://ng4-guide-max01.firebaseio.com/my-places.json', places,
        {
          headers: myHeaders
        }
      )
      .map(
        (res: Response) => {
          return res.json();
        }
      )
      .catch(
        (error) => {
          return Observable.throw(error);
        }
      );
  }

  dbGetPlaces() {
    return this.http.get('https://ng4-guide-max01.firebaseio.com/my-places.json')
      .map(
        (response: Response) => {
          const data = response.json();
          return data != null ? data : [];
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw(error);
        }
      );
  }

  fullSync(syncOptions: any): Observable<any> {
    return Observable.create(
      (observer) => {
        this.isSyncProgressing = true;
        this.hasError = false;
        this.syncStatus = "Getting local data";
        this.placesService.getPlaces()
          .then(
            (localPlaces: Place[]) => {
              this.syncStatus = "Getting cloud data";
              this.dbGetPlaces()
                .subscribe(
                  (remotePlaces: Place[]) => {
                    console.log("Cloud data: ", remotePlaces);
                    this.syncStatus = "Merging data";
                    // --------------------------------------------
                    // ToDo: implement merge itself with sync options properly into newLocalPlaces & newRemotePlaces, the following is only a workaround
                    // Emulating merge: just simply keep only one item, if any is duplicated
                    var mergedPlaces: Place[] = _.uniqBy([...localPlaces, ...remotePlaces], 'title');
                    var newLocalPlaces: Place[] = localPlaces != null ? localPlaces.slice() : [];
                    var newRemotePlaces: Place[] = remotePlaces != null ? remotePlaces.slice() : [];
                    // Emulating sync options: using the merged list only, if one of the add-replace-remove functionality is enabled for particular side (local and remote)
                    if (syncOptions.optSyncUpAdd || syncOptions.optSyncUpReplace || syncOptions.optSyncUpRemove) {
                      newRemotePlaces = mergedPlaces.slice();
                    }
                    if (syncOptions.optSyncDownAdd || syncOptions.optSyncDownReplace || syncOptions.optSyncDownRemove) {
                      newLocalPlaces = mergedPlaces.slice();
                    }
                    // --------------------------------------------
                    this.syncStatus = "Storing data locally";
                    this.placesService.storePlaces(newLocalPlaces)
                      .then(
                        (places: Place[]) => {
                          this.syncStatus = "Storing data to cloud";
                          this.dbStorePlaces(newRemotePlaces)
                            .subscribe(
                              (response) => {
                                this.syncStatus = "Sync finished";
                                console.log("dbStorePlaces response: ", response);
                                this.isSyncProgressing = false;
                                return observer.next(this.getSyncStatus());
                              },
                              (error) => {
                                this.hasError = true;
                                this.syncStatus = 'Storing to cloud failed! ' + error;
                                console.log("dbStorePlaces failed!", error);
                                return observer.throw(this.getSyncStatus());
                              }
                            );
                        }
                      )
                      .catch(
                        (error) => {
                          this.hasError = true;
                          this.syncStatus = 'Storing locally failed! ' + error;
                          console.log("storePlaces failed!", error);
                          return observer.throw(this.getSyncStatus());
                        }
                      )
                      return observer.next(this.getSyncStatus());
                  },
                  (error) => {
                    this.hasError = true;
                    this.syncStatus = 'Loading from cloud failed! ' + error;
                    console.log("dbGetPlaces failed!", error);
                    return observer.throw(this.getSyncStatus());
                  }
                );
              }
          )
          .catch(
            (error) => {
              this.hasError = true;
              this.syncStatus = 'Loading local data failed! ' + error;
              console.log("getPlaces failed!", error);
              return observer.throw(this.getSyncStatus());
            }
          );
          return observer.next(this.getSyncStatus());
      }
    );
  }

  getSyncStatus() {
    return {
      isSyncProgressing: this.isSyncProgressing,
      hasError: this.hasError,
      syncStatus: this.syncStatus
    };
  }

}
