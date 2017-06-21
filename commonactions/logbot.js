var forkie = require('forkie');
var fs = require('fs');
var util = require('util');

const BOT_TITLE = "LogBot";
const LOGFILE = "chats.log";
var workOpts = { start: function(c){ setTimeout( c, 3000 ); },
		 stop:  function(c){ setTimeout( c, 1500 ); } };

var worker = forkie.worker( BOT_TITLE, workOpts );
var logFile = fs.createWriteStream( LOGFILE, { flags: 'a' } );

console.log = function () {
	logFile.write( util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

process.on( "message", function( m ) {

	if ( m.serv )
		console.log( (new Date()).getTime() + " [ " + m.serv +
			     " ] " + m.from + " -> " + m.to + ": " + m.msg );
} );

