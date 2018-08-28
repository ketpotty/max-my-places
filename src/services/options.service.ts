import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class OptionsService {
  private _options: any = {};

  constructor(private storage: Storage) {
    this.getOptions();
  }

  syncUploadMode() {
    return this._options.syncUploadMode;
  }

  syncDownloadMode() {
    return this._options.syncDownloadMode;
  }

  themeName() {
    return this._options.themeName;
  }

  setSyncUploadMode(uploadMode: string) {
    this._options.syncUploadMode = uploadMode;
  }

  setSyncDownloadMode(downloadMode: string) {
    this._options.syncDownloadMode = downloadMode;
  }

  setThemeName(themeName: string) {
    this._options.themeName = themeName;
  }

  getOptions() {
    return this.storage.get('options')
      .then(
        (options) => {
          this._options = options == null ? {} : options;
          this._options.syncUploadMode = this._options.syncUploadMode === undefined ? 'add' : this._options.syncUploadMode;
          this._options.syncDownloadMode = this._options.syncDownloadMode === undefined ? 'replace-add' : this._options.syncDownloadMode;
          this._options.themeName = this._options.themeName === undefined ? 'light-theme' : this._options.themeName;
          return this._options;
        }
      );
  }

  saveOptions() {
    return this.storage.set('options', this._options)
      .then(
        (options) => {
          return options;
        }
      )
      .catch(
        (error) => {
          return console.log('saveOptions failed!', error);
        }
      );
  }

  getSyncOptionsFromOptions(options) {
    return {
      optSyncUpAdd: (options.syncUploadMode.indexOf('add') > -1),
      optSyncUpReplace: (options.syncUploadMode.indexOf('replace') > -1),
      optSyncUpRemove: (options.syncUploadMode.indexOf('remove') > -1),
      optSyncDownAdd: (options.syncDownloadMode.indexOf('add') > -1),
      optSyncDownReplace: (options.syncDownloadMode.indexOf('replace') > -1),
      optSyncDownRemove: (options.syncDownloadMode.indexOf('remove') > -1)
    };
  }

  getSyncOptions() {
    return this.getSyncOptionsFromOptions(this._options);
  }

}
