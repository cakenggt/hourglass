//Some useful date utils
var DateUtils = {
  formatDate: function(d) {
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  },

  stringToDate: function(str){
    var dateParts = str.split('-');
    var date = new Date(0);
    date.setFullYear(parseInt(dateParts[0]));
    date.setMonth(parseInt(dateParts[1])-1);
    date.setDate(parseInt(dateParts[2]));
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  },

  isValidDateString: function(str){
    if (!str || typeof str !== 'string'){
      return false;
    }
    var parts = str.split('-');
    if (parts.length !== 3){
      return false;
    }
    for (var i = 0; i < parts.length; i++){
      var part = parts[i];
      var num = parseInt(part);
      if (!Number.isInteger(num)){
        return false;
      }
      //TODO you can do more validation of the date values
    }
    return true;
  }
};

exports.DateUtils = DateUtils;

/**
 * This function validates a job object with options
 * @param {Job} job to validate
 * @param {Object} [options] Optional options object
 * @param {boolean} [needsId] Whether the job requires an id
 */
exports.JobValidator = function(job, options){
  let needsId;
  if (options){
    needsId = options.needsId !== undefined ? options.needsId : true;
  }
  if (typeof job.title !== 'string'){
    return false;
  }
  if (typeof job.hourlyRate !== 'number'){
    return false;
  }
  if (typeof job.taxRate !== 'number'){
    return false;
  }
  if (needsId && typeof job.id !== 'number'){
    return false;
  }
  return true;
};

/**
 * This function validates a Time Entry object with options
 * @param {TimeEntry} timeEntry to validate
 * @param {Object} [options] Optional options object
 * @param {boolean} [needsId] Whether the time entry requires an id
 */
exports.TimeEntryValidator = function(timeEntry, options){
  let needsId;
  if (options){
    needsId = options.needsId !== undefined ? options.needsId : true;
  }
  if (!Number.isInteger(timeEntry.time) || timeEntry.time < 0){
    return false;
  }
  if (!(timeEntry.date instanceof Date)){
    return false;
  }
  if (typeof timeEntry.summary !== 'string'){
    return false;
  }
  if (!Number.isInteger(timeEntry.jobId)){
    return false;
  }
  if (needsId && !Number.isInteger(timeEntry.id)){
    return false;
  }
  return true;
};

/**
 * Parses data into a job object assuming
 * all fields are strings.
 * @param {Object} data Object with all string values
 * @returns {Job} job
 */
exports.JobParser = function(data){
  var id;
  if (data.id && data.id !== 'NEW'){
    id = parseInt(data.id);
  }
  return {
    id: id,
    title: data.title,
    hourlyRate: parseFloat(data.hourlyRate),
    taxRate: parseFloat(data.taxRate)
  };
};

/**
 * Parses data into a time entry object assuming
 * all fields are strings.
 * @param {Object} data Object with all string values
 * @returns {TimeEntry} timeEntry
 */
exports.TimeEntryParser = function(data){
  var date;
  if (data.date){
    date = DateUtils.stringToDate(data.date);
  }
  var id;
  if (data.id && data.id !== 'NEW'){
    id = parseInt(data.id);
  }
  return {
    id: id,
    date: date,
    time: parseInt(data.time),
    summary: data.summary,
    jobId: parseInt(data.jobId)
  };
};
