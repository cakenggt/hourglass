import React from 'react';
import {Link} from 'react-router';
import {DateUtils} from './Validator';

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
        editable={true}
        changeData={this.changeNewData}
        jobIds={jobIds}
        cancel={this.cancel}/> :
      null;
    var entries = this.props.data.timeEntries.map(result => {
      return (
        <TimeEntry
          key={result.id}
          data={result}
          editable={false}
          jobIds={jobIds}
          changeData={this.props.changeData}
          cancel={this.cancel}/>
      );
    });
    var addTimeOrAddJob = this.props.data.jobs.length === 0 ? (
      <Link to="/jobs" activeClassName="active">
        You must add a job to add a time entry. Go to Jobs
      </Link>
    ) :
    (
      <div onClick={this.addJob}>
        Add Time Entry
      </div>
    );
    return (
      <div>
        {addTimeOrAddJob}
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
      editable: this.props.editable,
      data: this.props.data
    };
  },
  render: function(){
    var dateString = DateUtils.formatDate(this.state.data.date);
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
    this.props.cancel();
  },
  onEdit: function(){
    this.setState({editable: true});
  },
  onDelete: function(){
    var data = Object.assign({}, this.state.data);
    data.date = DateUtils.formatDate(data.date);
    this.props.changeData({
      type: 'TimeEntry',
      data: data,
      delete: true
    });
  }
});

exports.TimeSheet = TimeSheet;
exports.TimeEntry = TimeEntry;
