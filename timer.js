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
				console.log(scheduleName);
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
				console.log(scheduleName);
				var acts = JSON.parse(localStorage.getItem(scheduleName));
				if(acts === null || acts.length === 0){
					acts = [
						new Act('Work', '0:25:00'),
						new Act('Rest', '0:05:00')
					];
				}

				for(let i = 0; i< acts.length; i++){
					console.log(acts[i]);
					$list.append($('<div>')
						.attr('id', 'act' + i)
						.addClass('act')
						.html(
							'<input type="text" class="aname" value="' + acts[i].name + '">' 
							+ '<input type="text" class="atime" value="' + acts[i].time + '">')
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
		$dig.text(Time.toString());
		
		var time = Time.fromString($ctime.text()) - 1000;
		if(time <= 0){
			current += 1;
			if(current >= $('.act').lengt){ current = 0}
				$cname.text($list.find('#act' + current + ' .aname').eq(0).val());
				$ctime.text($list.find('#act' + current + ' .atime').eq(0).val());
		}else{
			$ctime.text( Time.toString( time ));
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
});