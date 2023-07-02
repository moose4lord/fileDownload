/*
  Copyright (c) 2023 Champlain Systems LLC
*/
import { Component, VERSION } from '@angular/core';

import { GlobalService } from './services/global.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    { title: 'Home',     url: '/home',  icon: 'home' },
    // { title: 'Settings', url: '/settings', icon: 'settings'},
    // { title: 'Timers', url: '/timers', icon: 'timer'}
  ];
  constructor(
    public globalService: GlobalService
  ) {
    // handle the hardware back button
    App.addListener('backButton', ({ canGoBack }) => {
      if(canGoBack){
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  }
}
