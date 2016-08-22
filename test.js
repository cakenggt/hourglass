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

before(function(){
  //reset the test db
  return db.sync({force: true});
});
describe('Test', function(){
  it('test1', function(){
    return models.Job.create({
      title: 'testJob',
      hourlyRate: 0.1,
      taxRate: 0.2
    });
  });
});
