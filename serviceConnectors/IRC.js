var irc = require( "irc" );
var _ = require( "lodash" );


function IRCConnector( opts ) {

	var scope = this;

	var defConfig = {
			  // IRC specific options
			  channels: 	[''],
			  secure: 	true,
			  selfSigned: 	true,
			  certExpired: 	true,
			  debug: 	false,
			  showErrors: 	true,
			  port: 	6697,
			  messageSplit:	512,
			  nick:		'adiTun201',	// IRC-SASL
			  userName:	'adi',
			  realName:	'adi',
			  //password:	'',
			  //sasl:		false,
			  // Our additional options
			  server:	'chat.freenode.net',
			  defPartMsg:	'parting'
			};

	this.service = "irc";
	this.client = null;
	this.opts = _.extend( defConfig, opts );

	this.init = function( msgProcessSlot ) {
	
		this.client = new irc.Client( this.opts.server, this.opts.nick, this.opts );
		this.client.addListener( "message#", function ( from, to, msg ) {

			msgProcessSlot( genMsg( from, to, msg, "chat" ) );
		} );

		this.client.addListener( "pm", function( from, msg ) {

			msgProcessSlot( genMsg( from, scope.opts.nick, msg, "pm" ) );
		} );

		return this.client;
	};

	function genMsg( from, to, msg, type ) {

		var theMsg = { from: from,
				to: to,
				msg: msg,
				type: type,
				serv: scope.service };

		return theMsg;
	}

	this.join = function( channel, cb ) {

		this.client.join( channel, cb );
	};

	this.say = function( to, msg ) {

		this.client.say( to, msg );
	};

	this.pm = function( to, msg ) {

		this.client.ctcp( to, "privmsg", msg );
	};

	this.leave = function( channel, partMsg, cb ) {

		this.client.part( channel, partMsg || this.opts.defPartMsg, cb );
	};
}

module.exports = IRCConnector;
