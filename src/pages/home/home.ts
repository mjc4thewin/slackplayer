import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from './../../app/auth/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var responsiveVoice: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 public switcher:any;
 public currentMessage: string;
 public selectedVoice: string;
 public messages: any;
 public channels: any;
 public voices: any;
 API_URL = 'http://slackplayer.com/conversation/';
 SLACK_TOKEN = '{YOUR_SLACK_API_TOKEN}';

  constructor(public navCtrl: NavController, public auth: AuthService,  public http: Http, public authHttp: AuthHttp) {
    auth.handleAuthentication();
    this.switcher = 'player';
  }

  ngOnInit() {
    this.getChannels();
    this.getMessages();
    this.voices = responsiveVoice.getVoices();
    this.selectedVoice = 'UK English Female';
  }

  public playMessage(): void {
    responsiveVoice.speak(this.currentMessage, this.selectedVoice);
  }

  public setCurrentMessage(msg): void {
    if (msg.event.text && msg.user_info.user && msg.channel_info) {
      this.switcher = 'player';
      this.currentMessage = this.composeMessage(msg);
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

    console.log(userArray);

    //TODO: need to get the user.real_name from the Slack API for each of the users mentioned 
    //in the message and do a search and replace on the @mention with the userId

    return '';
  }

  public playLatest(): void {
    if (this.messages) {
      this.setCurrentMessage(this.messages[0]);
    }
  }

  public getMessages(): void {
    this.http.get(`${this.API_URL}`)
      .map(res => res.json())
      .subscribe(
        data => this.messages = data.reverse(),
        error => this.currentMessage = error
      );
    }

  public getChannels(): void {
    this.http.get(`https://slack.com/api/channels.list?token=${this.SLACK_TOKEN}&limit=100`)
    .map(res => res.json())
    .subscribe(
      data => this.channels = data.channels
    );
  }


}
