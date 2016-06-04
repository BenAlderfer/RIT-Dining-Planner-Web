function hideResults() {
    document.getElementById("summary-card").style.display = 'none';
    document.getElementById("table-card").style.display = 'none';
}

function showResults() {
    document.getElementById("summary-card").style.display = 'block';
    document.getElementById("table-card").style.display = 'block';
}

//if custom plan selected, show custom input line
function planSelected() {
    //hide or show custom debit input
    if (document.getElementById("plan").value == "custom") {
        document.getElementById("custom-debit-form").style.display = 'block';
        document.getElementById("custom-debit-form").style.marginBottom = "-20px";
    } else {
        document.getElementById("custom-debit-form").style.display = 'none';
    }

    //hide results
    hideResults();
}

function calculate() {
    //setup - get input
    var initial = 0.0;
    switch(document.getElementById("plan").value) {
        case "all":
            initial = 2482.0;
            break;
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
        default: //custom
            initial = Number(document.getElementById("custom-debit").value);
    }

    //validate initial
    if (! /[0-9]*[.,]?[0-9]+/.test(String(initial))) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'The debit must be a number with optional $.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return;
    }

    var rollover = document.getElementById("rollover").value;
    rollover = rollover.replace('$', ''); //strip $

    //validate rollover
    if (rollover != '' && ! /[0-9]*[.,]?[0-9]+/.test(String(rollover))) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'The rollover must be a number with optional $.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return;
    }

    var remaining = document.getElementById("remaining").value;
    remaining = remaining.replace('$', '');   //strip $

    //validate remaining
    if (! /[0-9]*[.,]?[0-9]+/.test(String(remaining))) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'The remaining must be a number with optional $.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return;
    }

    var startDate = document.getElementById("startdate").value;
    //validate startDate
    if (! /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(String(startDate))) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'The start date should be in form MM/DD/YYYY.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return;
    }

    var endDate = document.getElementById("enddate").value;
    //validate endDate
    if (! /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(String(endDate))) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'The end date should be in form MM/DD/YYYY.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return;
    }

    var start = new Date(startDate.substring(6, 10), startDate.substring(0, 2) - 1, startDate.substring(3, 5));
    var end = new Date(endDate.substring(6, 10), endDate.substring(0, 2) - 1, endDate.substring(3, 5));

    //average calculations
    var dayDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    //make sure end date after start date
    if (dayDiff < 1) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'The end date should be at least 1 day after the start date.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return;
    }

    initial += Number(rollover);

    var avgDaily = initial / dayDiff;
    var avgWeekly = avgDaily * 7;

    //current calculations
    var today = new Date();
    var currentDayDiff = Math.floor((end - today) / (1000 * 60 * 60 * 24)) + 1;

    //warn if today not in date range
    if ( (Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1) < 1) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'Today is not in the date range and some calculations may be off.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
    }

    var curDaily = remaining / currentDayDiff;
    var curWeekly = curDaily * 7;

    //set table fields
    document.getElementById("avg-daily").innerHTML = "$" + avgDaily.toFixed(2);
    document.getElementById("avg-weekly").innerHTML = "$" + avgWeekly.toFixed(2);
    document.getElementById("cur-daily").innerHTML = "$" + curDaily.toFixed(2);
    document.getElementById("cur-weekly").innerHTML = "$" + curWeekly.toFixed(2);
    document.getElementById("diff-daily").innerHTML = "$" + (curDaily - avgDaily).toFixed(2);
    document.getElementById("diff-weekly").innerHTML = "$" + (curWeekly - avgWeekly).toFixed(2);

    //set summary
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

    //show results
    showResults();
}

window.onload = planSelected;