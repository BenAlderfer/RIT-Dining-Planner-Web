var headerHtml = $("#material-header-holder .ui-datepicker-material-header");

var changeMaterialHeader = function(header, date) {
  var year = date.format('YYYY');
  var month = date.format('MMM');
  var dayNum = date.format('D');
  var isoDay = date.isoWeekday();

  var weekday = new Array(7);
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  weekday[7] = "Sunday";

  $('.ui-datepicker-material-day', header).text(weekday[isoDay]);
  $('.ui-datepicker-material-year', header).text(year);
  $('.ui-datepicker-material-month', header).text(month);
  $('.ui-datepicker-material-day-num', header).text(dayNum);
};

$.datepicker._selectDateOverload = $.datepicker._selectDate;
$.datepicker._selectDate = function(id, dateStr) {
  var target = $(id);
  var inst = this._getInst(target[0]);
  inst.inline = true;
  $.datepicker._selectDateOverload(id, dateStr);
  inst.inline = false;
  this._updateDatepicker(inst);

  headerHtml.remove();
  $(".ui-datepicker").prepend(headerHtml);
};

$("input[data-type='date']").on("focus", function() {
  $(".ui-datepicker").prepend(headerHtml);
});

$("input[data-type='date']").datepicker({
  showButtonPanel: true,
  closeText: 'OK',
  onSelect: function(date, inst) {
    changeMaterialHeader(headerHtml, moment(date, 'MM/DD/YYYY'));
  },
});

changeMaterialHeader(headerHtml, moment());
$('input').datepicker('show');
