const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const pkg = require('./package.json');
const yt = require('ytdl-core');
const searchYoutube = require('youtube-api-v3-search');
const SpotifyWebApi = require('spotify-web-api-node');

// inputs for querying YouTube
const ytUrlBase = 'https://www.youtube.com/watch?v=';
const ytoptions = {
    q:'lofi live',
    part:'snippet',
    type:'video'
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client();

// initialize Spotify API wrapper with Client Credentials Flow
const spotifyApi = new SpotifyWebApi({
  clientId: auth.clientId,
  clientSecret: auth.clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

bot.login(auth.token);

bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(pkg.name + ' - (' + pkg.author + ')');
    bot.user.setActivity('Jamming out');
});

bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                message.reply('Pong!');
            break;

            // !greet greets the user
            case 'greet':
                message.reply('Hello, ' + message.member.nickname + '.');
            break;

            // !rolldice will roll a random 6-sided die and output a message with the result
            case 'rolldice':
                var rand = Math.floor(Math.random() * 6) + 1;
                if (rand == 1) {
                    message.reply('Awwww you rolled a 1. Better luck next time!');
                }
                if (rand == 2) {
                    message.reply('You rolled a 2. Could have been better I guess!');
                }
                if (rand == 3) {
                    message.reply('You rolled a 3. Not bad!');
                }
                if (rand == 4) {
                    message.reply('You rolled a 4. I guess it\'s alright.');
                }
                if (rand == 5) {
                    message.reply('You rolled a 5! Nice!');
                }
                if (rand == 6) {
                    message.reply('Wow! You rolled a 6! It must be your lucky day :)');
                }
            break;

            // !stream causes bot to join current voice channel and start streaming music
            case 'stream':
                if (!message.guild) return;
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                        .then(async connection => {
                            logger.info('SUCCESSFULLY CONNECTED BEEP BOOP');
                            // query youtube for search results for 'lofi live'
                            let result = await searchYoutube(auth.ytkey, ytoptions);
                            if (!result) {
                                logger.info('YouTube search failed.');
                            } else {
                                // logger.info(result);
                                // logger.info(result.items[0]);
                                // logger.info(result.items[0].snippet.liveBroadcastContent);

                                // parse the JSON returned by searching YouTube and look
                                // for any live videos that are in the search results.
                                let ytstream;
                                for (var i = 0; i < result.items.length && !ytstream; i++) {
                                    if (result.items[i].snippet.liveBroadcastContent === 'live') {
                                        ytstream = yt(ytUrlBase + result.items[i].id.videoId, { audioonly: true });
                                    }
                                }
                                // if we found a live video, stream it in the channel. If not, play the first video in the search result
                                let dispatcher;
                                if (ytstream) {
                                    dispatcher = connection.playStream(ytstream, { passes: 1});
                                } else {
                                    ytstream = yt(ytUrlBase + result.items[0].id.videoId, { audioonly: true });
                                }
                                // if we cannot play the youtube video, then output error
                                dispatcher.on('error', (err) => {
                                    message.reply('error: ' + err);
                                });
                            }
                        })
                        .catch(console.log);
                } else {
                    message.reply('You need to join a voice channel first!');
                }
            break;

            // !songoftheday suggests song of the day with YouTube link using node.js spotify api
            // either search for song or browse category/genre/featured playlists
            // select a random song and store it as the song for the whole day somehow:
            // option 1: store song and date as a json and update when date is not same as json date
            // option 2: just suggest a random song and scrap song of the day
            // option 3: create a persistent queue and just poll it. when date changes remove from queue.
            // option 4: manually change the link everyday (not preferred)
            case 'songoftheday':
                spotifyApi.searchPlaylists('lofi')
                    .then(function(data) {
                        logger.info('Found playlists are', data.body);
                    }, function(err) {
                        logger.info('Something went wrong!', err);
                    });
                spotifyApi.searchTracks('lofi')
                    .then(function(data) {
                        logger.info('Search tracks by "lofi"', data.body);
                    }, function(err) {
                        logger.info('Something went wrong!', err);
                    });

            break;

            // !recommend me recommends a random GOOD song for the user and provides a YouTube link
            // option 1: query the list of top songs from lofi playlists based on popularity
            // option 2: query spotify search results and pick a high popularity track
            // option 3: query YouTube and return a specific high ranking track (we can limit
            // length to be <7 or 8 mins to avoid live and mixes). Hard to recommend different tracks
            // option 4: keep a list of best artists, query their top songs on spotify and select randomly
            // option 5: totally random spotify lookup (not recommended)
            case 'recommendme':
                message.reply('');
            break;
         }
     }
});
