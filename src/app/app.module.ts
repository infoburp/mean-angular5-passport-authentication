import { ActionComponent } from "./action/action.component";
import { CauseComponent } from "./cause/cause.component";
import { EffectComponent } from "./effect/effect.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";

import { AppComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { SignupComponent } from "./signup/signup.component";
import { NewActionDialog } from "./action/action.component";
import { DeleteActionDialog } from "./action/action.component";
import { NewCauseDialog } from './cause/cause.component';
import { NewEffectDialog } from './effect/effect.component';

const appRoutes: Routes = [
  {
    path: 'actions',
    component: ActionComponent,
    data: { title: 'Action List' }
  },
  {
    path: 'causes',
    component: CauseComponent,
    data: { title: 'Cause List' }
  },
  {
    path: 'effects',
    component: EffectComponent,
    data: { title: 'Effect List' }
  },
  {
    path: 'effects/search/:query',
    component: EffectComponent,
    data: { title: 'Effect List' }
  },
  {
    path: 'effects/:id',
    component: EffectComponent,
    data: { title: 'Effect List' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Sign Up' }
  },
  {
    path: '',
    redirectTo: '/actions',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ActionComponent,
    CauseComponent,
    EffectComponent,
    LoginComponent,
    SignupComponent,
    NewActionDialog,
    DeleteActionDialog,
    NewCauseDialog,
    NewEffectDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  providers: [LogoutComponent],
  bootstrap: [AppComponent],
  entryComponents: [NewActionDialog, DeleteActionDialog, NewCauseDialog, NewEffectDialog]
})
export class AppModule {}
