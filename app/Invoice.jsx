import React from 'react';
import {DateUtils} from './Validator';

var Invoice = React.createClass({
  getInitialState: function() {
    return {
      dateBeginning: null,
      dateEnd: null,
      jobId: null
    };
  },
  render: function() {
    var jobIds = [];
    var jobMap = {};
    for (var j = 0; j < this.props.data.jobs.length; j++){
      jobIds.push(this.props.data.jobs[j].id);
      jobMap[this.props.data.jobs[j].id] = this.props.data.jobs[j];
    }
    var dateBeginning = DateUtils.isValidDateString(this.state.dateBeginning) ?
      DateUtils.stringToDate(this.state.dateBeginning) :
      null;
    var dateEnd = DateUtils.isValidDateString(this.state.dateEnd) ?
      DateUtils.stringToDate(this.state.dateEnd) :
      null;
    var jobId = this.state.jobId;
    var job = jobMap[jobId];
    var jobIdElements = jobIds.map(result => {
      return (
        <option
          key={result}
          value={result}>
          {result}
        </option>
      );
    });
    jobIdElements.unshift(
      <option
      key="empty"
      value={null}></option>
    );
    return (
      <div>
        <div className="invoiceHeader">
          Date Beginning:
          <input
            type="date"
            defaultValue={this.state.dateBeginning}
            onChange={this.changeDateBeginning}
            />
          Date End:
          <input
            type="date"
            defaultValue={this.state.dateEnd}
            onChange={this.changeDateEnd}
            />
          Job Id:
          <select
            defaultValue={this.state.jobId}
            onChange={this.changeJobId}
          >{jobIdElements}</select>
        </div>
        <InvoiceDetails
          data={this.props.data}
          dateBeginning={dateBeginning}
          dateEnd={dateEnd}
          jobId={jobId}
          job={job}
        />
      </div>
    );
  },
  changeDateBeginning: function(e){
    this.setState({dateBeginning: e.target.value});
  },
  changeDateEnd: function(e){
    this.setState({dateEnd: e.target.value});
  },
  changeJobId: function(e){
    this.setState({jobId: parseInt(e.target.value)});
  }
});

var InvoiceDetails = React.createClass({
  render: function() {
    var dateBeginning = this.props.dateBeginning;
    var dateEnd = this.props.dateEnd;
    var jobId = this.props.jobId;
    var job = this.props.job;
    var data = this.props.data;
    var timeEntries = data.timeEntries;
    //Sort by date
    timeEntries.sort(function(a, b){
      return a.date-b.date;
    });
    var subtotal = 0;
    var tax = 0;
    var total = 0;
    var shownEntries = [];
    if (job){
      for (var t = 0; t < timeEntries.length; t++){
        var timeEntry = timeEntries[t];
        if (
          (!dateBeginning || timeEntry.date >= dateBeginning) &&
          (!dateEnd || timeEntry.date <= dateEnd) &&
          (!jobId || timeEntry.jobId === jobId)
        ){
          shownEntries.push(timeEntry);
          subtotal += (timeEntry.time/60)*job.hourlyRate;
        }
      }
      tax = subtotal*job.taxRate;
      total = subtotal + tax;
    }
    var invoiceTimeRows = shownEntries.map(result => {
      return (
        <InvoiceTimeRow
          key={result.id}
          time={result.time}
          date={result.date}
          summary={result.summary}
        />
      )
    });
    return (
      <div className="invoiceDetails">
        Entries
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Date</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {invoiceTimeRows}
          </tbody>
        </table>
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>Tax: ${tax.toFixed(2)}</div>
        <div>Total: ${total.toFixed(2)}</div>
      </div>
    );
  }
});

var InvoiceTimeRow = React.createClass({
  render: function(){
    var dateString = DateUtils.formatDate(this.props.date);
    return (
      <tr>
        <td>{this.props.time}</td>
        <td>{dateString}</td>
        <td>{this.props.summary}</td>
      </tr>
    )
  }
});

exports.Invoice = Invoice;
