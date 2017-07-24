$(document).ready(function () {
	console.log("flex ready");

	var $tfoot = $('tfoot');
	var $dig = $('#dig');
	var $current;
	var $currentName = $('#currentname');
	var $currentTime = $('#currenttime');

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
		    if(str === undefined){
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

	$dig.text(Time.toString());

	var interval = setInterval(function(){

		$dig.text(Time.toString());
		let time = Time.fromString($currentTime.text()) - 1000;
		$currentTime.text(Time.toString(time));

	}, 1000);
	
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
						//actName, done, dTime
						let newAct = new Act(
							a.name, 
							a.done, 
							parseInt(a.dTime),
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

	//add act button click
	$('#addact').on('click', function(){
		event.stopPropagation();

		//actName, done, dTime
		var newAct = new Act(
			$('#newact').val(),
			false, //done
			Time.fromString($('#newdtime').val()),
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
		
		let index = parseInt($this.parent().parent().attr('id').substring(5));
		let act = acts.get(index);
		act.fixed = $this.is(':checked');
		acts.save();
	});

	function Act(actName, done = false, dTime = 18000) {
		this.id = acts.length();
		this.name = actName;
		this.done = done;
		this.dTime = dTime;
		this.$obj = $('<tr>', {
			id: 'actid' + this.id,
			class: 'act',
			html: '<td><input type="checkbox" class="done"></td>'
			+ '<td class="actname">' + this.name + '</td>'
			+ '<td class="dtime">' + Time.toString(this.dTime) + '</td>'
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