$(document).ready(function(){
	//global variables 
	var $dig = $('#dig');
	var $cname = $('#cname');
	var $ctime = $('#ctime');
	var $list = $('#list');
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
					$list.append($('<div>')
						.attr('id', 'act' + i)
						.addClass('act')
						.html(
							'<input type="text" class="aname" value="' + acts[i].name + '">' 
							+ '<input type="text" class="atime" value="' + acts[i].time + '">'
							+ '<span class="aendtime">0:00:00</span>'
							+ '<input type="checkbox" class="adone">')
					);
				}

			},

		};

	})();


	//upadate times
	$dig.text(Time.toString());
	schedule.load();
	$cname.text($list.find('#act' + current + ' .aname').eq(0).val());
	$ctime.text($list.find('#act' + current + ' .atime').eq(0).val());

	var interval = setInterval(function () {
		//update time of day
		$dig.text(Time.toString());
		//update remanining time in current activity
		var totalTime = Time.fromString($ctime.text()) - 1000;
		if(totalTime <= 0){
			current += 1;
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
			$('#act' + i + ' .aendtime').eq(0).text(Time.toString(totalTime));
		}
		
	},1000);

	//act constructor
	function Act(name, time){
		this.name = name;
		this.time = time;
	}

	//click events
	$('#savebtn').on('click', function(){
		schedule.save();
	});
	$('#addbtn').on('click', function(){
		if($('#addname').val() === '') return;
		if(isNaN(Time.fromString($('#addtime').val()))) return;

		let i = $('.act').length;

		$list.append($('<div>')
			.attr('id', 'act' + i)
			.addClass('act')
			.html(
				'<input type="text" class="aname" value="' + $('#addname').val() + '">' 
				+ '<input type="text" class="atime" value="' + $('#addtime').val() + '">'
				+ '<span class="aendtime">0:00:00</span>'
				+ '<input type="checkbox" class="adone">')
		);
	});
});