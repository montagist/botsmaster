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
], function() { console.log( "fin." ); } );


var commands = {

	'!rec': function( meta, opts ) {
	
		var lbl = meta.user + (new Date()).getTime(),
		    cmd = "./node_modules/ttystudio/bin/ttystudio";

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



process.on( "message", function ( msg ) {

	var from = msg.from,
	    to = msg.to,
	    message = msg.message || "";

	console.log( msg, from + ' => ' + to + ': ' + message );

	if ( message && message.match && message.match( CMD_REGEX ) ) {

		var minOpts = minimist( message.toLowerCase().split(" ") );

		console.log( minOpts['_'][0], !!commands[ minOpts['_'][ 0 ] ]  );

		if ( commands[ minOpts['_'][ 0 ] ] ) {
		
			var theCmd = commands[ minOpts['_'][ 0 ] ] ;
			theCmd( { 'user': from }, minOpts );
		}
	}

	seqManager.executeSeq( from, to, message );

} );
