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
import { PageNotFoundComponent } from './PageNotFoundComponent';
import { MenuComponent } from './pageComponents/menuComponent/menu.component';
import { MenuPlatformComponent } from './pageComponents/menuPlatformComponent/menuPlatform.component';
import { EnterMerchantComponent } from './pageComponents/enterMerchantManagement/enterMerchant.component';
import { AddMerchantComponent } from './pageComponents/enterMerchantManagement/enterMerchantManagementDialog/addMerchant.component';
import { EnterMerchantInfoComponent } from './pageComponents/enterMerchantManagement/enterMerchantInfo/enterMerchantInfo.component';
import { MerchantApprovementComponent } from './pageComponents/merchantApprovementComponent/merchantApprovement.component';
import { ActivitiesApprovementListComponent } from './pageComponents/activitiesApprovementComponent/activitiesApproveListComponent/activitiesApprovementList.component';
import { ActvityDetailComponent } from './pageComponents/activitiesApprovementComponent/activityDetailComponent/activityDetail.component';
import { UploadFileComponent } from './components/uploadFileComponent/uploadFile.component';
import { UploadImageComponent } from './components/uploadImageComponent/uploadImage.component';
import { HttpService } from './services/baseServices/http.service';
import { AppRequestService } from './services/baseServices/AppRequest.service';
import { UtilService } from './services/baseServices/util.service';
import { DataModelService } from './pipes/model';
import { ComponentCommunicateService } from './services/baseServices/componentCommunicate.service';
import { HttpCache } from './services/baseServices/httpCache';
import { HttpLoopInterceptor } from './services/baseServices/HttpLoopInterceptor';
import { LookupPipe } from './pipes/lookup.pipe';

const appRoutes: Routes = [
  {
    path: 'menu', component: MenuComponent,
    children: [
      { path: 'enter_merchant', component: EnterMerchantComponent },
      { path: 'enter_merchant/enter_merchant_info/:id', component: EnterMerchantInfoComponent },
      { path: 'merchant_approvement', component: MerchantApprovementComponent },
      { path: 'activity_approvement', component: ActivitiesApprovementListComponent},
      { path: 'activity_approvement/activity_detail/:id', component: ActvityDetailComponent },
      // { path: 'menu_platform', component: MenuPlatformComponent },
      { path: '', redirectTo: '/menu/enter_merchant', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/menu/enter_merchant', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  entryComponents: [
    AddMerchantComponent
  ],
  declarations: [
    AppComponent,
    DatatableComponent,
    MenuComponent,
    MenuPlatformComponent,
    EnterMerchantComponent,
    PageNotFoundComponent,
    AddMerchantComponent,
    EnterMerchantInfoComponent,
    MerchantApprovementComponent,
    ActivitiesApprovementListComponent,
    ActvityDetailComponent,
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
    NgZorroAntdModule.forRoot({ extraFontName: 'anticon', extraFontUrl: '../assets/iconfont/iconfont' }),
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoopInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
