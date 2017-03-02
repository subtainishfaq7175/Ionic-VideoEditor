## VideoEditor: An Ionic 2 App :camera: :video_camera: :scissors:

This is an Ionic 2 app that shows how to use the [cordova-plugin-video-editor](https://github.com/jbavari/cordova-plugin-video-editor) and [cordova-plugin-instagram-assets-picker](https://github.com/rossmartin/cordova-plugin-instagram-assets-picker) plugins. It allows transcoding a video with every possible setting the video editor plugin provides as well as trimming, creating thumbnails, and getting video info (width, height orientation, duration, size, & bitrate).

![GIF](example.gif)

Watch the video [here](https://youtu.be/U0O2gG4N0JM).


### How to try the app
1. Install the the latest beta version of the Ionic CLI:
    ```
    npm install -g ionic@beta
    ```

1. Clone this repository
    ```
    git clone https://github.com/rossmartin/video-editor-ionic2
    ```

1. Navigate to the app directory:
    ```
    cd video-editor-ionic2
    ```

1. Install the dependencies
    ```
    npm install
    ```

1. Add the necessary cordova plugins
```
ionic plugin add cordova-plugin-camera cordova-plugin-device cordova-plugin-media-capture https://github.com/driftyco/ionic-plugin-keyboard.git cordova-plugin-statusbar cordova-plugin-spinner-dialog cordova-plugin-instagram-assets-picker cordova-plugin-video-editor
```
The plugins in the package.json aren't being automatically installed when doing `ionic platform install ios`.  I think this is a bug with the Ionic beta CLI.  The `ionic state restore` is also not working :disappointed:

From here you can build and run the app on different platforms using the traditional Cordova/Ionic CLI commands (`cordova build ios`, etc.).  My mac has been having issues getting `ionic build` and `ionic emulate` to work but `cordova build` and `cordova emulate` work fine for me.  I'm not the only one experiencing this, see [here](https://github.com/driftyco/ionic-cli/issues/593) and [here](https://github.com/driftyco/ionic-cli/issues/586).

I have only tested this app on iOS but it should run fine on Android.  Transcoding videos on Android will be much slower because the video editor plugin uses ffmpeg on Android.  I have had terrible luck with HTML5 videos in the past on Android as well so YMMV there also.

I can't get everything in the app to work with the WkWebView.  Setting a time range on a video and the cover frame is still really smooth in iOS 9 on the UIWebView though.  One particular issue with the WkWebView is that you cannot set `allowsInlineMediaPlayback` to true and this is a problem for HTML5 video.

#### Cropping on the iOS Simulator does not work, it only works on devices.  I think this is an issue with GPUImage and will be looking into it.
