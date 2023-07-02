import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.champlainsystems.fileDownload',
  appName: 'File Download',
  webDir: 'www',
  server: {
    cleartext: true,
    hostname: "localhost"
  }
};

export default config;
