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

var n = 35;
var b = [...Array(n).keys()].map( i => ++i );
var trial_order = b.map( i => (i * mod) % (36));
var selected = [];

page_setup = function(count, prev, payout) {
	// trial_idx = data['count'];
	$("span#trial-num").html(count + 1);

	total_pay = payout;

	trial_idx = count % n;
	cond_idx = Math.floor(count / n);

	if (charts[cond_idx] == "m") {n_regions = 12} else {n_regions = 8};

	var img_order = shuffle([...Array(n_regions).keys()].map( i => ++i ));

	alpha = 0.05; // parseInt(incentives[cond_idx])/100;

	$("span#fp-val").text("" + Math.round(((1-alpha)/alpha) * 20) + " points");
	// the payoff matrix images/payoff_5.png
	$("img#payoff-img").attr("src", "images/payoff_" + (alpha*100) + ".png"); // incentives[cond_idx] + ".png");
	if (conditions[cond_idx].slice(0,4) == "hops") { extension = ".gif" } else { extension = ".png" }

	$("span#nregion").text(n_regions);

	if (n_regions == 12){
		url = "https://raw.githubusercontent.com/MUCollective/vis-insight-reliability/stimuli/plots/"+ conditions[cond_idx] +"/12-regions/profits-t"+ trial_order[trial_idx] + "-p";
		$("div#opt-1").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[0] + extension);
		$("div#opt-2").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[1] + extension);
		$("div#opt-3").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[2] + extension);
		$("div#opt-4").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[3] + extension);
		$("div#opt-5").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[4] + extension);
		$("div#opt-6").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[5] + extension);
		$("div#opt-7").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[6] + extension);
		$("div#opt-8").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[7] + extension);
		$("div#opt-9").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[8] + extension);
		$("div#opt-10").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[9] + extension);
		$("div#opt-11").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[10] + extension);
		$("div#opt-12").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[11] + extension);
	} else {
		url = "https://raw.githubusercontent.com/MUCollective/vis-insight-reliability/stimuli/plots/"+ conditions[cond_idx] +"/8-regions/profits-t"+ trial_order[trial_idx] + "-p";
		$("div#opt-1").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[0] + extension);
		$("div#opt-2").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[1] + extension);
		$("div#opt-3").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[2] + extension);
		$("div#opt-4").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[3] + extension);
		$("div#opt-5").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[4] + extension);
		$("div#opt-6").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[5] + extension);
		$("div#opt-7").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[6] + extension);
		$("div#opt-8").append('<img class = "question-graphic">').children().attr("src", url + "0.5-" + img_order[7] + extension);

		$("div#opt-1").parent().addClass("col-lg-offset-2");
		$("div#opt-5").parent().addClass("col-lg-offset-2");


		$("div#opt-9").hide();
		$("div#opt-10").hide();
		$("div#opt-11").hide();
		$("div#opt-12").hide();
	}

	// var cond_idx = Math.floor(count / n);
	// var trial_idx = count  % n;

	prev_pay = (prev['tp'] + prev['tn'] + prev['fn']) * 20 + prev['fp'] * Math.round(((1-alpha)/alpha) * 20);
	if (trial_idx > 0 & prev != "NA") {
		$("span.prev-tp").html("&#x2705; Selected, profitable: " + prev['tp'] + ";");
		$("span.prev-tn").html("&#x2705; Didn't select, not profitable: " + prev['tn'] + ";");
		$("span.prev-fp").html("&#10060 Selected, not profitable: " + -1*prev['fp'] + ";");
		$("span.prev-fn").html("&#10060 Didn't select, profitable: " + -1*prev['fn']);
		$("span#payoff-prev").html("<i>Payout from previous trial: </i>" + prev_pay);
		$("span#payoff").html("<i>Total Payout:</i> " + total_pay);
	}

	if (trial_idx >= 5) {
		$(".prev-trial-review").hide();
	}

	$("div#submit-btn").on('click', submitResponse);
	$("div#submit-none-btn").on('click', submitNoResponse);
};

$("div#close-popup").on('click', closePopup);

function closePopup() {
	$("div#popup").hide(); // attr("display", "none");
}

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
	prolific_PID+'&SESSION_ID='+session_ID+'&responses='+responses+'&vis='+conditions[prev_c_idx]+'&nregions='+n_regions+
	'&trial='+trial_order[prev_t_idx]+'&t='+time+'&trials_count='+c+'';

	// console.log(submit_response_url)

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
				window.location.href = 'intro.html?PROLIFIC_PID='+prolific_PID+'&SESSION_ID='+session_ID+'&modulo='+mod+'&ret='+to_fwd+'&vis='+conditions+'&ch='+charts+'';
			} else {
				if ((c % (n - 3)) == 21){ // three attention checks at 21 48 75
					window.location.href = 'attention.html?PROLIFIC_PID='+prolific_PID+'&SESSION_ID='+session_ID+'&modulo='+mod+'&ret='+to_fwd+'&vis='+conditions+'&ch='+charts+'';
				} else {
					window.location.href = 'trial.html?PROLIFIC_PID='+prolific_PID+'&SESSION_ID='+session_ID+'&modulo='+mod+'&ret='+to_fwd+'&vis='+conditions+'&ch='+charts+'';
				}
			}
		}
	}).fail(function() {
		console.log("try again");
		$("div#popup").show();
	});
}
