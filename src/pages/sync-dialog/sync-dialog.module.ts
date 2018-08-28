import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncDialogPage } from './sync-dialog';

@NgModule({
  declarations: [
    SyncDialogPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncDialogPage),
  ],
})
export class SyncDialogPageModule {}
