var irc = require('irc');
var minimist = require('minimist');
var childProcess = require('child_process');
var convoSequence = require('./SeqStateMachine');

const CMD_DELIM = "!";
const CMD_REGEX = new RegExp( '^'+CMD_DELIM+'.*$' , 'i' );

var seqManager = new convoSequence.SeqStateMachine( [
	convoSequence.lwrCaseMatchBuilder( "i am first match" ),
	convoSequence.lwrCaseMatchBuilder( "i am second match" ),
	convoSequence.lwrCaseMatchBuilder( "i am third match" )
], function() {

	// TODO: bind msg to current scope/listener
	// like how some web frameworks do
	process.send( { type: "chat", 
			to: "#rBotsTest",
			msg: "Finished sequence matching test. All sequences matched." } );
} );


var commands = {

	'!rec': function( meta, opts ) { }
};


process.on( "message", function ( msg ) {

	var from = msg.from,
	    to = msg.to,
	    message = msg.msg || "";

	console.log( msg, from + ' => ' + to + ': ' + message );

	if ( message && message.match && message.match( CMD_REGEX ) ) {

		var minOpts = minimist( message.toLowerCase().split(" ") );

		console.log( minOpts['_'][0], !!commands[ minOpts['_'][ 0 ] ] );

		if ( commands[ minOpts['_'][ 0 ] ] ) {
		
			var theCmd = commands[ minOpts['_'][ 0 ] ] ;
			theCmd( { 'user': from }, minOpts );
		}
	}

	seqManager.executeSeq( from, to, message );

} );
