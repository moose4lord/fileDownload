/*
  Copyright (c) 2022 Champlain Systems LLC
*/
import { Injectable } from '@angular/core';

import { Preferences } from '@capacitor/preferences';

//import { SplashScreen } from '@capacitor/splash-screen';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private globalService: GlobalService
  ) { }

//   async init(): Promise<any> {
//     console.log('local-storage.service.init() started');
//     try {
//       await this.fetchGlobalData(); // fetch app globalData from local storage
//       console.log('local-storage.service.init() finished');
//     } catch (err) {
//       console.error('local-storage.service.init() failed', err);
//     }
// //  SplashScreen.hide();
//   }

  // fetch globalData from local storage
  async fetchGlobalData() {
    try {
      let data = await this.get('globalData');
      if (data) {
//      this.globalService.globalData = data;
        this.globalService.globalData = { ...this.globalService.globalData, ...data }; // merge
      } else {
//      this.globalService.globalData = new GlobalData;
      }
      console.log('fetchGlobalData(): ' + JSON.stringify(this.globalService.globalData));
    } catch (err) {
      console.error('fetchGlobalData() failed', err);
    }
  }

  // store the globalData to local storage
  async storeGlobalData() {
    try {
      // capacitor preferences (SharedPreferences)
      await this.set('globalData', this.globalService.globalData);
      this.globalService.log('local-storage.service.storeGlobalData: ' + JSON.stringify(this.globalService.globalData));
    } catch (err) {
      console.error('local-storage.service.storeGlobalData failed', err);
    }
  }

  // capacitor preferences helper functions
  async set(key: string, value: any): Promise<void> {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value),
    });
  }

  async get(key: string): Promise<any> {
    const { value } = await Preferences.get({ key: key });
    return JSON.parse(value!);
  }
}
