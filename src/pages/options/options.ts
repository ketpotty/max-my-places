import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

import { ThemeProvider } from '../../providers/theme.provider';
import { OptionsService } from '../../services/options.service';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  optGenDarkTheme: boolean;
  optSyncUpAdd: boolean;
  optSyncUpReplace: boolean;
  optSyncUpRemove: boolean;
  optSyncDownAdd: boolean;
  optSyncDownReplace: boolean;
  optSyncDownRemove: boolean;

  constructor(private viewCtrl: ViewController, private optionsService: OptionsService, private themeProvider: ThemeProvider) {
    this.optionsService.getOptions()
      .then((options) => {
        this.loadOptions(options);
      });
  }

  loadOptions(options: any) {
    this.optGenDarkTheme = options.themeName == 'dark-theme';
    var syncOptions = this.optionsService.getSyncOptionsFromOptions(options);
    this.optSyncUpAdd = syncOptions.optSyncUpAdd;
    this.optSyncUpReplace = syncOptions.optSyncUpReplace;
    this.optSyncUpRemove = syncOptions.optSyncUpRemove;
    this.optSyncDownAdd = syncOptions.optSyncDownAdd;
    this.optSyncDownReplace = syncOptions.optSyncDownReplace;
    this.optSyncDownRemove = syncOptions.optSyncDownRemove;
  }

  onSetTheme(themeName: string) {
    this.themeProvider.setActiveTheme(themeName)
  }

  onSave() {
    var themeName = this.optGenDarkTheme ? 'dark-theme' : 'light-theme';
    this.onSetTheme(themeName);
    this.optionsService.setThemeName(themeName);
    this.optionsService.setSyncUploadMode((this.optSyncUpAdd ? 'add' : '') + (this.optSyncUpReplace ? '-replace' : '') + (this.optSyncUpRemove ? '-remove' : ''));
    this.optionsService.setSyncDownloadMode((this.optSyncDownAdd ? 'add' : '') + (this.optSyncDownReplace ? '-replace' : '') + (this.optSyncDownRemove ? '-remove' : ''));
    this.optionsService.saveOptions()
      .then(
        (options) => {
          console.log("saveOptions succeeded!", options);
          this.viewCtrl.dismiss();
        }
      )
      .catch(
        (error) => {
          console.log("saveOptions failed!", error);
        }
      );
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }

}
