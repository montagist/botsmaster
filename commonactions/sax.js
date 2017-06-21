var forkie = require('forkie');
var minimist = require('minimist');

const BOT_TITLE = "Sax";
const CMD_DELIM = "!";
const CMD_REGEX = new RegExp( '^'+CMD_DELIM+'.*$' , 'i' );

if ( process.env.USER_ACCESS )
	var cmdUsers = process.env.USER_ACCESS.split(',');

var workOpts = { start: function(c){ setTimeout( c, 3000 ); },
		 stop:  function(c){ setTimeout( c, 1500 ); } };

var worker = forkie.worker( BOT_TITLE, workOpts );

var commands = {

	'!sax': function( meta, opts ) {

		//TODO: implement wrapper for access rule by user
		var acceptUsers = cmdUsers;

		var userValid = acceptUsers.some( function( el ) {
			return el.toLowerCase() === meta.from.toLowerCase();
		} );

		if ( userValid && opts.to && opts.serv ) {

			opts._.shift();
			process.send( { type: "chat",
					to: opts.to,
					serv: opts.serv,
					msg: opts._.join(" ") } ); 	
		}
	},

	'!tail': function( initiatorMsg, opts ) {

		process.on( "message", function( msg ) {

			if ( msg.serv == opts.serv && msg.to == opts.to ) {

				var xServMsg ="["+msg.serv+"] "+msg.from+"->"						    +msg.to+": "+msg.msg;

				process.send( { type: "chat",
						to: initiatorMsg.to,
						serv: initiatorMsg.serv,
						msg: xServMsg } );
			}
		} );
	}
};

process.on( "message", function ( msg ) {

	var from = msg.from,
	    to = msg.to,
	    message = msg.msg || "";

	console.log( msg, from + ' => ' + to + ': ' + message );

	if ( message && message.match && message.match( CMD_REGEX ) ) {

		var minOpts = minimist( message.toLowerCase().split(" ") );

		if ( commands[ minOpts._[ 0 ] ] ) {
		
			var theCmd = commands[ minOpts._[ 0 ] ] ;
			theCmd( msg, minOpts );
		}
	}

} );
