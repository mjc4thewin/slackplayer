import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from './../../app/auth/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

declare var responsiveVoice: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 public switcher: string = 'player';
 public currentMessage: any;
 public currentMessageFormatted: string;
 public selectedVoice: string = 'UK English Female';
 public messages: any;
 public channels: any;
 public enabledChannels: any[] = [];
 public voices: any;
 API_URL = 'http://slackplayer.com/conversation/';
 SLACK_TOKEN = '{{YOUR_SLACK_API_KEY}}';

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public auth: AuthService,  public http: Http, public authHttp: AuthHttp) {
    auth.handleAuthentication();
    //turn off polling and find a better solution
    //setInterval(() => { this.getLatestMessage(); }, 1500);
  }

  ionViewDidLoad() {
    this.getChannels();
    this.getMessages();
    this.voices = responsiveVoice.getVoices();
    
  }

  public playMessage(): void {
    let msg = this.composeMessage(this.currentMessage)
    this.currentMessageFormatted = msg;
    responsiveVoice.speak(msg, this.selectedVoice);
  }

  public presentAlert(title, subtitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  public setCurrentMessage(msg): void {
    if (!this.channelEnabled(msg.channel_info.channel.name)) {
      this.presentAlert("Whoops!", "Either the #" + msg.channel_info.channel.name + " channel is disabled or we couldn't find anything to play =(");
    } else if (msg.event.text && msg.user_info.user && msg.channel_info) {
      this.switcher = 'player';
      this.currentMessage = msg;
      this.playMessage(); 
    }
  }

  public composeMessage(msg) {
    let user = msg.user_info.user.real_name;
    let channel = msg.channel_info.channel.name;
    
    //TODO:  Need to add message parsing
    //let messageText = this.parseMessageText(msg.event.text);
    
    let messageText = msg.event.text;
    return user + " wrote in the " + channel + " channel: " + messageText;
  }

  public channelEnabled(channelName) {
    //TODO:  Need to have this look for a unique ID rather than channel name
    return this.enabledChannels.findIndex(x => x == channelName) > -1;
  }

  public parseMessageText(msgText) {
    var msgArray = msgText.split("");
    var userArray = [];
    var userStartIndex;
    var userEndIndex;

    for (let i = 0; i <= msgArray.length; i++) {
      if (msgArray[i] === "<" && msgArray[i+1] === "@") {
        userStartIndex = i + 2;
      }
      if (msgArray[i] === ">") {
        userEndIndex = i - 1;
        var userId = msgArray.slice(userStartIndex, userEndIndex).join("");
        userArray.push(userId);
      }
    } 

    if (userArray.length > 0) {
      let realUserName = this.getUser(userArray[0]);
      console.log(realUserName);
    }

    //TODO: need to get the user.real_name from the Slack API for each of the users mentioned 
    //in the message and do a search and replace on the @mention with the userId

    return msgText;
  }

  public getLatestMessage(): void {
    if (this.messages) {
      if (!this.currentMessage) {
        this.setCurrentMessage(this.messages[0]);
      }
      if ((this.channelEnabled(this.messages[0].channel_info.channel.name)) && (this.messages[0].event_id != this.currentMessage.event_id)) {
        this.setCurrentMessage(this.messages[0]);
      }
    }
    this.getMessages();
  }

  public getMessages(): void {
    this.http.get(`${this.API_URL}`)
    .map(res => res.json())
    .subscribe(
      data => this.messages = data.reverse(),
      error => this.currentMessage = error
    );
  }


  public toggleChannel(channelName, channelChecked): void {
    if (channelChecked) {
      this.enabledChannels.push(channelName);
    } else {
      let channelIndex = this.enabledChannels.indexOf(channelName);
      this.enabledChannels.splice(channelIndex);
    }
  }


  public getUser(userId) {
    return this.http.get(`https://slack.com/api/users.info?token=${this.SLACK_TOKEN}&user=${userId}`)
      .map(res => res.json())
      .subscribe(
        data => data.user.real_name
      );
  }


  public getChannels(): void {
    this.http.get(`https://slack.com/api/channels.list?token=${this.SLACK_TOKEN}&limit=100`)
    .map(res => res.json())
    .subscribe(
      data => {
        this.channels = data.channels
        this.channels.forEach(element => {
          element.checked = true;
          this.toggleChannel(element.name, element.checked);
        });
      }
    );
  }


}
