import {Page} from 'ionic-angular';
import {VideoPage} from '../video/video';
import {SettingsPage} from '../settings/settings';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.video = VideoPage;
    this.settings = SettingsPage;
  }
}
