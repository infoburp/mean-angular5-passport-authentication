import { ActionComponent } from "./action/action.component";
import { CauseComponent } from "./cause/cause.component";
import { EffectComponent } from "./effect/effect.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";

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

import { UserService } from "./_services/user.service";
import { ActionService } from "./_services/action.service";
import { CauseService } from "./_services/cause.service";
import { EffectService } from "./_services/effect.service";

import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { SignupComponent } from "./signup/signup.component";
import { NewActionDialog } from "./action/new-action.dialog";
import { DeleteActionDialog } from "./action/delete-action.dialog";
import { NewCauseDialog } from './cause/new-cause.dialog';
import { DeleteCauseDialog } from './cause/delete-cause.dialog';
import { NewEffectDialog } from './effect/new-effect.dialog';
import { DeleteEffectDialog } from './effect/delete-effect.dialog';

const appRoutes: Routes = [
  {
    path: 'actions',
    component: ActionComponent,
    data: { title: 'Action List' }
  },
  {
    path: 'actions/search/:query',
    component: ActionComponent,
    data: { title: 'Effect List' }
  },
  {
    path: 'actions/:id',
    component: ActionComponent,
    data: { title: 'Effect List' }
  },
  {
    path: 'causes',
    component: CauseComponent,
    data: { title: 'Cause List' }
  },
  {
    path: 'causes/search/:query',
    component: CauseComponent,
    data: { title: 'Effect List' }
  },
  {
    path: 'causes/:id',
    component: CauseComponent,
    data: { title: 'Effect List' }
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
    DeleteCauseDialog,
    NewEffectDialog,
    DeleteEffectDialog
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
  providers: [LogoutComponent, UserService, ActionService, CauseService, EffectService],
  bootstrap: [AppComponent],
  entryComponents: [NewActionDialog, DeleteActionDialog, NewCauseDialog, DeleteCauseDialog, NewEffectDialog, DeleteEffectDialog]
})
export class AppModule {}
