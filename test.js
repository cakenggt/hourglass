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
