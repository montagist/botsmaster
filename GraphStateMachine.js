var PigeonKeeper = require("pigeonkeeper");

function GraphStateMachine( seqLbl ) {

	var maxProcs = 99,
	    quitFail = false;

	var scope = this;

	this._nodeMap = {};

	this._pigeonKeeper = new PigeonKeeper( seqLbl, function( err, data ) {

		if ( err ) {

			console.log( "In app.finalCallback, error object: " + JSON.stringify( err ) );
			console.log( scope._pigeonKeeper.overallStateAsString() );
			console.log( scope._pigeonKeeper.getResults() );

		} else {

			console.log( "In app.finalCallback: all tasks are complete!" );
			console.log( scope._pigeonKeeper.overallStateAsString() );
			console.log( scope._pigeonKeeper.getResults() );
		}

	}, quitFail, maxProcs );


	this.addGraphEdge = function( nodeLbl, parentLbl ) {

		this._pigeonKeeper.addEdge( nodeLbl, parentLbl );
	}

	this.addGraphNodeCallback = function( nodeLbl, nodeScope, theCallbackFunc, parentLbl ) {

		this._nodeMap[ nodeLbl ] = this._pigeonKeeper.addVertex( nodeLbl, nodeScope, theCallbackFunc );

		if ( parentLbl )
			this._pigeonKeeper.addEdge( nodeLbl, parentLbl );
	}

	this.execute = function( from, to, msg ) {

		var msgEnv = { from: from,
				to: to,
				msg: msg };

		this._pigeonkeeper.start( msgEnv );
	
		// TODO: make procs emit success if they've already.
	}
}

module.exports = GraphStateMachine;
