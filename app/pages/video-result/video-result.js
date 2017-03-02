import {Page, NavController, NavParams} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {VideoPage} from '../video/video';


@Page({
  templateUrl: 'build/pages/video-result/video-result.html'
})
export class VideoResultPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }

  constructor(nav, navParams) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.nav = nav;
    this.videoPath = navParams.get('videoPath');
    this.thumbnailPath = navParams.get('thumbnailPath');
  }

  onPageDidEnter() {
    VideoEditor.getVideoInfo(
      (info) => {
        console.log('getVideoInfo success, info: ', JSON.stringify(info, null, 2));
        this.zone.run(() => {
          this.videoInfo = info;
        });
      },
      (err) => {
        console.log('getVideoInfo error, err: ', err);
      },
      {
        fileUri: this.videoPath
      }
    );
  }

  newVideo() {
    this.nav.push(VideoPage);
  }

}
