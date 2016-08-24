import React from 'react';

var Jobs = React.createClass({
  getInitialState: function() {
    return {
      newEntry: false
    };
  },
  render: function() {
    var hasTimeEntries = {};
    for (var t = 0; t < this.props.data.timeEntries.length; t++){
      var timeEntry = this.props.data.timeEntries[t];
      hasTimeEntries[timeEntry.jobId] = true;
    }
    var entries = this.props.data.jobs.map(result => {
      return (
        <JobEntry
          key={result.id}
          data={result}
          hasTimeEntries={hasTimeEntries[result.id] == true}
          editable={false}
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
        hasTimeEntries={false}
        editable={true}
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
      editable: this.props.editable,
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
    var del = true;
    if (this.props.hasTimeEntries){
      del = confirm(`This Job has associated time entries that will be deleted if this is deleted.

Do you wish to proceed?`);
    }
    if (del){
      var data = Object.assign({}, this.state.data);
      this.props.changeData({
        type: 'Job',
        data: data,
        delete: true
      });
    }
  }
});

exports.Jobs = Jobs;
exports.JobEntry = JobEntry;
