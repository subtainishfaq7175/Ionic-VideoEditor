import {Page, NavController, NavParams} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {VideoResultPage} from '../video-result/video-result';


@Page({
  templateUrl: 'build/pages/edit-video/edit-video.html'
})
export class EditVideoPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }

  constructor(nav, navParams) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.nav = nav;
    this.videoPath = navParams.get('videoPath');
    this.thumbnailPath = navParams.get('thumbnailPath');
  }

  onPageWillEnter() {
    this.editAction = this.lastEditAction || 'trim';
  }

  onPageDidEnter() {
    setTimeout(() => {
      let video = this.video = document.querySelector('#edit-video-element');
      video.play();
      video.pause();
      video.currentTime = this.lastTrimTime || 0;

      // declare shared trim logic vars here
      // this is done to safely reference them in setupCoverFrameLogic
      // this ensures the cover frame can only be set within the trimmed range
      this.videoTrimStart = 0;
      this.videoTrimEnd = video.duration;
      this.videoDuration = (this.videoTrimEnd - this.videoTrimStart).toFixed(2);

      this.setupTrimLogic();
      this.setupCoverFrameLogic();
    }, 500);
  }

  setupTrimLogic() {
    let video = this.video;
    let trimSlider = this.trimSlider = document.querySelector('#trim-slider');
    let numTrimSliderUpdates = 0;

    if (typeof trimSlider.noUiSlider !== 'undefined') {
      console.log('trimSlider already instantiated');
      // no need to recreate the slider it is already in the DOM
      // this can happen if coming back here from settings
      return;
    }

    noUiSlider.create(trimSlider, {
      start: [0, video.duration],
      limit: video.duration,
      tooltips: [true, true],
      connect: true,
      range: {
        min: 0,
        max: video.duration
      }
    });

    trimSlider.noUiSlider.on('update', (values, handle) => {
       // update is called twice before anything actually happens, this fixes it
      if (numTrimSliderUpdates < 3) {
          numTrimSliderUpdates++;
          return;
      }

      let value = Number(values[handle]);

      (handle) ? this.videoTrimEnd = value : this.videoTrimStart = value;

      this.videoDuration = (this.videoTrimEnd - this.videoTrimStart).toFixed(2);

      video.currentTime = this.lastTrimTime = value;
    });
  }

  setupCoverFrameLogic() {
    let video = this.video;
    let coverFrameSlider = this.coverFrameSlider = document.querySelector('#cover-frame-slider');

    if (typeof coverFrameSlider.noUiSlider !== 'undefined') {
      console.log('coverFrameSlider already instantiated');
      // no need to recreate the slider it is already in the DOM
      // this can happen if coming back here from settings
      return;
    }

    this.coverFrameTime = this.videoTrimStart;

    noUiSlider.create(coverFrameSlider, {
      start: this.videoTrimStart,
    	connect: 'lower',
      tooltips: true,
    	range: {
    	  min: this.videoTrimStart,
    	  max: this.videoTrimEnd
    	}
    });

    coverFrameSlider.noUiSlider.on('update', (values, handle) => {
      let value = Number(values[handle]);
      video.currentTime = this.coverFrameTime = value;
    });
  }

  onTrimButtonClick(e) {
    this.editAction = this.lastEditAction = 'trim';
    this.video.currentTime = this.lastTrimTime || 0;
  }

  onCoverFrameButtonClick(e) {
    this.editAction = this.lastEditAction = 'cover';

    if (this.coverFrameTime < this.videoTrimStart) {
      this.coverFrameTime = this.videoTrimStart;
    }

    if (this.coverFrameTime > this.videoTrimEnd) {
      this.coverFrameTime = this.videoTrimEnd;
    }

    this.video.currentTime = this.coverFrameTime || 0;

    this.coverFrameSlider.noUiSlider.updateOptions({
  		range: {
  			min: this.videoTrimStart,
  			max: this.videoTrimEnd
  		}
  	});
  }

  onVideoClick(e) {
    (this.video.paused) ? this.video.play() : this.video.pause();
  }

  performEdit() {
    window.plugins.spinnerDialog.show(null, null, true);

    let ls = window.localStorage;
    let options = {
      fileUri: this.videoPath,
      outputFileName: new Date().getTime(),
      atTime: this.coverFrameTime,
      thumbnailQuality: ls['thumbnailQuality'] || 100,
      thumbnailMaintainAspectRatio: ls['thumbnailMaintainAspectRatio'] || true
    };
    let widthOption = ls['thumbnailWidth'];
    let heightOption = ls['thumbnailHeight'];

    if (widthOption && widthOption !== 0) {
      options.width = widthOption;
    }

    if (heightOption && heightOption !== 0) {
      options.height = heightOption;
    }

    // not sure how to use promises/observables yet in angular 2
    // create the thumbnail, trim the video, then transcode it

    VideoEditor.createThumbnail(
      (result) => {
        console.log('createThumbnail success, result: ', result);
        this.newThumbnailPath = result;
        this.trimVideo();
      },
      (err) => {
        console.log('createThumbnail error, err: ', err);
      },
      options
    );

  }

  trimVideo() {
    VideoEditor.trim(
      (result) => {
        console.log('trim success, result: ', result);
        this.transcodeVideo(result);
      },
      (err) => {
        console.log('trim error, err: ', err);
      },
      {
        fileUri: this.videoPath,
        outputFileName: new Date().getTime(),
        trimStart: this.videoTrimStart,
        trimEnd: this.videoTrimEnd
      }
    );
  }

  transcodeVideo(trimmedVideoPath) {
    let ls = window.localStorage;
    let widthOption = ls['width'];
    let heightOption = ls['height'];
    let options = {
      fileUri: trimmedVideoPath,
      outputFileName: new Date().getTime(),
      outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
      videoBitrate: ls['videoBitrate'] || 1000000, // 1 megabit
      audioChannels: ls['audioChannels'] || 2,
      audioSampleRate: ls['audioSampleRate'] || 44100,
      audioBitrate: ls['audioBitrate'] || 128000,
      maintainAspectRatio: ls['maintainAspectRatio'] || true,
      optimizeForNetworkUse: ls['optimizeForNetworkUse'] || true,
      saveToLibrary: ls['saveToLibrary'] || true
    };

    if (widthOption && widthOption !== 0) {
      options.width = widthOption;
    }

    if (heightOption && heightOption !== 0) {
      options.height = heightOption;
    }

    VideoEditor.transcodeVideo(
      (result) => {
        console.log('transcodeVideo success, result: ', result);
        window.plugins.spinnerDialog.hide();
        this.nav.push(VideoResultPage, {
            videoPath: result,
            thumbnailPath: this.newThumbnailPath
        });
      },
      (err) => {
        console.log('transcodeVideo error, err: ', err);
      },
      options
    );
  }

}
