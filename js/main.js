//global variables
var initial = 0.0;
var rollover = 0.0;
var remaining = 0.0;
var startDate;
var endDate;
var start;
var end;
var dayDiff;
var today;

//snackbar variables
var notification = document.querySelector('.mdl-js-snackbar');
var data;

//saves input
function saveFields() {
    localStorage.setItem("initial", initial);
    localStorage.setItem("rollover", rollover);
    localStorage.setItem("remaining", remaining);
    localStorage.setItem("start", start);
    localStorage.setItem("end", end);
}

//restores saved input
function restoreFields() {
    //document.getElementById("result").innerHTML = localStorage.getItem("lastname");
    //alert(localStorage.getItem("initial"));
}

//hides the results cards
function hideResults() {
    document.getElementById("summary-card").style.display = 'none';
    document.getElementById("table-card").style.display = 'none';
}

//shows the results cards
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

    //restore saved fields
    restoreFields();
}

//get the initial debit from dropdown menu
function getInitial() {
    switch(document.getElementById("plan").value) {
        case "all":
            return 2482.0;
        case "5+":
            return 1300.0;
        case "10+":
            return 650.0;
        case "14+":
            return 350.0;
        case "20+":
            return 250.0;
        case "plan1":
            return 500.0;
        case "plan2":
            return 900.0;
        case "plan3":
            return 1300.0;
        case "reduced":
            return 1858.0;
        default: //custom
            return Number(document.getElementById("custom-debit").value);
    }
}

//checks if the initial value is valid
function initialIsValid() {
    if (! /[0-9]*[.,]?[0-9]+/.test(String(initial))) {
        data = {
            message: 'The initial debit must be a number with optional $.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return false;
    }

    return true;
}

//checks if the rollover value is valid
function rolloverIsValid() {
    if (rollover != '' && ! /[0-9]*[.,]?[0-9]+/.test(String(rollover))) {
        data = {
            message: 'The rollover must be a number with optional $.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return false;
    }

    return true;
}

//checks if the remaining value is valid
function remainingIsValid() {
    if (! /[0-9]*[.,]?[0-9]+/.test(String(remaining))) {
        data = {
            message: 'The remaining must be a number with optional $.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return false;
    }

    return true;
}

//checks if the start date is valid
function startDateIsValid() {
    if (! /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(String(startDate))) {
        data = {
            message: 'The start date should be in form MM/DD/YYYY.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
    }

    return true;
}

//checks if the end date is valid
function endDateIsValid() {
    if (! /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(String(endDate))) {
        data = {
            message: 'The end date should be in form MM/DD/YYYY.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
    }

    return true;
}

//checks if the end date is after the start date
function endDateIsAfterStartDate() {
    if (dayDiff < 1) {
        data = {
            message: 'The end date should be at least 1 day after the start date.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return false;
    }

    return true;
}

//gets the day difference between two dates
function getDateDiff(startingDate, endingDate){
    return Math.floor((endingDate - startingDate) / (1000 * 60 * 60 * 24)) + 1;
}

//calculates the daily amount
function getDaily(amount, diffInDays) {
    return amount / diffInDays;
}

//calculates the weekly amount
function getWeekly(amount, diffInDays) {
    return getDaily(amount, diffInDays) * 7;
}

//checks if today is in the date range
function checkIfTodayInRange() {
    if ( getDateDiff(start, today) < 1) {
        data = {
            message: 'Today is not in the date range and some calculations may be off.',
            timeout: 5000
        };
        notification.MaterialSnackbar.showSnackbar(data);
    }
}

//calculates the summary and table fields
function calculate() {
    //setup - get & check input
    initial = getInitial();

    //validate initial, end if not
    if (!initialIsValid()) {
        return;
    }

    rollover = document.getElementById("rollover").value;
    rollover = rollover.replace('$', ''); //strip $

    //validate rollover, end if not
    if (!rolloverIsValid()) {
        return;
    }

    //add rollover to initial
    initial += Number(rollover);

    remaining = document.getElementById("remaining").value;
    remaining = remaining.replace('$', '');   //strip $

    //validate remaining, end if not
    if (!remainingIsValid()) {
        return;
    }

    startDate = document.getElementById("startdate").value;
    //validate startDate, end if not
    if (!startDateIsValid()) {
        return;
    }

    endDate = document.getElementById("enddate").value;
    //validate endDate, end if not
    if (!endDateIsValid()) {
        return;
    }

    //convert date Strings to Dates
    start = new Date(startDate.substring(6, 10), startDate.substring(0, 2) - 1, startDate.substring(3, 5));
    end = new Date(endDate.substring(6, 10), endDate.substring(0, 2) - 1, endDate.substring(3, 5));

    //done reading input - begin calculations

    //average calculations
    dayDiff = getDateDiff(start, end);

    //make sure end date after start date, end if not
    if (!endDateIsAfterStartDate()) {
        return;
    }

    var avgDaily = getDaily(initial, dayDiff);
    var avgWeekly = getWeekly(initial, dayDiff);

    //current calculations
    today = new Date();
    var currentDayDiff = getDateDiff(today, end);

    //warn if today not in date range
    checkIfTodayInRange();

    var curDaily = getDaily(remaining, currentDayDiff);
    var curWeekly = getWeekly(remaining, currentDayDiff);

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

    //save input
    saveFields();
}

window.onload = planSelected;