function calculate() {
  //setup - get input
  var rollover = document.getElementById("rollover").value;
  rollover = rollover.replace('$', ''); //strip $

  var remaining = document.getElementById("remaining").value;
  remaining = remaining.replace('$', '');   //strip $

  var startDate = document.getElementById("startdate").value;
  var endDate = document.getElementById("enddate").value;

  var start = new Date(startDate.substring(6,10), startDate.substring(0, 2) - 1, startDate.substring(3, 5));
  var end = new Date(endDate.substring(6,10), endDate.substring(0, 2) - 1, endDate.substring(3, 5));

  //average calculations
  var dayDiff = Math.floor((end - start) / (1000*60*60*24)) + 1;

  var initial = 0.0;
  switch(document.getElementById("plan").value) {
    case "5+":
        initial = 1300.0;
        break;
    case "10+":
        initial = 650.0;
        break;
    case "14+":
        initial = 350.0;
        break;
    case "20+":
        initial = 250.0;
        break;
    case "plan1":
        initial = 500.0;
        break;
    case "plan2":
        initial = 900.0;
        break;
    case "plan3":
        initial = 1300.0;
        break;
    case "reduced":
        initial = 1858.0;
        break;
    default:
      initial = 2482.0;
  }

  initial += Number(rollover);

  var avgDaily = initial / dayDiff;
  var avgWeekly = avgDaily * 7;

  //current calculations
  var today = new Date();
  var currentDayDiff = Math.floor((end - today) / (1000*60*60*24)) + 1;

  var curDaily = remaining / currentDayDiff;
  var curWeekly = curDaily * 7;

  document.getElementById("avg-daily").innerHTML = "$" + avgDaily.toFixed(2);
  document.getElementById("avg-weekly").innerHTML = "$" + avgWeekly.toFixed(2);
  document.getElementById("cur-daily").innerHTML = "$" + curDaily.toFixed(2);
  document.getElementById("cur-weekly").innerHTML = "$" + curWeekly.toFixed(2);
  document.getElementById("diff-daily").innerHTML = "$" + (curDaily - avgDaily).toFixed(2);
  document.getElementById("diff-weekly").innerHTML = "$" + (curWeekly - avgWeekly).toFixed(2);

  //excess from what you should have spent and the remaining
  document.getElementById("summary").innerHTML = "$" + (remaining - (initial - (avgDaily * (dayDiff - currentDayDiff)))).toFixed(2);

  //debugging
  document.getElementById("initial-text").innerHTML = "initial: " + initial;
  document.getElementById("rollover-text").innerHTML = "rollover: " + rollover;
  document.getElementById("current-text").innerHTML = "current: " + remaining;
  document.getElementById("start-text").innerHTML = "start: " + start;
  document.getElementById("end-text").innerHTML = "end: " + end;
  document.getElementById("dayDiff-text").innerHTML = "day diff: " + dayDiff;
  document.getElementById("currentDayDiff-text").innerHTML = "current day diff: " + currentDayDiff;

}
