import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DemoServiceService } from './_service/demoService.service';
import { HttpModule } from '@angular/http/';
import { NavComponent } from './nav/nav.component';
import { SpiderHistoryComponent } from './spiders/spider-history/spider-history.component';
import { SpiderRequestComponent } from './spiders/spider-request/spider-request.component';
import { SpiderResultComponent } from './spiders/spider-result/spider-result.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './route';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SpiderHistoryComponent,
    SpiderRequestComponent,
    SpiderResultComponent,
    HomeComponent
],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [DemoServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }