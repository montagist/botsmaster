var forkie = require('forkie');
var Master = require('./patched_master.js');

var IRCConnector = require( './serviceConnectors/IRC' );
var ircClient = new IRCConnector( { channels: ['#rBotsTest'],
				    nick: "adibot" } );

var SlackConnector = require( './serviceConnectors/Slack' );
var slackClient = new SlackConnector();

var connectors = [ ircClient, slackClient ],
    botfiles = [ "botfile.js" ];

function BotsMaster( connectors, botfiles ) {

	var scope = this;

	this.masterProc = Master( botfiles, 
				  { repl: { name: 'master-repl',
				    	    path: process.cwd() } } );

	var msgPass2Workers = function( msg ) {

		scope.masterProc.forks.map( function( fork ) {
			// TODO: regex keying against workers
			forks.send( msg );
		} );
	};

	this.service2Connector = {};

	connectors.map( function( conn ) {

		// allows cross-service via simple msg-dispatching
		scope.service2Connector[ conn.service ] = conn;

		// service connection & routing msgs to individual workers 
		conn.init( msgPass2Workers );
	} ); 

	this.masterProc.on('worker started', function() {

		var msgFromWorkerHandler = function( msg ) {  

			// matching Connector by requested msg service
			var theClient = scope.service2Connector[ msg.serv ];

			if ( !theClient ) {

				console.error( "Connector not found for service: " + msg.serv );
				return;
			}

			switch ( msg.type ) {

				case "chat":
					theClient.say( msg.to, msg.msg );	
				break;
			
				case "pm":
					theClient.pm( msg.to, msg.msg );
				break;
			}		
		};

		for ( var fi = 0; fi < scope.masterProc.forks.length; fi++ ) {       

			scope.masterProc.forks[fi].on( 'message', msgFromWorkerHandler );
		}
	} );
}

var bm = new BotsMaster( connectors, botfiles );

module.exports = BotsMaster;
