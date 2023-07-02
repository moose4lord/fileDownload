/*
  Copyright (c) 2022 Champlain Systems LLC
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { ToastController } from '@ionic/angular';

import { Observable, throwError, from } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GlobalData } from '../models/globalData.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public globalData: GlobalData = new GlobalData;

  constructor(
    private http: HttpClient,
    public toastController: ToastController
  ) { }

  getStatus(): Observable<any> {
    return this.http.get<any>('http://' + this.globalData.ipAddr + '/status')
    .pipe(
      catchError(this.handleHttpError)
    )
  }

  getImgFiles(): Observable<any> {
    return this.http.get<any>('http://' + this.globalData.ipAddr + '/list')
    .pipe(
      catchError(this.handleHttpError)
    )
  }

  uploadGlobalData(): Observable<any> {
    return this.http.post<any>('http://' + this.globalData.ipAddr + '/upload', this.globalData)
    .pipe(
      catchError(this.handleHttpError)
    );
  }

  // http error handler
  private handleHttpError(error: HttpErrorResponse): Observable<void> {
    console.error('An error occurred:', JSON.stringify(error));

    // Return an observable with a user-facing error message.
    return throwError(() => new Error('A network error occurred. Please try again later.'));
  }

  // capacitorHttp (Capacitor native HTTP) helper function
  // doGet(url: string): Observable<any> {
  //   return from(CapacitorHttp.get( { url } ));
  // }

  // capacitorHttp (Capacitor native HTTP) helper function
  // doPost(url: string, postData: any): Observable<any> {
  //   const options: HttpOptions = {
  //     url,
  //     headers: { 'content-type': 'application/json' },
  //     data: postData,
  //   };

  //   return from(CapacitorHttp.post(options));
  // }

  async presentToast(msg: string = 'got here') {
    const toast = await this.toastController.create({
      message: "" + msg,
      duration: 3000
    });
    toast.present();
  }

  // log helper
  log(...args: any[]) {
    if (!environment.production) {
      for (var i = 0; i < args.length; i++) {
        console.log(args[i]);
      }
    }
  }
}
