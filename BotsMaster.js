var irc = require('irc');
var forkie = require('forkie');
var colors = require('colors/safe');

var masterProc = require('./patched_master')( [ "botfile.js" ], { repl: {
    name: 'master-repl',
    path: process.cwd()
  } } );

masterProc.on('worker stopped', function(metas) {

	console.log(metas.title); // worker title, see worker API 
	console.log(metas.code)   // exit code 
	console.log(metas.signal) // exit signal, should be SIGKILL when killTimeout occurs 
});
 
var client,
    ircConfig = { channels: ['#rBotsTest'],
                  secure: true,
                  selfSigned: true,
                  certExpired: true,
                  debug: false,
                  showErrors: true,
                  port: 6697 };

// on ready and started events, you get the `{ title: 'worker title' }` 
masterProc.on('worker ready', console.log );
masterProc.on('worker started', console.log );

client = new irc.Client( 'chat.freenode.net', 'adiTun201', ircConfig );

client.addListener( "message", function ( from, to, message ) {

	console.log( from + ' => ' + to + ': ' + message );

	for ( var fi = 0; fi < masterProc.forks.length; fi++ )
		masterProc.forks[fi].send({ from: from, to: to, message: message });
} );

client.addListener( "pm", function( from, msg ) {

	console.log( from + ' => ' + msg );
} );

client.addListener( "error", function( msg ) {

	console.error( colors.red( msg ) );
} );
 
function startMaster(cb) {

	setTimeout(cb, 3000);
}
 
function stopMaster(cb) {

	setTimeout(cb, 1500);
}


