$(document).ready(function () {
	console.log("flex ready");

	var $tfoot = $('tfoot');
	var $dig = $('#dig');

	var acts = (function(){
		var arr = [];

		return {
			length: function(){ return arr.length },
			push: function(obj){ 
				arr.push(obj);
				localStorage.setItem("acts", JSON.stringify(arr));
			},
			pop: function(){ 
				var temp = arr.pop();
				localStorage.setItem("acts", JSON.stringify(arr));
				return temp;
			},
			get: function(index){
				return arr[index];
			},
			clear: function(){
				localStorage.setItem("acts", null);
				arr = [];
			},
			display: function(){
				var old = JSON.parse(localStorage.getItem("acts"));
				if(old === null || old.length === 0) return;

				for(let a of old){
					if(a.hasOwnProperty('$obj')){
						//console.log(a);
						//actName, done, dTime, fixed, sTime
						let newAct = new Act(
							a.name, 
							a.done, 
							parseInt(a.dTime),
							a.fixed,
							parseInt(a.sTime),
						);
						$tfoot.before(newAct.$obj);					
					}else{
						console.log('missing $obj');
					}

				} 
			},
			save: function(){
				localStorage.setItem("acts", JSON.stringify(arr));
			},
			list: function(){
				var old = JSON.parse(localStorage.getItem("acts"));
				if(old === null || old.length === 0) return;

				for(let a of old){
					if(a.hasOwnProperty('$obj')){
						console.log(a);				
					}else{
						console.log('missing $obj');
					}

				} 
			},
		};
	})();

	acts.display();

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

	var interval = setInterval(function(){
		var time = new Time();
		$dig.text(time.toString());
	}, 1000);
	

	//add act button click
	$('#addact').on('click', function(){
		event.stopPropagation();

		//actName, done, dTime, fixed, sTime
		var newAct = new Act(
			$('#newact').val(),
			false, //done
			$('#newdtime').val(),
			$('#newfixed').is(':checked'),
			$('#newstime').val(),
		);
		$tfoot.before(newAct.$obj);
	});

	//clear button click
	$('#clear').on('click', function(){
		event.stopPropagation();
		
		acts.clear();
		$('.act').remove();

	});

	//save button click
	$('#save').on('click', function(){
		event.stopPropagation();
		//console.log(acts.lists);
	});

	//done checkbox click
	$('#lists').on('click', '.done', function(event){
		event.stopPropagation();
		let $this = $(this);

		$this.attr('checked', !$this.is(':checked'));
		$this.parent().siblings('.actname').toggleClass('crossout');
		
		let index = parseInt($this.parent().parent().attr('id').substring(5));
		let act = acts.get(index);
		act.done = $this.is(':checked');
		acts.save();
	});


	//fixed checkbox click
	$('#lists').on('click', '.fixed', function(event){
		event.stopPropagation();
		let $this = $(this);

		$this.attr('checked', !$this.is(':checked'));
		//$this.parent().siblings('.actname').toggleClass('crossout');
		
		let index = parseInt($this.parent().parent().attr('id').substring(5));
		let act = acts.get(index);
		act.fixed = $this.is(':checked');
		acts.save();
	});

	function Act(actName, done = false, dTime = 18000, fixed = false, sTime = 0) {
		this.id = acts.length();
		this.name = actName;
		this.done = done;
		this.dTime = dTime;
		this.fixed = fixed;
		this.sTime = sTime;
		this.$obj = $('<tr>', {
			id: 'actid' + this.id,
			class: 'act',
			html: '<td><input type="checkbox" class="done"></td>'
			+ '<td class="stime">' + this.sTime + '</td>'
			+ '<td><input type="checkbox" class="fixed"></td>'
			+ '<td class="actname">' + this.name + '</td>'
			+ '<td class="dtime">' + this.dTime + '</td>'
			},);
		if(this.done){
			this.$obj.find('.done').prop('checked', true);
			this.$obj.children().addClass('crossout');
		}
		if(this.fixed){
			this.$obj.find('.fixed').prop('checked', true);
		}

		acts.push(this);
	}

});