import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { environment } from '../../../environments/environment';

import { GlobalService } from '../../services/global.service';
import { LocalStorageService } from '../../services/local-storage.service';

import { FileDownload } from "capacitor-plugin-filedownload";
import { ImgFile } from 'src/app/models/globalData.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  public environment = environment;
  public appVersion: string = "1.0.0";
  public errorMsg: string = '';
  public imgFiles: ImgFile[] = []; // ESP32 image file names

  constructor(
    public platform: Platform,
    public localStorageService: LocalStorageService,
    public globalService: GlobalService
  ) { }

  customPopoverOptions = {
    side: 'bottom', // bottom, top, start, end, left or right
    cssClass: 'ion-select-popover-custom'
  };

  async ngOnInit() {
    const platforms: string[] = this.platform.platforms();
    console.log('platforms: ', platforms);
    if (platforms.includes('android')) { // App.getInfo() not implemented on web
      const appInfo = await App.getInfo();
      console.log('appInfo:', JSON.stringify(appInfo));
      this.appVersion = appInfo.version;
    }

    // test HTTP client
    // console.log('getStatus started');
    // this.globalService.getStatus().subscribe(data => {
    //   console.log('getStatus response: ' + JSON.stringify(data));
    // });
  }

  // async onSend(event: Event) {
  //   await this.localStorageService.storeGlobalData();

  //   this.globalService.uploadGlobalData().subscribe({
  //     next: (data) => console.log('uploadGlobalData response: ' + JSON.stringify(data)),
  //     error: (err) => {
  //       console.error('uploadGlobalData(): ' + err);
  //       this.globalService.presentToast(err);
  //     },
  //     complete: () => console.info('uploadGlobalData() complete')
  //   });
  // }

  async onGetFileList(event: Event) {
    await this.localStorageService.storeGlobalData();

    this.globalService.getImgFiles().subscribe({
      next: (data) => {
        console.log('onGetFileList response: ' + JSON.stringify(data))
        this.imgFiles = data;
      },
      error: (err) => {
        console.error('onGetFileList(): ' + err);
        this.globalService.presentToast(err);
      },
      complete: () => console.info('onGetFileList() complete')
    });
  }

  async onDownload(event: Event, name: string) {
    var urlStr:string = "http://192.168.1.141/" + name;
    console.log('running onDownload ' + urlStr);
    const eventListener = await FileDownload.addListener('downloadProgress', data =>{
      console.log(data.progress);
    })

    this.errorMsg = '';
    // FileDownload.checkPermissions().then((res) => {
    //   console.log('res', JSON.stringify(res));
    //   this.errorMsg += JSON.stringify(res);
    // }).catch(err => {
    //   console.error(err);
    //   this.errorMsg += err;
    // })

    // FileDownload.requestPermissions().then((res) => {
    //   console.log('res', JSON.stringify(res));
    //   this.errorMsg += JSON.stringify(res);
    // }).catch(err => {
    //   console.error(err);
    //   this.errorMsg += err;
    // })
  
    // FileDownload.checkPermissions().then((res) => {
    //   console.log('res', JSON.stringify(res));
    //   this.errorMsg += JSON.stringify(res);
    // }).catch(err => {
    //   console.error(err);
    //   this.errorMsg += err;
    // })

    FileDownload.download({
      url: urlStr,
      fileName: name,
      // destination == DOCUMENT - stores files here: file:///storage/emulated/0/Android/data/com.champlainsystems.fileDownload/files/ 
      // destination == DATA     - stores files here: file:///data/user/0/com.champlainsystems.fileDownload/files/ (inaccessible from Files app)
      // destination == CACHE    - stores files here: file:///data/user/0/com.champlainsystems.fileDownload/cache/ (inaccessible from Files app)
      // destination == LIBRARY  - stores files here: file:///storage/emulated/0/Download
      // destination == EXTERNAL_STORAGE - doesn't appear to work, permission issues - download fail: /storage/emulated/0/img00003.jpg: open failed: EPERM (Operation not permitted))
      destination: this.globalService.globalData.destination  // "DOCUMENT" | "EXTERNAL" | "EXTERNAL_STORAGE" | "DATA" | "CACHE" | "LIBRARY"
    }).then((res) => {
      console.log('res', JSON.stringify(res));
      this.errorMsg += JSON.stringify(res);
    }).catch(err => {
      console.error(err);
      this.errorMsg += err;
    }).finally(() => eventListener.remove());
  }

  async onDownloadAll(event: Event) {
    console.log('running onDownloadAll');
    this.imgFiles.forEach((imgFile, index) => {
      var urlStr:string = "http://192.168.1.141/" + imgFile.name;
      FileDownload.download({
        url: urlStr,
        fileName: imgFile.name,
        destination: "LIBRARY"  // "DOCUMENT" | "EXTERNAL" | "EXTERNAL_STORAGE" | "DATA" | "CACHE" | "LIBRARY"
      }).then((res) => {
        console.log('res', JSON.stringify(res));
      }).catch(err => {
        console.error(err);
      });
    });
  }
}
