var title = 'I am a worker';

var opts = {
  start: startWorker,
  stop: stopWorker
};

var worker = require('forkie').worker(title, opts);

//worker.on('stopped', console.log);
//worker.on('started', console.log);
//worker.on('ready', console.log);

process.on('message', function(m) {

	console.log( 'yoyo', m );
} );

var tmp = require('./index.js');

function startWorker(cb) {
  setTimeout(cb, 3000);
}

function stopWorker(cb) {
  setTimeout(cb, 1500);
}
