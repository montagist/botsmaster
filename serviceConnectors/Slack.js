var slack = require('@slack/client');
var _ = require( "lodash" );
 

function SlackConnector( opts ) {

	var defConfig = {
			  // Slack specific options
			  // Our additional options
			  nick:		'tunnelbot',
			  token:	process.env.SLACK_API_TOKEN || ''
			};

	this.service = "slack";
	this.client = null;
	this.opts = _.extend( defConfig, opts );

	this.init = function( msgProcessSlot ) {
	
		this.client = new slack.RtmClient( this.opts.token );

		var conn = this;

		this.client.on( slack.RTM_EVENTS.MESSAGE, function ( msg ) {

			console.log( "slack msg: ", msg );

			msgProcessSlot( genMsg( msg.user, conn.opts.nick, msg.text, "chat" ) );
		} );

		this.client.start();

		return this.client;
	};

	function genMsg( from, to, msg, type ) {

		var theMsg = { from: from,
				to: to,
				msg: msg,
				type: type,
				serv: this.service };

		return theMsg;
	}

	this.join = function( channel, cb ) {
		
		// Slack bots can't join channels
		if ( cb )
			cb();
	};

	this.say = function( to, msg ) {

		this.client.sendMessage( msg, to );
	};

	this.pm = this.say;

	this.leave = this.join;
}

module.exports = SlackConnector;
