$(document).ready(function () {
	console.log("flex ready");

	var $tfoot = $('tfoot');
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
						console.log(a);
						let newAct = new Act(a.name, a.done);
						$tfoot.before(newAct.$obj);					
					}else{
						console.log('missing $obj');
					}

				} 
			},
			save: function(){
				localStorage.setItem("acts", JSON.stringify(arr));
			},
		};
	})();

	acts.display();

	//add act button click
	$('#addact').on('click', function(){
		event.stopPropagation();

		var newAct = new Act($('#newact').val());
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

	function Act(actName, done = false) {
		this.id = acts.length();
		this.name = actName;
		this.done = done;
		this.$obj = $('<tr>', {
			id: 'actid' + this.id,
			class: 'act',
			 html: '<td><input type="checkbox" class="done"></td>'
			 + '<td class="actname">' + this.name + '</td>',});
		if(done){
			this.$obj.find('.done').prop('checked', true);
			this.$obj.children().addClass('crossout');

		} 
		acts.push(this);
	}
});