$(document).ready(function () {
	console.log("flex ready");

	var $tfoot = $('tfoot');
	var acts = (function(){
		var arr = JSON.parse(localStorage.getItem("acts"));
		if(arr === null) arr = [];

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
			clear: function(){
				localStorage.setItem("acts", null);
				arr = [];
			},
			set: function(){

			}
		};
	})();

	//add act button click
	$('#addact').on('click', function(){
		event.stopPropagation();

		var newAct = new Act($('#newact').val());
	});

	//clear button click
	$('#clear').on('click', function(){
		event.stopPropagation();
		
		acts.clear();
		$('.act').remove();

	});

	//done checkbox click
	$('#lists').on('click', function(event){
		event.stopPropagation();
		console.log(acts);
	});

	function Act(actName) {
		this.id = acts.length();
		acts.push(this);
		this.name = actName;
		this.done = false;
		this.$obj = $('<tr>', {
			id: 'actid' + this.id,
			class: 'act',
			 html: '<td><input type="checkbox" class="done"></td>'
			 + '<td class="actname">' + this.name + '</td>',});
		$tfoot.before(this.$obj);
	}
});