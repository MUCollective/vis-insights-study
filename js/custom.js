// completely pseudo-random
function shuffle(array) {
	var n = array.length, t, i;
	while (n) {
		i = Math.random() * n-- | 0;
		t = array[n];
		array[n] = array[i];
		array[i] = t;
	}
	return array;
}


var n = 30;
var b = [...Array(n).keys()].map( i => ++i );
var trial_order = b.map( i => (i * mod) % (n+1));
var img_order = shuffle([...Array(10).keys()].map( i => ++i ));
var selected = [];

page_setup = function(count, prev, payout) {
	// trial_idx = data['count'];
	$("span#trial-num").html(count + 1);

	total_pay = payout;

	trial_idx = count % n;
	cond_idx = Math.floor(count / n);
	alpha = parseInt(incentives[cond_idx])/100;

	$("span#fp-val").text("" + Math.round(((1-alpha)/alpha) * 20) + " points");
	// the payoff matrix images/payoff_5.png
	$("img#payoff-img").attr("src", "images/payoff_" + incentives[cond_idx] + ".png");

	url = "https://raw.githubusercontent.com/MUCollective/vis-insight-reliability/stimuli/plots/"+ conditions[cond_idx] +"/profits-t"+ trial_order[trial_idx] + "-p";

	$("div#opt-1").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[0] + ".png");
	$("div#opt-2").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[1] + ".png");
	$("div#opt-3").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[2] + ".png");
	$("div#opt-4").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[3] + ".png");
	$("div#opt-5").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[4] + ".png");
	$("div#opt-6").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[5] + ".png");
	$("div#opt-7").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[6] + ".png");
	$("div#opt-8").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[7] + ".png");
	$("div#opt-9").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[8] + ".png");
	$("div#opt-10").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[9] + ".png");

	var cond_idx = Math.floor(count / n);
	var trial_idx = count  % n;

	prev_pay = (prev['tp'] + prev['tn'] + prev['fn']) * 20 + prev['fp'] * Math.round(((1-alpha)/alpha) * 20);
	if (count > 0 & prev != "NA") {
		// result_str = "<i>Previous trial:</i> &#x2705; True Positive: " + prev['tp'] + ", &#x2705; True Negative: " + prev['tn'] + ", &#10060 False Positive: " + -1*prev['fp'] + ", &#10060 False Negative: " + -1*prev['fn'];
		result_str = "<i>Previous trial:</i> &#x2705; Selected, profitable: " + prev['tp'] + ", &#x2705; Didn't select, not profitable: " + prev['tn'] + ", &#10060 Selected, not profitable: " + -1*prev['fp'] + ", &#10060 Didn't select, profitable: " + -1*prev['fn'];

		$("span#result-prev").html(result_str);
		$("span#payoff-prev").html("<i>Payout from previous trial: </i>" + prev_pay);
		$("span#payoff").html("<i>Total Payout:</i> " + total_pay);
	}

	$("div#submit-btn").on('click', submitResponse);
	$("div#submit-none-btn").on('click', submitNoResponse);
};

page_setup(count, prev, cumulative_payout);

$(function() {
	$('.question-container').hover(function() {
		$(this).css('background', '#3CA8FF');
		$(this).css('color', '#ffffff');
	}, function() {
		// on mouseout, reset the background colour
		$(this).css('background', '');
		$(this).css('color', '#333333');
	});
});

$(".question-container").click(function () {
	$(this).toggleClass("selected");
	var id_str = $(this).children().attr("src").split("-");
	var id = id_str[id_str.length - 1].split(".")[0];

	if (!selected.includes(id)) {
		selected.push(id);
	} else {
		var idx = selected.indexOf(id);
		if (idx !== -1) selected.splice(idx, 1);
	}
});

// send response to DB
function submitResponse() {
	// uses global value for 'selected'
	// Time spent on page
	var time = Math.round(TimeMe.getTimeOnCurrentPageInSeconds() * 1000) / 1000;

	if (selected.length > 0){
		update_trial_page(count, selected.toString(), time);
	} else {
		alert("Please indicate a region as profitable or click on the button marked, 'None of the regions are profitable'")
	}
}

function submitNoResponse() {
	var time = Math.round(TimeMe.getTimeOnCurrentPageInSeconds() * 1000) / 1000;

	if (selected.length == 0){
		update_trial_page(count, 'null', time);
	} else {
		alert("You have indicated certain regions as profitable. Please click on the submit button")
	}
}

function update_trial_page(c, responses, time) {
	var prev_c_idx = Math.floor(c / n);
	var prev_t_idx = c % n;

	var submit_response_url = 'https://w8vewq61bf.execute-api.us-east-2.amazonaws.com/prod/recordResponses?PROLIFIC_PID='+
	prolific_PID+'&SESSION_ID='+session_ID+'&responses='+responses+'&vis='+conditions[prev_c_idx]+
	'&alpha='+incentives[prev_c_idx]+'&trial='+trial_order[prev_t_idx]+'&t='+time+'&trials_count='+c+'';

	$.get(submit_response_url).done(function (data) {
		to_fwd = window.btoa( [data['count'], Object.values(data['prev']), data['payout']].flat() );

		if (c >= (conditions.length * n - 1)){
			var get_uuid_url = 'https://w8vewq61bf.execute-api.us-east-2.amazonaws.com/prod/user_records?user=old&PROLIFIC_PID='+prolific_PID+'&SESSION_ID=' + session_ID + '';

			$.get(get_uuid_url, function(data, status) {
				uuid = data;

				window.location.href = 'https://umich.qualtrics.com/jfe/form/SV_0O0FsjvFas9tzKd?PROLIFIC_PID='+prolific_PID+'&SESSION_ID='+session_ID+'&uuid='+uuid+'';
			})
		} else {
			if (((c + 1) % n) == 0) {
				window.location.href = 'intro.html?PROLIFIC_PID='+prolific_PID+'&SESSION_ID='+session_ID+'&modulo='+mod+'&ret='+to_fwd+'&vis='+conditions+'&alpha='+incentives+'';
			} else {
				if ((c % (n - 3)) == 21){ // three attention checks at 21 48 75
					window.location.href = 'attention.html?PROLIFIC_PID='+prolific_PID+'&SESSION_ID='+session_ID+'&modulo='+mod+'&ret='+to_fwd+'&vis='+conditions+'&alpha='+incentives+'';
				} else {
					window.location.href = 'trial.html?PROLIFIC_PID='+prolific_PID+'&SESSION_ID='+session_ID+'&modulo='+mod+'&ret='+to_fwd+'&vis='+conditions+'&alpha='+incentives+'';
				}
			}
		}
	});
}



