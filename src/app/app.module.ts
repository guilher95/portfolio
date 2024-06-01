import { NgModule, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as AOS from 'aos';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { FrontendComponent } from './features/home/frontend/frontend.component';
import { BackendComponent } from './features/home/backend/backend.component';
import { PresentationComponent } from './features/home/presentation/presentation.component';
import { SnakeGameComponent } from './features/home/snake-game/snake-game.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FrontendComponent,
    BackendComponent,
    PresentationComponent,
    SnakeGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements AfterViewInit {
  ngAfterViewInit() {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true
    });
  }
}
