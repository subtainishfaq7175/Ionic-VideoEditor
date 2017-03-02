import {Page, NavController} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {EditVideoPage} from '../edit-video/edit-video';


@Page({
  templateUrl: 'build/pages/video/video.html'
})
export class VideoPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.nav = nav;
  }

  onPageLoaded() {
    this.input = {
      cropVideo: window.localStorage['cropVideo'] || true
    };
  }

  recordVideo() {
    navigator.device.capture.captureVideo(
      (result) => {
        this.zone.run(() => {
          console.log('videoCaptureSuccess, result: ', JSON.stringify(result, null, 2));
          this.createThumbnail(result[0].fullPath);
        });
      },
      (err) => {
        console.log('videoCaptureFail, err: ', err);
      },
      {
          limit: 1,
          duration: 15
      }
    );
  }

  importVideo() {
    if (device.platform.toLowerCase() === 'ios') {
      InstagramAssetsPicker.getMedia(
        (result) => {
          console.log('InstagramAssetsPicker success, result: ', JSON.stringify(result, null, 2));
          (this.input.cropVideo) ? this.cropAsset(result) : this.createThumbnail(result.filePath);
        },
        (err) => {
          console.log('InstagramAssetsPicker error, err: ', err);
        },
        {
          type: 'video',
          cropAfterSelect: false,
          showGrid: false
        }
      );

      return;
    }

    let options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.VIDEO
    };

    navigator.camera.getPicture(
      (uri) => {
        this.zone.run(() => {
          console.log('importVideoSuccess, uri: ', uri);
          this.createThumbnail(uri);
        });
      },
      (err) => {
        console.log('importVideoFail, err: ', err);
      },
      options
    );
  }

  cropAsset(cropData) {
    window.plugins.spinnerDialog.show(null, 'Cropping Video...', true);
    setTimeout(() => {
      InstagramAssetsPicker.cropAsset(
        (result) => {
          console.log('InstagramAssetsPicker cropAsset success, result: ', result);
          this.createThumbnail(result.filePath);
        },
        (err) => {
          console.log('InstagramAssetsPicker cropAsset error, err: ', err);
          window.plugins.spinnerDialog.hide();
        },
        cropData // contains { filePath : uriObj, rect: rectObj }
      );
    });
  }

  createThumbnail(videoPath) {
    VideoEditor.createThumbnail(
      (result) => {
        window.plugins.spinnerDialog.hide();
        this.nav.push(EditVideoPage, {
          videoPath: videoPath,
          thumbnailPath: result
        });
      },
      (err) => {
        console.log('createThumbnail error, err: ', err);
        window.plugins.spinnerDialog.hide();
      },
      {
        fileUri: videoPath,
        outputFileName: new Date().getTime(),
        atTime: 0,
        quality: 100
      }
    );
  }

  onCropSettingChange() {
    window.localStorage['cropVideo'] = this.input.cropVideo;
  }

}
