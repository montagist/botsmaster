var forkie = require('forkie');

var masterProc = require('./patched_master')( [ "botfile.js" ], { repl: {
    name: 'master-repl',
    path: process.cwd()
  } } );

var IRCConnector = require( './serviceConnectors/IRC' );
var ircClient = new IRCConnector( { channels: ['#rBotsTest'] } );

var SlackConnector = require( './serviceConnectors/Slack' );
var slackClient = new SlackConnector();

// TODO: iterate over passed in Connectors
ircClient.init( function( msg ) {

	for ( var fi = 0; fi < masterProc.forks.length; fi++ )
		masterProc.forks[fi].send( msg );
} );

slackClient.init( function( msg ) {

	for ( var fi = 0; fi < masterProc.forks.length; fi++ )
		masterProc.forks[fi].send( msg );
} );

masterProc.on('worker started', function() {

	var msgHandler = function( msg ) {  

		switch ( msg.type ) {

			case "chat":
				ircClient.say( msg.to, msg.msg );	
			break;
		
			case "pm":
				ircClient.pm( msg.to, msg.msg );
			break;
		}		
	};

        for ( var fi = 0; fi < masterProc.forks.length; fi++ ) {       

		// TODO: regex keying against handlers
                masterProc.forks[fi].on( 'message', msgHandler );
	}
} );


ircClient.client.addListener( "error", function( msg ) {

	console.error( msg );
} );
