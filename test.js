/*jshint expr: true*/
/*jslint mocha: true*/

//TODO
//Too large number of minutes
//Minutes is 0, negative
//Summary of work is too long or null
//Date of entry is invalid
//Associated job is null
//Title of job is too long or empty
//Hourly rate of job is 0 or negative
//Tax rate of job is 0 or negative
//Make sure to show timezone when displaying date

let credentials = require('./credentials');
const Sequelize = require('sequelize');
const db = new Sequelize(credentials.TEST_DATABASE_URL, {
  logging: console.log
});
const models = db.import(__dirname + '/models');
const Validator = require('./app/Validator');

var expect = require('chai').expect;

let testJob = {
  title: 'testJob',
  hourlyRate: 0.1,
  taxRate: 0.2
};
let testJobId = null;
let testTimeEntry = {
  time: 3,
  date: new Date(),
  summary: 'did some work'
};
let testTimeEntryId = null;

before(function(){
  //reset the test db
  return db.sync({force: true});
});
describe('object creation and deletion', function(){
  it('create test job', function(){
    return models.Job.create(testJob)
    .then(function(result){
      testJobId = result.dataValues.id;
    });
  });
  it('create test time entry', function(){
    return models.Job.findOne({
      where: {
        id: testJobId
      }
    })
    .then(function(job){
      return job.createTimeEntry(testTimeEntry)
      .then(function(result){
        testTimeEntryId = result.dataValues.id;
        expect(result.dataValues.date).to.be.an.instanceof(Date);
      });
    });
  });
  it('get all', function(){
    return models.TimeEntry.findAll()
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
        expect(totalJson.timeEntries).to.have.length(1);
        expect(totalJson.jobs).to.have.length(1);
        console.log(totalJson);
      });
    });
  });
  it('delete job', function(){
    return models.Job.destroy({
      where: {
        id: testJobId
      }
    })
    .then(function(){
      return models.TimeEntry.findOne({
        where: {
          id: testTimeEntryId
        }
      })
      .then(function(timeEntry){
        expect(timeEntry).to.not.exist;
      });
    });
  });
});
