/*
	AutoBidder for QuiBids, by Alberto Rico Simal
*/

// Selectors for the required page elements
var BID_BUTTON_SELECTOR = ".buttons.bid.large.orange";
var TIMER_SELECTOR      = ".time.large-timer2";

// Timing
var MIN_SECONDS_BID  = 3;
var EVAL_MS_INTERVAL = 500;

// Page elements
var bidButton;
var timer;

// Running state
var wannaBid;
var runEvaluate;

// Return total seconds remaining
function getRemainingSeconds(){
	var timeString = timer.text();

	var hours   = parseInt(timeString.substring(0,2));
	var minutes = parseInt(timeString.substring(3,5));
	var seconds = parseInt(timeString.substring(6,8));

	return hours*60*60 + minutes*60 + seconds;
}

// Perform bid
function bid(){
	bidButton.click();
	console.debug("Bid was placed ;)");
}

// Recursive loop
function evaluate(){
	if(!runEvaluate)
		return;

	console.debug(wannaBid);

	if(getRemainingSeconds() <= MIN_SECONDS_BID){
		console.debug("Time is almost over");
		if(wannaBid){
			bid();
		}
	}

	setTimeout(evaluate, EVAL_MS_INTERVAL);
}

// Activate bidding
function autoOn(){
	wannaBid = true;
}
// Deactivate bidding
function autoOff(){
	wannaBid = false;
}
// Kill evaluate
function kill(){
	runEvaluate = false;
}

// Initialize!
function init(){
	// State
	wannaBid    = false;
	runEvaluate = true;

	// Select elements
	bidButton = $(BID_BUTTON_SELECTOR);
	timer     = $(TIMER_SELECTOR);

	// Start evaluating conditions
	evaluate();

	console.log("Execute autoOn() for automatic bidding!");
}

init();