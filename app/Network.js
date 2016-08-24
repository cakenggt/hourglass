//TODO for TimeEntry, convert date to string
const Validator = require('./Validator');

exports.delete = function(component, id, type){
  var routeType = '';
  if (type === 'TimeEntry'){
    routeType = 'timeEntry';
  }
  else if (type === 'Job'){
    routeType = 'job';
  }
  var route = '/api/v1/'+routeType+'/'+id;
  return $.ajax({
    url: route,
    type: 'DELETE'
  })
  .then(function(response){
    return getAll(component);
  });
};

exports.update = function(component, record, type){
  var routeType = '';
  if (type === 'TimeEntry'){
    record.date = Validator.DateUtils.formatDate(record.date);
    routeType = 'timeEntry';
  }
  else if (type === 'Job'){
    routeType = 'job';
  }
  var route = '/api/v1/'+routeType;
  return $.ajax({
    url: route,
    type: 'PUT',
    data: record
  })
  .then(function(response){
    return getAll(component);
  });
};

exports.create = function(component, state, key, record, type){
  var routeType = '';
  if (type === 'TimeEntry'){
    record.date = Validator.DateUtils.formatDate(record.date);
    routeType = 'timeEntry';
  }
  else if (type === 'Job'){
    routeType = 'job';
  }
  var route = '/api/v1/'+routeType;
  return $.ajax({
    url: route,
    type: 'POST',
    data: record
  })
  .then(function(response){
    if (response.id !== undefined){
      for (var e = 0; e < state[key].length; e++){
        var element = state[key][e];
        if (element.id === 'NEW'){
          element.id = response.id;
          break;
        }
      }
      component.setState(state);
    }
    return getAll(component);
  });
};

function getAll(component){
  var route = '/api/v1/all';
  return $.ajax({
    url: route,
    type: 'GET'
  })
  .then(function(response){
    if (response.timeEntries && response.jobs){
      for (var t = 0; t < response.timeEntries.length; t++){
        var timeEntry = response.timeEntries[t];
        timeEntry.date = Validator.DateUtils.stringToDate(timeEntry.date);
      }
      //TODO implement sorting
      component.setState({
        jobs: response.jobs,
        timeEntries: response.timeEntries
      });
    }
  });
}

exports.getAll = getAll;
