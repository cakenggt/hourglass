'use strict';

const prefix = '/api/v1/';

module.exports = function(options){

  let app = options.app;
  let models = options.models;

  app.post(prefix+'timeEntry', function(req, res){
    //create and return created record
  });

  app.get(prefix+'timeEntry:id', function(req, res){
    //read
  });

  app.put(prefix+'timeEntry', function(req, res){
    //update and return success value
  });

  app.delete(prefix+'timeEntry:id', function(req, res){
    //delete and return success value
  });

  app.post(prefix+'job', function(req, res){
    //create and return created record
  });

  app.get(prefix+'job:id', function(req, res){
    //read
  });

  app.put(prefix+'job', function(req, res){
    //update and return success value
  });

  app.delete(prefix+'job:id', function(req, res){
    //delete and return success value
  });

};
