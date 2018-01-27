import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule, NZ_LOCALE } from 'ng-zorro-antd';
import { DatatableComponent } from './components/datatableComponent/datatable.component';
import { ImageUploadModule } from 'angular2-image-upload';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { NZ_LOCALE_VALUE } from '../assets/i18n/i18n';
import { AppComponent } from './app.component';
import { HomeComponent } from './pageComponents/homeComponent/home.component';
import { LoginComponent } from './pageComponents/loginComponent/login.component';
import { EditPasswordComponent } from './pageComponents/homeComponent/editPasswordComponent/editPassword.component';
import { PageNotFoundComponent } from './PageNotFoundComponent';
import { MenuComponent } from './pageComponents/menuComponent/menu.component';
import { EnterMerchantComponent } from './pageComponents/enterMerchantManagement/enterMerchant.component';
import { AddMerchantComponent } from './pageComponents/enterMerchantManagement/enterMerchantManagementDialog/addMerchant.component';
import { EnterMerchantInfoComponent } from './pageComponents/enterMerchantManagement/enterMerchantInfo/enterMerchantInfo.component';
import { EnterMerchantAccountInfoComponent } from './pageComponents/enterMerchantManagement/enterMerchantInfo/enterMerchantAccountInfo/enterMerchantAccount.component';
import { MerchantApprovementComponent } from './pageComponents/merchantApprovementComponent/merchantApprovement.component';
import { ShopApprovementComponent } from './pageComponents/shopApprovementComponent/shopApprovement.component';
import { ActivitiesApprovementListComponent } from './pageComponents/activitiesApprovementComponent/activitiesApproveListComponent/activitiesApprovementList.component';
import { ActvityDetailComponent } from './pageComponents/activitiesApprovementComponent/activityDetailComponent/activityDetail.component';
import { AccountApprovementComponent } from './pageComponents/accountApprovementComponent/accountApprovement.component';
import { StatementAccountsComponent } from './pageComponents/statementAccountComponent/statementAccounts.component';
import { SettleAccountsComponent } from './pageComponents/settleAccountsComponent/settleAccounts.component';
import { SettleAccountDetailComponent } from './pageComponents/settleAccountsComponent/settleAccountDetailComponent/settleAccountDetail.component';
import { ManualPaymentComponent } from './pageComponents/manualPaymentComponent/manualPayment.component';
import { AuthorityManagementComponent } from './pageComponents/authorityManagementComponent/authorityManagement.component';
import { ApproveDialogComponent } from './pageComponents/dialogComponent/approveDialog.component';
import { PaymentDialogComponent } from './pageComponents/statementAccountComponent/paymentDialog/paymentDialog.component';
import { PlatformUserComponent } from './pageComponents/platformUserComponent/platformUser.component';
import { PlatformUserDialogComponent } from './pageComponents/platformUserComponent/platformUserDialog/platformUserDialog.component';
import { EditUserPasswordComponent } from './pageComponents/platformUserComponent/editUserPasswordDialog/editUserPasswordDialog.component';
import { CredentialDialogComponent } from './pageComponents/accountApprovementComponent/credentialDialog.component';
import { UploadFileComponent } from './components/uploadFileComponent/uploadFile.component';
import { UploadImageComponent } from './components/uploadImageComponent/uploadImage.component';
import { HttpService } from './services/baseServices/http.service';
import { AppRequestService } from './services/baseServices/appRequest.service';
import { UtilService } from './services/baseServices/util.service';
import { DataModelService } from './pipes/model';
import { ComponentCommunicateService } from './services/baseServices/componentCommunicate.service';
import { HttpCache } from './services/baseServices/httpCache';
import { HttpLoopInterceptor } from './services/baseServices/HttpLoopInterceptor';
import { LoginUserService } from './services/loginUser.service';
import { EnterMerchantService } from './services/enterMerchant.service';
import { MerchantApprovementService } from './services/merchantApprovement.service';
import { ActivityApprovementService } from './services/activityApprovement.service';
import { AccountApprovementService } from './services/accountApprovement.service';
import { StatemenetAccountService } from './services/statementAccount.service';
import { SettleAccountsService } from './services/settleAccounts.service';
import { ManualPaymentService } from './services/manualPayment.service';
import { AuthorityManagementService } from './services/authorityManagement.service';
import { PlatformUserService } from './services/platformUser.service';
import { ShopApprovementService } from './services/shopApprovement.service';
import { LookupPipe } from './pipes/lookup.pipe';

const appRoutes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'menu', component: MenuComponent,
        children: [
          { path: 'enter_merchant', component: EnterMerchantComponent },
          { path: 'enter_merchant/enter_merchant_info/:id', component: EnterMerchantInfoComponent },
          { path: 'enter_merchant/enter_merchant_info/:id/enter_merchant_account', component: EnterMerchantAccountInfoComponent },
          { path: 'merchant_approvement', component: MerchantApprovementComponent },
          { path: 'shop_approvement', component: ShopApprovementComponent },
          { path: 'account_approvement', component: AccountApprovementComponent },
          { path: 'activity_approvement', component: ActivitiesApprovementListComponent },
          { path: 'activity_approvement/activity_detail/:id', component: ActvityDetailComponent },
          { path: 'statement_accounts', component: StatementAccountsComponent },
          { path: 'settle_accounts', component: SettleAccountsComponent },
          { path: 'settle_accounts/settle_account_detail/:id', component: SettleAccountDetailComponent },
          { path: 'manual_payment', component: ManualPaymentComponent },
          { path: 'authority_management', component: AuthorityManagementComponent },
          { path: 'platform_user', component: PlatformUserComponent },
          { path: '', redirectTo: '/menu/enter_merchant', pathMatch: 'full' }
        ],
      },
      { path: '', redirectTo: '/menu/enter_merchant', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/menu/enter_merchant', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  entryComponents: [
    AddMerchantComponent,
    EditPasswordComponent,
    CredentialDialogComponent,
    ApproveDialogComponent,
    PaymentDialogComponent,
    PlatformUserDialogComponent,
    EditUserPasswordComponent
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DatatableComponent,
    MenuComponent,
    EnterMerchantComponent,
    PageNotFoundComponent,
    AddMerchantComponent,
    EditPasswordComponent,
    EnterMerchantInfoComponent,
    EnterMerchantAccountInfoComponent,
    MerchantApprovementComponent,
    ShopApprovementComponent,
    ActivitiesApprovementListComponent,
    ActvityDetailComponent,
    ApproveDialogComponent,
    PaymentDialogComponent,
    AccountApprovementComponent,
    StatementAccountsComponent,
    SettleAccountsComponent,
    SettleAccountDetailComponent,
    ManualPaymentComponent,
    AuthorityManagementComponent,
    PlatformUserComponent,
    PlatformUserDialogComponent,
    EditUserPasswordComponent,
    CredentialDialogComponent,
    UploadImageComponent,
    UploadFileComponent,
    LookupPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FileUploadModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NgZorroAntdModule.forRoot({ extraFontName: 'anticon', extraFontUrl: 'assets/iconfont/iconfont' }),
    ImageUploadModule.forRoot()
  ],
  providers: [
    {
      provide: NZ_LOCALE,
      useValue: NZ_LOCALE_VALUE
    },
    HttpService,
    AppRequestService,
    UtilService,
    DataModelService,
    ComponentCommunicateService,
    HttpCache,
    LoginUserService,
    EnterMerchantService,
    MerchantApprovementService,
    ActivityApprovementService,
    AccountApprovementService,
    StatemenetAccountService,
    SettleAccountsService,
    ManualPaymentService,
    AuthorityManagementService,
    PlatformUserService,
    ShopApprovementService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoopInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
