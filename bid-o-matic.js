/*
	AutoBidder for QuiBids, by Alberto Rico Simal
	DISCLAIMER:
		Not affiliated with QuiBids.com.
		For educational purposes only.
		Provided AS IS.
*/

// Debug logging to console
var DEBUG = true;
function log(text){
	if(DEBUG)
		console.debug(text);
}


// Scraping engine
var Scraper = {
	// Used selectors for each element
	selectors : {
		bidButton : ".buttons.bid.large.orange",
		timer     : ".time.large-timer2"
	},

	/*
	 Each element in the scraping engine shall hold the node that matches the selector
	 and relevant functions.
	*/

	// Timer element
	timer : {
		node : null,
		getText:
			function(){
				return this.node.text();
			}
		,
		getSeconds :
			function(){
				var timeString = this.getText();

				var hours   = parseInt(timeString.substring(0,2));
				var minutes = parseInt(timeString.substring(3,5));
				var seconds = parseInt(timeString.substring(6,8));

				return hours*60*60 + minutes*60 + seconds;
			}
	},

	// Bidding button element
	bidButton : {
		node : null,
		bid  :
			function(){
				this.node.click();
				log("Bid!");
			}
	},

	// Initializing the scraper, selecting the nodes
	initialize :
		function(){
			this.bidButton.node = $(this.selectors.bidButton);
			this.timer.node     = $(this.selectors.timer);

			log("Nodes were scraped")
		}

}

// Evaluation engine
var Evaluator = {
	// Configuration for the evaluator
	config : {
		minSecondsToBid : 3,	// Minimum seconds in the counter required to place a bid
		loopInterval    : 500	// Loop interval for each round
	},

	// Current evaluator state (defaults)
	state: {
		kill 		: true,		// Set to true when evaluator is to be killed
		proactive	: false		// Placing bids automatically
	},

	// Activation and deactivation of proactive bidding
	setProactiveOn : 
		function(){
			this.state.proactive = true;
		}
	,
	setProactiveOff : 
		function(){
			this.state.proactive = false;
		}
	,

	// Kill the evaluator
	kill : 
		function(){
			this.state.kill = true;
		}
	,

	// Run the evaluator
	run : 
		function(){
			this.state.kill = false;
			this._evaluator();
		}
	,

	// Evaluation loop (only called internally)
	// "this" is not used here, since the setTimeout
	// runs the function in global scope
	_evaluator :	
		function(){
			// Check if should continue running
			if(Evaluator.state.kill){
				log("Evaluator killed");
				return;
			}

			log("Evaluating");

			// Execute action if timer is under the limit seconds
			if(Scraper.timer.getSeconds() <= Evaluator.config.minSecondsToBid){
				log("Timer under minSecondsToBid");

				// If proactive, bid
				if(Evaluator.state.proactive){
					Scraper.bidButton.bid();
				}
			}

			window.setTimeout(Evaluator._evaluator, Evaluator.config.loopInterval);
		}
}


// Initialize!
function init(){
	
	// Initialize Scraper
	Scraper.initialize();

	// Start Evaluator
	Evaluator.run();
}

init();