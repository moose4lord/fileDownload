import { Destination } from "capacitor-plugin-filedownload";

/*
  Copyright (c) 2023 Champlain Systems LLC
*/
export class GlobalData {
  constructor() { }

  public ipAddr: string = '';              // ESP32 IP address or MDNS hostname
  public destination: Destination = 'LIBRARY';  // file download destination folder
}

export class ImgFile {
  constructor() { }

  public name: string = '';
  public size: number = 0;
  public date: string = '';
}
