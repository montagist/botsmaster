var irc = require('irc');
var minimist = require('minimist');
var compromise = require('compromise');
var speakeasy = require('speakeasy-nlp');
var convoSequence = require('./SeqStateMachine');

const CMD_DELIM = "!";
const CMD_REGEX = new RegExp( '^'+CMD_DELIM+'.*$' , 'i' );

var ircConfig = { channels: ['#defcon201'],
		  secure: true,
		  selfSigned: true,
		  certExpired: true,
		  debug: true,
		  showErrors: true,
		  port: 6697 };

var client = new irc.Client( 'chat.freenode.net', 'adinodedc201', ircConfig );

var seqManager = new convoSequence.SeqStateMachine( [
	convoSequence.lwrCaseMatchBuilder( "i am first match" ),
	convoSequence.lwrCaseMatchBuilder( "i am second match" ),
	convoSequence.lwrCaseMatchBuilder( "i am third match" )
], function() { console.log( "fin." ); } );

client.addListener( "message", function ( from, to, message ) {

	console.log( from + ' => ' + to + ': ' + message );

	if ( message.match( CMD_REGEX ) )
		console.log( minimist( message.split(" ") ) );

	seqManager.executeSeq( from, to, message );

} );

client.addListener( "error", function( msg ) {

	console.error( msg );
} );
