"use strict";

//global variables
var planName = "all";
var initial = 0;
var rollover = 0;
var remaining = 0;
var dayDiff = 0;
var totalDaysOff = 0;
var pastDaysOff = 0;
var startDate = "01/24/2016";
var endDate = "05/20/2016";
var start, end, today;

//snackbar variables
var notification = document.querySelector('.mdl-js-snackbar');
var data;

//runs startup commands
function startUp() {
    //hide results
    hideResults();

    //restore saved fields
    restoreFields();

    //show or hide custom debit field as needed
    planSelected();

    //calculate numbers and set fields
    calculateAndSet();
}

//saves input
function saveFields() {
    localStorage.setItem("planName", planName);
    localStorage.setItem("initial", initial);
    localStorage.setItem("rollover", rollover);
    localStorage.setItem("remaining", remaining);
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);
    localStorage.setItem("dayDiff", dayDiff);
    localStorage.setItem("totalDaysOff", totalDaysOff);
    localStorage.setItem("pastDaysOff", pastDaysOff);
}

//restores saved input
function restoreFields() {
    //read saved values if not null
    if (localStorage.getItem("planName") != null) {
        planName = localStorage.getItem("planName");
    }

    if (localStorage.getItem("initial") != null) {
        initial = localStorage.getItem("initial");
    }

    if (localStorage.getItem("rollover") != null) {
        rollover = localStorage.getItem("rollover");
    }

    if (localStorage.getItem("remaining") != null) {
        remaining = localStorage.getItem("remaining");
    }

    if (localStorage.getItem("startDate") != null) {
        startDate = localStorage.getItem("startDate");
    }

    if (localStorage.getItem("endDate") != null) {
        endDate = localStorage.getItem("endDate");
    }

    if (localStorage.getItem("dayDiff") != null) {
        dayDiff = localStorage.getItem("dayDiff");
    }

    if (localStorage.getItem("totalDaysOff") != null) {
        totalDaysOff = localStorage.getItem("totalDaysOff");
    }

    if (localStorage.getItem("pastDaysOff") != null) {
        pastDaysOff = localStorage.getItem("pastDaysOff");
    }

    //set fields, need to set class "is-dirty" to make labels float
    //if custom, show custom field and fill it in
    if (planName == "custom") {
        document.getElementById("plan").value = planName;
        planSelected();
        document.getElementById("custom-debit").value = String(initial - rollover);
        $("#custom-debit").parent().addClass("is-dirty");
    } else { //otherwise, set plan normally
        document.getElementById("plan").value = planName;
        planSelected();
    }

    //only fill in rollover and remaining if something was saved
    if (rollover != 0) {
        document.getElementById("rollover").value = String(rollover);
        $("#rollover").parent().addClass("is-dirty");
    }

    if (remaining != 0) {
        document.getElementById("remaining").value = String(remaining);
        $("#remaining").parent().addClass("is-dirty");
    }

    document.getElementById("start-date").value = String(startDate);
    $("#start-date").parent().addClass("is-dirty");

    document.getElementById("end-date").value = String(endDate);
    $("#end-date").parent().addClass("is-dirty");

    if (totalDaysOff != 0) {
        document.getElementById("total-days-off").value = String(totalDaysOff);
        $("#total-days-off").parent().addClass("is-dirty");
    }

    if (pastDaysOff != 0) {
        document.getElementById("past-days-off").value = String(pastDaysOff);
        $("#past-days-off").parent().addClass("is-dirty");
    }
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
}

//get the initial debit from dropdown menu
function getInitial() {
    planName = document.getElementById("plan").value;
    switch(planName) {
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
            message: 'The initial debit must be a positive number.',
            timeout: 8000
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
            message: 'The rollover must be a positive number.',
            timeout: 8000
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
            message: 'The remaining must be a positive number.',
            timeout: 8000
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
            timeout: 8000
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
            timeout: 8000
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
            timeout: 8000
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
    if ( getDateDiff(start, today) < 0 || getDateDiff(end, today) > 0 ) {
        data = {
            message: 'Today is not in the date range and some calculations may be off.',
            timeout: 8000
        };
        notification.MaterialSnackbar.showSnackbar(data);
    }
}

//checks if the total days off value is valid
function totalDaysOffIsValid() {
    if (! /[0-9]*/.test(String(totalDaysOff))) {
        data = {
            message: 'The total days off must be a positive whole number.',
            timeout: 8000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return false;
    }

    return true;
}

//checks if the past days off value is valid
function pastDaysOffIsValid() {
    if (! /[0-9]*/.test(String(pastDaysOff))) {
        data = {
            message: 'The past days off must be a positive whole number.',
            timeout: 8000
        };
        notification.MaterialSnackbar.showSnackbar(data);
        hideResults();
        return false;
    }

    return true;
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
    //validate rollover, end if not
    if (!rolloverIsValid()) {
        return;
    }

    //add rollover to initial
    initial += Number(rollover);

    remaining = document.getElementById("remaining").value;
    //validate remaining, end if not
    if (!remainingIsValid()) {
        return;
    }

    startDate = document.getElementById("start-date").value;
    //validate startDate, end if not
    if (!startDateIsValid()) {
        return;
    }

    endDate = document.getElementById("end-date").value;
    //validate endDate, end if not
    if (!endDateIsValid()) {
        return;
    }

    totalDaysOff = document.getElementById("total-days-off").value;
    //validate totalDaysOff, end if not
    if (!totalDaysOffIsValid()) {
        return;
    }

    pastDaysOff = document.getElementById("past-days-off").value;
    //validate pastDaysOff, end if not
    if (!pastDaysOffIsValid()) {
        return;
    }

    //calculate and set values
    calculateAndSet();
}

//calculates the values and sets them in their places
function calculateAndSet() {
    //convert date Strings to Dates
    start = new Date(startDate.substring(6, 10), startDate.substring(0, 2) - 1, startDate.substring(3, 5));
    end = new Date(endDate.substring(6, 10), endDate.substring(0, 2) - 1, endDate.substring(3, 5));

    dayDiff = getDateDiff(start, end);
    //make sure end date after start date, end if not
    if (!endDateIsAfterStartDate()) {
        return;
    }

    //remove total days off from dayDiff
    dayDiff -= totalDaysOff;

    var avgDaily = getDaily(initial, dayDiff);
    var avgWeekly = getWeekly(initial, dayDiff);

    today = new Date();
    var currentDayDiff = getDateDiff(today, end);
    //warn if today not in date range
    checkIfTodayInRange();

    //remove past days off from currentDayDiff
    currentDayDiff -= pastDaysOff;

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

    //show results
    showResults();

    //save input
    saveFields();

    //debugging
    document.getElementById("initial-text").innerHTML = "initial: " + initial;
    document.getElementById("rollover-text").innerHTML = "rollover: " + rollover;
    document.getElementById("current-text").innerHTML = "remaining: " + remaining;
    document.getElementById("start-text").innerHTML = "start: " + start;
    document.getElementById("end-text").innerHTML = "end: " + end;
    document.getElementById("dayDiff-text").innerHTML = "day diff: " + dayDiff;
    document.getElementById("currentDayDiff-text").innerHTML = "current day diff: " + currentDayDiff;
    document.getElementById("total-days-off-text").innerHTML = "total days off: " + totalDaysOff;
    document.getElementById("past-days-off-text").innerHTML = "past days off: " + pastDaysOff;
}

//when key pressed, calculate if enter
function calculateIfEnter() {
    if (event.keyCode == 13) {
        calculate();
    }
}

//when clicking on help
function help() {
    $("span.ui-dialog-title").text('Help');
    document.getElementById("dialog-text").innerHTML = "Hover over elements for descriptive hints.<br />" +
        "If you have any questions, bug reports, or suggestions, contact: alderferstudios@gmail.com.<br />" +
        "You can also submit these as issues on the Github repo.<br />" +
        "Please include your browser and version with any bug reports.";
    $( "#dialog" ).dialog('open');
}

//when clicking on about
function about() {
    $("span.ui-dialog-title").text('About');
    document.getElementById("dialog-text").innerHTML = "RIT Debit Splitter by Alderfer Studios.<br />" +
        "Browser support is based on what the design library (MDL) can support. These browsers are:<br />" +
        "-Chrome<br />" +
        "-Edge<br />" +
        "-Firefox<br />" +
        "-Opera<br />" +
        "-Internet Explorer 11+<br />" +
        "-Safari 8+<br />" +
        "-Mobile Safari 8+";
    $( "#dialog" ).dialog('open');
}

//when clicking on source
function source() {
    $("span.ui-dialog-title").text('Source');
    document.getElementById("dialog-text").innerHTML = "This site is open source. You can find it here: https://github.com/BenAlderfer/rit-debit-splitter-web.";
    $( "#dialog" ).dialog('open');
}

//when page loaded, run start up items
$( document ).ready( function() {
    startUp();
});

//assign datepickers to date fields
$(function() {
    $( "#start-date" ).datepicker();
    $( "#end-date" ).datepicker();
    $( "#dialog" ).dialog({ modal: true});
    $( "#dialog" ).dialog('close');
});