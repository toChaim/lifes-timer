//Set variables
var running = false;
var myTime;
var sec = 0;
var currentInterval = 0;
var audio = new Audio('gong-burmese.wav');


//functions

function timerAction() {
    if(sec == 0){
      audio.play();
      varInput = document.getElementById(currentInterval).childNodes[3].innerHTML;
      console.log("varInput='" + varInput + "' =='Restart'=" + (varInput=='Restart'));
      if (varInput == 'Restart'){
        audio.play();
        sec = readTime(document.getElementById(0).childNodes[3].innerHTML);
      }else if (varInput == 'Stop'){
        sec = readTime(document.getElementById(0).childNodes[3].innerHTML);
        startPause();
      }else{
        sec = readTime(varInput);
        currentInterval++;
      }
    }

    //display time
    document.getElementById("display").innerHTML = formatTime(sec);
    sec--;
}

function addTime(seconds, element){
  if(element == 'display'){
    console.log("seconds='" + seconds + "' and element='" + element + "'");
    sec += seconds;
    if(sec < 0 )sec = 0;
    if(sec > 24*60*60)sec = 24*60*60;
    document.getElementById(element).innerHTML = formatTime(sec);
  }else{
    console.log("seconds='" + seconds + "' and element='" + element + "'");
    var varTime = readTime(document.getElementById(element).childNodes[3].innerHTML);
    varTime += seconds;
    if(varTime < 0 )varTime = 0;
    if(varTime > 24*60*60)varTime = 24*60*60;
    document.getElementById(element).childNodes[3].innerHTML = formatTime(varTime);
  }
}

function startPause() {
	if(running){
    		clearInterval(myTime);
            document.getElementById("btnStartPause").innerHTML = "Start";
        }else{
        	myTime = setInterval(function(){ timerAction() }, 500);
            document.getElementById("btnStartPause").innerHTML = "Pause";
        }
        running = !running;
}

//converts second into string for display
function formatTime(seconds){
  var result = Math.floor(seconds/60/60);//hours
  seconds -= result*60*60;
  result += ':' + leadZero(Math.floor(seconds/60))
    + ':' + leadZero(Math.floor(seconds%60));
  return result;

  function leadZero(num){
    return ((num<10)? '0'+num: num);
  }
}

function readTime(str){
  str = str.split(':');
  return parseInt(str[2]) + parseInt(str[1])*60 + parseInt(str[0])*60*60;
}
