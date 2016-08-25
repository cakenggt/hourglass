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
    var jobs = this.props.data.jobs;
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
        jobs={jobs}
        cancel={this.cancel}
        className='altTableRow'/> :
      null;
    var entries = this.props.data.timeEntries.map((result, i) => {
      var className = i%2 == 0 ? 'tableRow' : 'altTableRow';
      return (
        <TimeEntry
          key={result.id}
          data={result}
          editable={false}
          jobs={jobs}
          changeData={this.props.changeData}
          cancel={this.cancel}
          className={className}/>
      );
    });
    var addTimeOrAddJob = this.props.data.jobs.length === 0 ? (
      <Link to="/jobs">
        You must add a job to add a time entry. Go to Jobs
      </Link>
    ) :
    (
      <div
        className="add-button"
        onClick={this.addTimeEntry}>
        Add Time Entry
      </div>
    );
    return (
      <div
        className="tableContainer">
        {addTimeOrAddJob}
        <table>
          <thead>
            <tr>
              <th style={{width: '20%'}}>Time</th>
              <th style={{width: '20%'}}>Date</th>
              <th style={{width: '30%'}}>Summary</th>
              <th style={{width: '20%'}}>Job</th>
              <th style={{width: '5%'}}></th>{/*Edit*/}
              <th style={{width: '5%'}}></th>{/*Delete*/}
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
  addTimeEntry: function() {
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
      var jobs = this.props.jobs.map(result => {
        return (
          <option
            key={result.id}
            value={result.id}>
            {result.title}
          </option>
        );
      });
      return (
        <tr
          className={this.props.className}
        >
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
              >{jobs}</select></td>
          <td>
            <i
              className="material-icons"
              onClick={this.onSave}
              title="Save">
              done
            </i>
          </td>
          <td>
            <i
              className="material-icons"
              onClick={this.onCancel}
              title="Cancel">
              clear
            </i>
          </td>
        </tr>
      )
    }
    else{
      var job;
      for (var i = 0; i < this.props.jobs.length; i++){
        var j = this.props.jobs[i];
        if (j.id === this.state.data.jobId){
          job = j;
          break;
        }
      }
      return (
        <tr
          className={this.props.className}
        >
          <td>{this.state.data.time}</td>
          <td>{dateString}</td>
          <td>{this.state.data.summary}</td>
          <td>{job.title}</td>
          <td>
            <i
              className="material-icons"
              onClick={this.onEdit}
              title="Edit">
              mode_edit
            </i>
          </td>
          <td>
            <i
              className="material-icons"
              onClick={this.onDelete}
              title="Delete">
              delete
            </i>
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
