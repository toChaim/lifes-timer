$(document).ready(function(){
	//global variables 
	var $dig = $('#dig');
	var $cname = $('#cname');
	var $ctime = $('#ctime');
	var $list = $('#list');
	var $listFoot = $('#addform');
	var current = 0;

	//Time related functions
	var Time = (function(){
		var seconds = 1000;
		var minutes = 60 * seconds;
		var hours = 60 * minutes;
		var days = 24 * hours;
		function leadZero(num){
			if(num < 10) return "0" + num;
			else return num;
		}

		return {
		  toString: function(mills){
		    if(mills === undefined){
		      let dateObj = new Date();
		      mills = dateObj.getTime() - dateObj.getTimezoneOffset() * 60000;
		    }
		    let t = mills % days;
				var d = Math.floor(t/hours) + ":";
				t %= hours;
				d += leadZero(Math.floor(t/minutes)) + ":";
				t %= minutes;
				d += leadZero(Math.floor(t/seconds));
				return d;
		    
		  },
		  fromString: function(str){
		    if(str === undefined || str === ''){
		      let dateObj = new Date();
		      return dateObj.getTime() - dateObj.getTimezoneOffset() * 60000;
		    }
		    arr = str.split(':');
				var d = arr[0]*hours;
				d += arr[1]*minutes;
				d += arr[2]*seconds;
				return d;
		  },
		  moreOrLess: function (mills) {
		  	if(mills > 5 * hours) return 30 * minutes;
		  	if(mills > 2 * hours) return 15 * minutes;
		  	if(mills > 30 * minutes) return 10 * minutes;
		  	if(mills > 10* minutes) return 5 * minutes;
		  	return 30 * seconds;
		  }
		};
	})();

	//load saved activities
	var schedule = (function(){

		return {
			save: function(scheduleName = 'defaultSchedule'){
				var $acts = $('.act');
				var acts = [];

				for(let i =0; i < $acts.length; i++){
					acts.push( new Act(
						$acts.eq(i).find('.aname').eq(0).val(),
						$acts.eq(i).find('.atime').eq(0).val()
						) );
				}

				localStorage.setItem(scheduleName, JSON.stringify(acts));
			},
			load: function(scheduleName = 'defaultSchedule'){
				var acts = JSON.parse(localStorage.getItem(scheduleName));
				if(acts === null || acts.length === 0){
					acts = [
						new Act('Work', '0:25:00'),
						new Act('Rest', '0:05:00')
					];
				}

				for(let i = 0; i< acts.length; i++){
					$listFoot.before( displayAct(acts[i].name, acts[i].time, i));
				}

			},

		};

	})();


	//upadate times
	$dig.text(Time.toString());
	schedule.load();
	$cname.text($list.find('#act' + current + ' .aname').eq(0).val());
	$ctime.text($list.find('#act' + current + ' .atime').eq(0).val());
	$('#act' + current).toggleClass('active');

	var interval = setInterval(function () {
		//update time of day
		$dig.text(Time.toString());
		//update remanining time in current activity
		var totalTime = Time.fromString($ctime.text()) - 1000;
		if(totalTime <= 0){
			$('#act' + current).toggleClass('active');
			current += 1;
			$('#act' + current).toggleClass('active');
			if(current >= $('.act').length){ current = 0; }
				$cname.text($list.find('#act' + current + ' .aname').eq(0).val());
				$ctime.text($list.find('#act' + current + ' .atime').eq(0).val());
				totalTime = Time.fromString($ctime.text());
		}else{
			$ctime.text( Time.toString( totalTime ));
		}
		//update future activities
		totalTime += Time.fromString();
		for(let i = current; i < $('.act').length; i++){
			if(i > current) 
				totalTime += Time.fromString($('#act' + i + ' .atime').eq(0).val());
			$('#act' + i + ' .astarttime').eq(0).text(Time.toString(totalTime));
		}
		
	},1000);

	//act constructor
	function Act(name, time){
		this.name = name;
		this.time = time;
	}

	function displayAct(name, time, idnum){
		return $('<div>')
					.attr('id', 'act' + idnum)
					.addClass('act row col-sx-12')
					.html(
						'<div class="col-xs-12 col-md-4">'
						+ '<span><input type="checkbox" class="adone  col-xs-2"></span>'
						+ '<span class="astarttime col-xs-offset-1 col-xs-6">0:00:00</span>'
						+ '</div>'
						+ '<div class="col-xs-12 col-md-8"' 
						+ '<span><input type="text" class="aname col-xs-6" value="' + name + '"></span>' 
						+ '<span><input type="text" class="atime col-xs-6" value="' + time + '"></span>'
						+ '</div>'
);
	}

	//click events
	$('#savebtn').on('click', function(){
		schedule.save();
	});
	$('#resetbtn').on('click', function(){
		$('.act').remove();
		schedule.load(null);
		current = 0;
		$cname.text($list.find('#act' + current + ' .aname').eq(0).val());
		$ctime.text($list.find('#act' + current + ' .atime').eq(0).val());

	});
	$('#addbtn').on('click', function(){
		if($('#addname').val() === '') return;
		if(isNaN(Time.fromString($('#addtime').val()))) return;

		let i = $('.act').length;

		$listFoot.before( displayAct($('#addname').val(), $('#addtime').val(), i));
	});
	$('#moretimebtn').on('click', function(){
		var mills = Time.fromString($ctime.text());
		mills += Time.moreOrLess(mills);
		$ctime.text(Time.toString(mills));
	});
	$('#lesstimebtn').on('click', function(){
		var mills = Time.fromString($ctime.text());
		mills -= Time.moreOrLess(mills);
		if(mills <= 0) mills = 10000;
		$ctime.text(Time.toString(mills));
	});
});