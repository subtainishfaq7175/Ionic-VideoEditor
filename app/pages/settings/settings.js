import {Page, NavController, Alert} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
    this.setupSettings();
  }

  onPageDidEnter() {
    if (!window.localStorage['shownInfoAboutWidthHeight']) {
      setTimeout(() => {
        this.showOptionInfo();
      }, 200);
      window.localStorage['shownInfoAboutWidthHeight'] = true;
    }
  }

  setupSettings() {
    let ls = window.localStorage;
    this.settings = {
      width: ls['width'] || 0,
      height: ls['height'] || 0,
      videoBitrate: ls['videoBitrate'] || 1000000,
      audioChannels: ls['audioChannels'] || 2,
      audioSampleRate: ls['audioSampleRate'] || 44100,
      audioBitrate: ls['audioBitrate'] || 128000,
      videoMaintainAspectRatio: ls['videoMaintainAspectRatio'] || true,
      optimizeForNetworkUse: ls['optimizeForNetworkUse'] || true,
      saveToLibrary: ls['saveToLibrary'] || true,
      thumbnailWidth: ls['thumbnailWidth'] || 0,
      thumbnailHeight: ls['thumbnailHeight'] || 0,
      thumbnailQuality: ls['thumbnailQuality'] || 100,
      thumbnailMaintainAspectRatio: ls['thumbnailMaintainAspectRatio'] || true
    };
  }

  onSettingChange() {
    for (let key in this.settings) {
      window.localStorage[key] = this.settings[key];
    }
  }

  showOptionInfo() {
    let alert = Alert.create({
      title: 'Width & Height Options',
      subTitle: 'When the width and height options are set to 0 your video will be transcoded with its original dimensions.',
      buttons: ['Gotcha']
    });
    this.nav.present(alert);
  }
}
