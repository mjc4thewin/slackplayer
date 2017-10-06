![Slack Player](http://slackplayer.com/images/slackplayer_720.png?s=300)
# Slack Player

Listen to audible Slack conversations in realtime while you're on the go.

## Getting Started

1) Install the Ionic CLI globally (Requires at least Node 6 and NPM 3+) 
```
npm install -g ionic@latest
```

2) Fork this repo (use button at the top right)

3) Clone from **your** Github repo

> `git clone https://github.com/`**`YOUR_GITHUB_USERNAME`**`/slackplayer.git`

4) Navigate into the project directory
```
cd slackplayer
```

5) Run install
```
npm install
```

6) If you don't have one, create an Auth0 account and add your Auth0 clientID, domain, callbackURL and apiUrl to the "auth0-varibles.ts" file

7) Generate a Slack API token and paste it on line 22 of the "home.ts" file.

8) Serve the app
```
ionic serve
```


## Feature Ideas

Here are a few suggestions of where we could take this, but I'm open to ideas too.

1) Better message parsing to handle user @ mentions, bot messages, snippets/code blocks and shared links
2) ~~Channel toggle filters so you can selectively listen by channel~~
3) ~~Add ability to specify which voice playback option is used~~
4) Add the ability to dictate a response and have it post back to the channel


Have fun!
