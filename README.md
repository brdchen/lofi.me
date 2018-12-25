# Lofi.me
#### Copyright Bradford Chen 2018

![avatar](avatar.jpg)

# About
Lofi.me is a Discord bot meant for lofi lovers to play and discover lofi. It
will play an endless amount of calming and relaxing lofi for you to study to.

### Read >> [Why lofi?](https://justmusicallyspeaking.com/en/what-makes-lo-fi-hip-hop-a-hidden-musical-treasure/)

# Setup

In order to setup lofi.me to run correctly, you first need to install node.js.
After, install the following packages with the following lines in Command Prompt / Terminal:

#### Discord API Wrapper
```
npm install discord.js
```
#### Logging
```
npm install winston
```
#### Streaming
```
npm install ffmpeg-binaries
npm install node-opus
```
#### YouTube Data and Streaming
```
npm install ytdl-core
npm install youtube-api-v3-search
```

Next, you are going to want to setup a Discord bot by going to https://discordapp.com/developers/applications and set up a new application and a bot. There are plenty of guides out there on how to get started. I recommend starting with [this one](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/).

Once your bot is setup, you want to go into the auth.json file and copy your Discord Client ID to the `token` field.

In order to query YouTube, you're also going to need a Google Cloud API Key. You can get one by setting up a new project in the Google Cloud at https://console.cloud.google.com. Once you have your project just create a new credential and you'll have an API Key ready to use. Just copy that over to the `ytkey` field in auth.json and your bot will now be ready to stream music!

**Note**: Never expose your Google API Key or your Discord client ID for security purposes.

# Usage

You can call lofi.me by starting commands with an exclamation mark: '!ping'

| Calls  |   Function  |
| ------ |---------|
|`!ping`   | Pong!  |
|`!greet`   | Greets the user  |
|`!rolldice`   | Rolls a fair 6 sided die  |
|`!stream`   | Joins your current voice channel and streams lofi music |

___
# Plans

- [ ] Add song of the day feature with Youtube link
- [x] Add support for listening to endless lofi in channel
    - [x] No direct integration with spotify, but can listen to YouTube
    - [x] Integrate with YouTube API or grab mp3 from YouTube and play it
    - [ ] Add Volume and Play/Pause Control
    - [ ] SoundCloud integration...?
- [ ] Add additional fun features
    - [ ] Recommend a random lofi song
    - [ ] Link personal lofi playlist?
    - [ ] Allow users to create their own music playlists
