import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { init } from "bfast";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule, Routes } from "@angular/router";
import { MatNativeDateModule } from "@angular/material/core";
import { WelcomePage } from "./pages/welcome.page";
import { LoginPageComponent } from "./pages/login.page";
import { AuthGuard } from "./guards/auth.guard";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { IpfsService } from "smartstock-core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatMenuModule } from "@angular/material/menu";

const routes: Routes = [
  { path: "", canActivate: [AuthGuard], component: WelcomePage },
  {
    path: "expense",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("../../../expense/src/public-api").then((mod) => mod.ExpenseModule)
  },
  { path: "login", component: LoginPageComponent }
];

@NgModule({
  declarations: [AppComponent, WelcomePage, LoginPageComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" }),
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    HttpClientModule,
    MatSnackBarModule,
    RouterModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    IpfsService.getVersion().then((value) => {
      console.log("ipfs version is : ", value.version);
    });
    init({
      applicationId: "smartstock_lb",
      projectId: "smartstock"
    });
  }
}
