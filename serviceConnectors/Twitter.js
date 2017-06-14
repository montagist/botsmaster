var Twitter = require( "twitter" );
var _ = require( "lodash" );


function TwitterConnector( opts ) {

	var scope = this;

	var defConfig = {
			  // Twitter specific options
			  consumer_key: process.env.TWITTER_CONSUMER_KEY || '',
			  consumer_secret: process.env.TWITTER_CONSUMER_SECRET || '',
			  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY || '',
			  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
			  // Our additional options
			};

	this.service = "twitter";
	this.client = null;
	this.opts = _.extend( defConfig, opts );

	this.init = function( msgProcessSlot ) {
	
		this.client = new Twitter( this.opts );
/*
		this.client.addListener( "message#", function ( from, to, msg ) {

			msgProcessSlot( genMsg( from, to, msg, "chat" ) );
		} );

		this.client.addListener( "pm", function( from, msg ) {

			msgProcessSlot( genMsg( from, scope.opts.nick, msg, "pm" ) );
		} );
*/
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

	this.streams = {};

	this.join = function( channel, cb ) {

		this.streams[ channel ] =
		this.client.stream( 'statuses/filter',
				    { track: 'twitter' },
				    function(stream) {
					stream.on('data', function(tweet) {
						console.log(tweet);
					});
				    } );
	};

	this.say = function( to, msg ) {

		//TODO: enforce inclusion of to-targets @ name
		this.client.post( 'statuses/update',
				  { status: msg },
				  function(error, tweet, response) { } );

	};

	this.pm = function( to, msg ) {

		this.client.ctcp( to, "privmsg", msg );
	};

	this.leave = function( channel, partMsg, cb ) {

		this.streams[ channel ].destroy();
		delete this.streams[ channel ];
	};
}

module.exports = TwitterConnector;
