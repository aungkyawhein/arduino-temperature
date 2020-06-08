
var socket = io();

function readData(data) {
  
  // celsius and fahrenheit
  var cel = data;
  var ferh = parseFloat((data*9)/5 + 32).toFixed(2);
  
  // write data
  document.getElementById('showTemp').innerHTML = cel;
  document.getElementById('showFerh').innerHTML = ferh;

  // same light as in Arduino LED
  if(data > 29 ) {
    // hot red
    // pin 8 is connected to red
    // digitalWrite(8, HIGH);
    document.getElementById('showTemp').style.color = "red";
    document.getElementById('temperature').style.color = "red";
  }else if( data > 28 && data < 29) {
    // normal green
    // pin 9 is connected to green
    // digitalWrite(9, HIGH);
    document.getElementById('showTemp').style.color = "green";
    document.getElementById('temperature').style.color = "green";
  }else {
    // low blue
    // pin 10 is connected to blue
    // digitalWrite(10, HIGH);
    document.getElementById('showTemp').style.color = "blue";
    document.getElementById('temperature').style.color = "blue";
  }

  // clock
  document.getElementById("time").innerHTML = (new Date()).toLocaleTimeString();
}

// call function with socket
socket.on('message', readData);
