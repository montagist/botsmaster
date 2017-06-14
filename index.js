var IRCConnector = require( './serviceConnectors/IRC' );
var ircClient = new IRCConnector( { channels: ['#rBotsTest'],
                                    nick: "adibot" } );

var SlackConnector = require( './serviceConnectors/Slack' );
var slackClient = new SlackConnector();

var TwitterConnector = require( './serviceConnectors/Twitter' );
var twitterClient = new TwitterConnector();

var connectors = [ ircClient, slackClient ],
    botfiles = [ "./commonbots/logbot.js", "examplebot.js" ];

var BotsMaster = require('./BotsMaster');
var bm = new BotsMaster( connectors, botfiles );

//twitterClient.init( function(){} );
//twitterClient.join( "#javascript" );
