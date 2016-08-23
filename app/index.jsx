import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link} from 'react-router';
import {render} from 'react-dom';

var stubData = {
  jobs: [
    {
      id: 1,
      title: 'govt job',
      hourlyRate: 4,
      taxRate: 3
    }
  ],
  timeEntries: [
    {
      id: 1,
      time: 5,
      date: '2016-08-23',
      summary: 'some summary text',
      jobId: 1
    }
  ]
}

var TimeSheet = React.createClass({
  render: function() {
    var jobIds = [];
    for (var j = 0; j < this.props.data.jobs.length; j++){
      jobIds.push(this.props.data.jobs[j].id);
    }
    var entries = this.props.data.timeEntries.map(result => {
      return (
        <TimeEntry
          key={result.id}
          data={result}
          jobIds={jobIds}
          changeData={this.props.changeData}/>
      );
    });
    return (
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
          {entries}
        </tbody>
      </table>
    );
  }
});

var TimeEntry = React.createClass({
  getInitialState: function() {
    return {
      editable: false,
      data: this.props.data
    };
  },
  render: function(){
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
                defaultValue={this.state.data.date}
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
          <td>{this.state.data.date.toString()}</td>
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
    data.date = $('#date-'+data.id).val();
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
  render: function() {
    var entries = this.props.data.jobs.map(function(result){
      return (
        <JobEntry key={result.id} data={result} changeData={this.props.changeData}/>
      );
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Hourly Rate</th>
            <th>Tax Rate</th>
          </tr>
        </thead>
        <tbody>
          {entries}
        </tbody>
      </table>
    );
  }
});

var JobEntry = React.createClass({
  render: function(){
    return (
      <tr>
        <td>{this.props.data.id}</td>
        <td>{this.props.data.title}</td>
        <td>${this.props.data.hourlyRate}</td>
        <td>${this.props.data.taxRate}</td>
      </tr>
    )
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
    }
    else if (type == 'Job'){
      entries = this.state.jobs;
      key = 'jobs';
    }
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
