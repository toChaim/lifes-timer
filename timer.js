$(document).ready(function(){
	var Time = (function(){
		var seconds = 1000;
		var minutes = 60 * seconds;
		var hours = 60 * minutes;
		var days = 24 * hours;
		function leadZero(num){
			if(num < 10) return "0" + num;
			else return num;
		}

		return function Time(mills = 0){
			if(mills === 0){
				{let dateObj;
					dateObj = new Date();
					this.mills = dateObj.getTime() - dateObj.getTimezoneOffset() * 60000;
				}
			}else{
				this.mills = mills;
			}

			this.toString = function(){
				var t = this.mills % days;
				var d = Math.floor(t/hours) + ":";
				t %= hours;
				d += leadZero(Math.floor(t/minutes)) + ":";
				t %= minutes;
				d += leadZero(Math.floor(t/seconds));
				return d;
			};
			this.fromString = function(){
				return 0;
			}
		}
	})();


	$clock = $("#clock");
	var time = new Time();
	$clock.find(".time").val(time.toString());
});