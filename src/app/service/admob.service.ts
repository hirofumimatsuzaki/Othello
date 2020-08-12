import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AdOptions, AdSize, AdPosition } from '@rdlabo/capacitor-admob';
import { Plugins } from '@capacitor/core';

const { AdMob } = Plugins;
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdmobService {
  iosOptions: AdOptions = {
    // iOSの広告ユニットID
    adId: 'ca-app-pub-3945585447168615/3351002824',
    adSize: AdSize.BANNER,
    position: AdPosition.BOTTOM_CENTER
  };

  // androidの広告ユニットID
  androidOptions: AdOptions = {
    adId: 'ca-app-pub-3945585447168615/3351002824',
    adSize: AdSize.BANNER,
    position: AdPosition.BOTTOM_CENTER
  };

  constructor(private platform: Platform) {}

  showBanner() {
    if (this.platform.is('ios')) {
      AdMob.showBanner(this.iosOptions).then(
        value => {
          console.log('広告の表示成功！！ ' + value);
        },
        error => {
          console.log('表示失敗 ' + error);
        }
      );
    } else if (this.platform.is('android')) {
      AdMob.showBanner(this.androidOptions).then(
        value => {
          console.log('広告の表示成功！！ ' + value);
        },
        error => {
          console.log('表示失敗 ' + error);
        }
      );
    }

    AdMob.addListener('onAdLoaded', (info: boolean) => {
      console.log(info + 'Banner Ad Loaded');
    });
  }
}