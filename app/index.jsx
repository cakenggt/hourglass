import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link} from 'react-router';
import {render} from 'react-dom';

var stubData = {
  jobs: [
    {
      id: 1,
      title: 'govt job',
      hourlyRate: 4.06,
      taxRate: 3.07
    }
  ],
  timeEntries: [
    {
      id: 1,
      time: 5,
      date: new Date(),
      summary: 'some summary text',
      jobId: 1
    }
  ]
};

//TODO remove this line
var globalId = 2;

function formatDate(d) {
  var month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function stringToDate(str){
  var dateParts = str.split('-');
  var date = new Date();
  date.setFullYear(parseInt(dateParts[0]));
  date.setMonth(parseInt(dateParts[1])-1);
  date.setDate(parseInt(dateParts[2]));
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}

var TimeSheet = React.createClass({
  getInitialState: function() {
    return {
      newEntry: false
    };
  },
  render: function() {
    var jobIds = [];
    for (var j = 0; j < this.props.data.jobs.length; j++){
      jobIds.push(this.props.data.jobs[j].id);
    }
    var newTimeEntry = {
      id: 'NEW',
      time: 1,
      date: new Date(),
      summary: 'Summary Text',
      jobId: 1
    };
    var newEntryField = this.state.newEntry ?
      <TimeEntry
        key="new"
        data={newTimeEntry}
        editable="true"
        changeData={this.changeNewData}
        jobIds={jobIds}
        cancel={this.cancel}/> :
      null;
    var entries = this.props.data.timeEntries.map(result => {
      return (
        <TimeEntry
          key={result.id}
          data={result}
          editable="false"
          jobIds={jobIds}
          changeData={this.props.changeData}
          cancel={this.cancel}/>
      );
    });
    return (
      <div>
        <div onClick={this.addJob}>
          Add Time Entry
        </div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Time</th>
              <th>Date</th>
              <th>Summary</th>
              <th>Job Id</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {newEntryField}
            {entries}
          </tbody>
        </table>
      </div>
    );
  },
  addJob: function() {
    this.setState({newEntry: true});
  },
  changeNewData: function(object){
    this.setState({newEntry: false});
    this.props.changeData(object);
  },
  cancel: function(){
    this.setState({newEntry: false});
  }
});

var TimeEntry = React.createClass({
  getInitialState: function() {
    return {
      editable: this.props.editable == 'true',
      data: this.props.data
    };
  },
  render: function(){
    var dateString = formatDate(this.state.data.date);
    if (this.state.editable){
      var id = this.state.data.id;
      var jobIds = this.props.jobIds.map(result => {
        return (
          <option
            key={result}
            value={result}>
            {result}
          </option>
        );
      });
      return (
        <tr>
          <td>{id}</td>
          <td><input
                type="number"
                defaultValue={this.state.data.time}
                id={'time-'+id}
              /></td>
          <td><input
                type="date"
                defaultValue={dateString}
                id={'date-'+id}
              /></td>
          <td><input
                type="text"
                defaultValue={this.state.data.summary}
                id={'summary-'+id}
              /></td>
          <td><select
                id={'jobId-'+id}
                defaultValue={this.state.data.jobId}
              >{jobIds}</select></td>
          <td>
            <span onClick={this.onSave}>Save</span>
          </td>
          <td>
            <span onClick={this.onCancel}>Cancel</span>
          </td>
        </tr>
      )
    }
    else{
      return (
        <tr>
          <td>{this.state.data.id}</td>
          <td>{this.state.data.time}</td>
          <td>{dateString}</td>
          <td>{this.state.data.summary}</td>
          <td>{this.state.data.jobId}</td>
          <td>
            <span onClick={this.onEdit}>Edit</span>
          </td>
          <td>
            <span onClick={this.onDelete}>Delete</span>
          </td>
        </tr>
      )
    }
  },
  onSave: function(){
    var data = this.state.data;
    data.time = parseInt($('#time-'+data.id).val());
    data.date = stringToDate($('#date-'+data.id).val());
    data.summary = $('#summary-'+data.id).val();
    data.jobId = parseInt($('#jobId-'+data.id).val());
    this.setState({editable: false, data: data});
    this.props.changeData({
      type: 'TimeEntry',
      data: this.state.data,
      delete: false
    })
  },
  onCancel: function(){
    this.setState({editable: false});
    this.props.cancel();
  },
  onEdit: function(){
    this.setState({editable: true});
  },
  onDelete: function(){
    this.props.changeData({
      type: 'TimeEntry',
      data: this.state.data,
      delete: true
    });
  }
});

var Jobs = React.createClass({
  getInitialState: function() {
    return {
      newEntry: false
    };
  },
  render: function() {
    var entries = this.props.data.jobs.map(result => {
      return (
        <JobEntry
          key={result.id}
          data={result}
          editable="false"
          changeData={this.props.changeData}
          cancel={this.cancel}/>
      );
    });
    var newJob = {
      id: 'NEW',
      title: 'New Job',
      hourlyRate: 0,
      taxRate: 0
    };
    var newEntryField = this.state.newEntry ?
      <JobEntry
        key="new"
        data={newJob}
        editable="true"
        changeData={this.changeNewData}
        cancel={this.cancel}/> :
      null;
    return (
      <div>
        <div onClick={this.addJob}>
          Add Job
        </div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Hourly Rate</th>
              <th>Tax Rate</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {newEntryField}
            {entries}
          </tbody>
        </table>
      </div>
    );
  },
  addJob: function() {
    this.setState({newEntry: true});
  },
  changeNewData: function(object){
    this.setState({newEntry: false});
    this.props.changeData(object);
  },
  cancel: function(){
    this.setState({newEntry: false});
  }
});

var JobEntry = React.createClass({
  getInitialState: function() {
    return {
      editable: this.props.editable == 'true',
      data: this.props.data
    };
  },
  render: function(){
    if (this.state.editable){
      var id = this.state.data.id;
      return (
        <tr>
          <td>{id}</td>
          <td><input
                type="text"
                defaultValue={this.state.data.title}
                id={'title-'+id}
              /></td>
          <td><input
                type="number"
                step="0.01"
                defaultValue={this.state.data.hourlyRate}
                id={'hourlyRate-'+id}
              /></td>
          <td><input
                type="number"
                step="0.01"
                defaultValue={this.state.data.taxRate}
                id={'taxRate-'+id}
              /></td>
          <td>
            <span onClick={this.onSave}>Save</span>
          </td>
          <td>
            <span onClick={this.onCancel}>Cancel</span>
          </td>
        </tr>
      )
    }
    else{
      return (
        <tr>
          <td>{this.props.data.id}</td>
          <td>{this.props.data.title}</td>
          <td>${this.props.data.hourlyRate}</td>
          <td>${this.props.data.taxRate}</td>
          <td>
            <span onClick={this.onEdit}>Edit</span>
          </td>
          <td>
            <span onClick={this.onDelete}>Delete</span>
          </td>
        </tr>
      )
    }
  },
  onSave: function(){
    var data = this.state.data;
    data.title = $('#title-'+data.id).val();
    data.hourlyRate = parseFloat($('#hourlyRate-'+data.id).val());
    data.taxRate = parseFloat($('#taxRate-'+data.id).val());
    this.setState({editable: false, data: data});
    this.props.changeData({
      type: 'Job',
      data: this.state.data,
      delete: false
    })
  },
  onCancel: function(){
    this.setState({editable: false});
    this.props.cancel();
  },
  onEdit: function(){
    this.setState({editable: true});
  },
  onDelete: function(){
    this.props.changeData({
      type: 'Job',
      data: this.state.data,
      delete: true
    });
  }
});

var Invoice = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Got Questions?</h2>
        <p>The easiest thing to do is post on
          our <a href="http://forum.kirupa.com">forums</a>.</p>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return stubData;
  },
  render: function() {
    return (
      <div>
        <h1>Hourglass</h1>
        <ul className="header">
          <li><IndexLink to="/" activeClassName="active">Time Sheet</IndexLink></li>
          <li><Link to="/jobs" activeClassName="active">Jobs</Link></li>
          <li><Link to="/invoice" activeClassName="active">Invoice</Link></li>
        </ul>
        <div className="content">
          {React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              data: this.state,
              changeData: this.changeData
            });
          })}
        </div>
      </div>
    );
  },
  changeData: function(object){
    var type = object.type;
    var data = object.data;
    var del = object.delete;
    var entries;
    var key;
    if (type == 'TimeEntry'){
      entries = this.state.timeEntries;
      key = 'timeEntries';
      //TODO validate the time entry and return if bad
    }
    else if (type == 'Job'){
      entries = this.state.jobs;
      key = 'jobs';
      //TODO validate the job and return if bad
    }
    //TODO send ajax update or create or delete
    if (data.id !== 'NEW'){
      for (var i = 0; i < entries.length; i++){
        var result = entries[i];
        if (result.id === data.id){
          if (del){
            delete entries[i];
          }
          else{
            entries[i] = data;
          }
          var state = {};
          state[key] = entries;
          this.setState(state);
          return;
        }
      }
    }
    else {
      //create record
      //TODO remove this line
      data.id = globalId++;
      entries.push(data);
      var state = {};
      state[key] = entries;
      this.setState(state);
    }
  }
});

render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={TimeSheet}/>
      <Route path="jobs" component={Jobs}/>
      <Route path="invoice" component={Invoice}/>
    </Route>
  </Router>,
  document.getElementById('app'));
