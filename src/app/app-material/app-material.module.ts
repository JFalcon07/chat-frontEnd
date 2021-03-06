import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatChipsModule,
  MatSnackBarModule,
  MatCardModule,
  MatSelectModule,
  MatGridListModule,
  MatListModule,
  MatTabsModule,
  MatMenuModule,
  MatRadioModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatExpansionModule,
} from '@angular/material';
import { AddModalComponent } from '../add-modal/add-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatGridListModule,
    MatListModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatToolbarModule,
    ScrollDispatchModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatExpansionModule,
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatGridListModule,
    MatListModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatToolbarModule,
    ScrollDispatchModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatExpansionModule,
  ],
  declarations: []
})
export class AppMaterialModule { }
