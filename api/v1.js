'use strict';

const prefix = '/api/v1/';
const Validator = require('../app/Validator');

module.exports = function(options){

  let app = options.app;
  let models = options.models;

  app.post(prefix+'timeEntry', function(req, res){
    //create and return id
    var timeEntry = Validator.TimeEntryParser(req.body);
    if (!Validator.TimeEntryValidator(timeEntry, {
      needsId: false
    })){
      console.log('creation failed for', timeEntry);
      res.json({});
      res.end();
      return;
    }
    models.TimeEntry.create(timeEntry)
    .then(function(result){
      res.json({
        id: result.dataValues.id
      });
      res.end();
    });
  });

  app.get(prefix+'timeEntry:id', function(req, res){
    //read
    models.TimeEntry.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(function(result){
      if (!result){
        res.json({});
        res.end();
        return;
      }
      var timeEntry = result.get({
        plain: true
      });
      timeEntry.date = Validator.DateUtils.formatDate(timeEntry.date);
      res.json(timeEntry);
      res.end();
    });
  });

  app.put(prefix+'timeEntry', function(req, res){
    //update and return success value
    var timeEntry = Validator.TimeEntryParser(req.body);
    if (!Validator.TimeEntryValidator(timeEntry, {
      needsId: false
    })){
      console.log('update failed for', timeEntry);
      res.json({
        success: false
      });
      res.end();
      return;
    }
    models.TimeEntry.update(
      timeEntry,
      {
      where: {
        id: timeEntry.id
      }
    })
    .then(function(result){
      res.json({
        success: result[0] === 1
      });
      res.end();
    });
  });

  app.delete(prefix+'timeEntry:id', function(req, res){
    //delete and return success value
    models.TimeEntry.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(function(result){
      return result.destroy();
    })
    .then(function(result){
      res.json({
        success: result === 1
      });
      res.end();
    });
  });

  app.post(prefix+'job', function(req, res){
    //create and return id
    var job = Validator.JobParser(req.body);
    if (!Validator.JobValidator(job, {
      needsId: false
    })){
      console.log('create failed for', job);
      res.json({});
      res.end();
      return;
    }
    models.Job.create(job)
    .then(function(result){
      res.json({
        id: result.dataValues.id
      });
      res.end();
    });
  });

  app.get(prefix+'job:id', function(req, res){
    //read
    models.Job.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(function(result){
      if (!result){
        res.json({});
        res.end();
        return;
      }
      var job = result.get({
        plain: true
      });
      res.json(job);
      res.end();
    });
  });

  app.put(prefix+'job', function(req, res){
    //update and return success value
    var job = Validator.JobParser(req.body);
    if (!Validator.JobValidator(job, {
      needsId: false
    })){
      console.log('update failed for', job);
      res.json({
        success: false
      });
      res.end();
      return;
    }
    models.Job.update(
      job,
      {
      where: {
        id: job.id
      }
    })
    .then(function(result){
      res.json({
        success: result[0] === 1
      });
      res.end();
    });
  });

  app.delete(prefix+'job:id', function(req, res){
    //delete and return success value
    models.Job.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(function(result){
      return result.destroy();
    })
    .then(function(result){
      res.json({
        success: result === 1
      });
      res.end();
    });
  });

  app.get(prefix+'all', function(req, res){
    models.TimeEntry.findAll()
    .then(function(timeEntries){
      var totalJson = {jobs: [], timeEntries: []};
      for (var t = 0; t < timeEntries.length; t++){
        var timeEntry = timeEntries[t].get({
          plain: true
        });
        timeEntry.date = Validator.DateUtils.formatDate(timeEntry.date);
        totalJson.timeEntries.push(timeEntry);
      }
      return models.Job.findAll()
      .then(function(jobs){
        for (var j = 0; j < jobs.length; j++){
          var job = jobs[j].get({
            plain: true
          });
          totalJson.jobs.push(job);
        }
        res.json(totalJson);
        res.end();
      });
    });
  });

};
