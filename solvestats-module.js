exports.calcStats = function(solves_today){

	var sum = 0.0;
	var total_solves = solves_today.length;
	var last_five = new Array();
	var last_twelve = new Array();

	if(total_solves >= 5){
		for(var i=total_solves-1; i>=total_solves-5; i-=1){
			last_five.push(solves_today[i]);
		}
		last_five.sort();
		for(var i=1;i<4;++i){
			sum += last_five[i];
		}
	}

	ao5 = sum / 3;

	sum = 0.0;

	if(total_solves >= 12){
		for(var i=total_solves-1; i>=total_solves-12; i-=1){
			last_twelve.push(solves_today[i]);
		}
		last_twelve.sort();
		for(var i=1;i<11;++i){
			sum += last_twelve[i];
		}
	}

	ao12 = sum / 10;

	sum = 0.0;

	for(var i=0; i<solves_today.length; i+=1){
		sum += solves_today[i];
	}
	ao_session = sum / solves_today.length;

	ao5 = parseFloat((ao5).toFixed(2));
	ao12 = parseFloat((ao12).toFixed(2));
	ao_session = parseFloat((ao_session).toFixed(2));

	var temp = [ao5, ao12, ao_session];
	return temp;

	// console.log("Session Statistics: ");
	// console.log(ao5 + "; " + ao12 + "; " + ao_session);
	// console.log(solves_today);
}
