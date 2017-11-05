import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule, NZ_LOCALE } from 'ng-zorro-antd';
import { NZ_LOCALE_VALUE } from '../assets/i18n/i18n';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './PageNotFoundComponent';
import { MenuComponent } from './pageComponents/menuComponent/menu.component';
import { MenuPlatformComponent } from './pageComponents/menuPlatformComponent/menuPlatform.component';
import { HttpService } from './services/baseServices/HttpService';
import { AppRequestService } from './services/baseServices/AppRequestService';
import { UtilService } from './services/baseServices/UtilService';
import { HttpCache } from './services/baseServices/HttpCache';
import { HttpLoopInterceptor } from './services/baseServices/HttpLoopInterceptor';
import { LookupPipe } from './pipes/lookupPipe';

const appRoutes: Routes = [
  {
    path: 'menu', component: MenuComponent,
    children: [
      { path: 'menu_platform', component: MenuPlatformComponent },
      { path: '', redirectTo: '/menu/menu_platform', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuPlatformComponent,
    PageNotFoundComponent,
    LookupPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NgZorroAntdModule.forRoot({ extraFontName: 'anticon', extraFontUrl: '../assets/iconfont/iconfont' })
  ],
  providers: [
    {
      provide: NZ_LOCALE,
      useValue: NZ_LOCALE_VALUE
    },
    HttpService,
    AppRequestService,
    UtilService,
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
