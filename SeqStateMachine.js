var async = require('async');

function lwrCaseMatchBuilder( strToMatch ) {

	var lowerCaseMatcher = function( from, to, msg, callback ) {

		if ( msg.toLowerCase().trim() == strToMatch.toLowerCase() ) {

			console.log( "MATCH! ", msg, strToMatch );
			callback( null, from, to, msg );
	
		} else {
	
			callback( "nonmatch" );
		}
	}

	return lowerCaseMatcher;
}

function SeqStateMachine( asyncCallbacks, finalCallback ) {

	// List of pattern matching async funcs
	// that must be met in succession
	this.asyncFuncs = asyncCallbacks;

	this.addAsyncFunc = function( anAsync ) {

		this.asyncFuncs.push( anAsync );
	}

	this.executeSeq = function( from, to, msg ) {

		var scp = this;

		async.mapSeries( this.asyncFuncs, 
				 function( fn, cb ) { fn( from, to, msg, cb ); },
				 function( err, results ) {

					if ( err ) {
						
						// We made a mistake or didn't match somewhere.
						// If non-match, let's trim what was matched

					}
		  
					console.log( "results length: ", results.length );
					console.log( results );

					if ( results.length >= 2 ) {

						console.log( scp.asyncFuncs.length );
						scp.asyncFuncs.splice( 0, 1 );
						console.log( scp.asyncFuncs.length );

					} else if ( !err && results.length == 1 && scp.asyncFuncs.length == 1 ) {

						scp.asyncFuncs = [];
						finalCallback();
					}			
		} );
	}
}

module.exports = { lwrCaseMatchBuilder: lwrCaseMatchBuilder,
		   SeqStateMachine: SeqStateMachine };
