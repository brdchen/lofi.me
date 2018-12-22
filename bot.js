const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;

            // !greet greets the user
            case 'greet':
                bot.sendMessage({
                    to: channelID,
                    message: 'Hello, ' + user + '.'
                });
            break;

            // !rolldice will roll a random 6-sided die and output a message with the result
            case 'rolldice':
                var rand = Math.floor(Math.random() * 6) + 1;
                if (rand == 1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Awwww you rolled a 1. Better luck next time!'
                    });
                }
                if (rand == 2) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You rolled a 2. Could have been better I guess!'
                    });
                }
                if (rand == 3) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You rolled a 3. Not bad!'
                    });
                }
                if (rand == 4) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You rolled a 4. I guess it\'s alright.'
                    });
                }
                if (rand == 5) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'You rolled a 5! Nice!'
                    });
                }
                if (rand == 6) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Wow! You rolled a 6! It must be your lucky day :)'
                    });
                }
            break;

         }
     }
});
