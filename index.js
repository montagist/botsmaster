var irc = require('irc');
var minimist = require('minimist');
var childProcess = require('child_process');
var Vantage = require('vantage');
var compromise = require('compromise');
var speakeasy = require('speakeasy-nlp');
var convoSequence = require('./SeqStateMachine');

const CMD_DELIM = "!";
const CMD_REGEX = new RegExp( '^'+CMD_DELIM+'.*$' , 'i' );

var ircConfig = { channels: ['#rBotsTest'],
		  secure: true,
		  selfSigned: true,
		  certExpired: true,
		  debug: false,
		  showErrors: true,
		  port: 6697 };



var client = new irc.Client( 'chat.freenode.net', 'adiTun201', ircConfig );

process.theClient = client;

var seqManager = new convoSequence.SeqStateMachine( [
	convoSequence.lwrCaseMatchBuilder( "i am first match" ),
	convoSequence.lwrCaseMatchBuilder( "i am second match" ),
	convoSequence.lwrCaseMatchBuilder( "i am third match" )
], function() { console.log( "fin." ); } );

var vantage = new Vantage()
			.delimiter("ani> ")
			.listen(80)
			.show();


var commands = {

	'!rec': function( meta, opts ) {
	
		var lbl = meta.user + (new Date()).getTime(),
		    cmd = "./node_modules/ttystudio/bin/ttystudio";

		console.log( "inside !rec method" );
	
		var ttyRecProc = childProcess.spawn( cmd, [ lbl + ".gif", "--log" ] );	// TODO: Sanitize 

		ttyRecProc.stdout.on('data', function(data) {
			console.log('stdout: ', data);
		});

		ttyRecProc.stderr.on('data', function(data) {
			console.log('stderr: ', data);
		});

		ttyRecProc.on('close', function(code) {
			console.log('child process exited with code ', code);
		});

		console.log( ttyRecProc );
		ttyRecProc.stdin.write( "irssi -c chat.freenode.net --nick " + lbl + "\n" );

		setTimeout( function() {

			ttyRecProc.stdin.write( "\x11" );

		}, 10000 );
	}
};



client.addListener( "message", function ( from, to, message ) {

	console.log( from + ' => ' + to + ': ' + message );

	if ( message.match( CMD_REGEX ) ) {

		var minOpts = minimist( message.toLowerCase().split(" ") );

		console.log( minOpts['_'][0], !!commands[ minOpts['_'][ 0 ] ]  );

		if ( commands[ minOpts['_'][ 0 ] ] ) {
		
			var theCmd = commands[ minOpts['_'][ 0 ] ] ;
			theCmd( { 'user': from }, minOpts );
		}
	}

	seqManager.executeSeq( from, to, message );

} );

client.addListener( "pm", function( from, msg ) {

	console.log( from + ' => ' + msg );
} );

client.addListener( "error", function( msg ) {

	console.error( msg );
} );
