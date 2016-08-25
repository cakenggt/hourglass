import React from 'react';
import {DateUtils} from './Validator';
import AsciiTable from 'ascii-table';

var Invoice = React.createClass({
  getInitialState: function() {
    var todayStr = DateUtils.formatDate(new Date());
    return {
      dateBeginning: todayStr,
      dateEnd: todayStr,
      jobId: ''
    };
  },
  render: function() {
    var jobMap = {};
    for (var j = 0; j < this.props.data.jobs.length; j++){
      var job = this.props.data.jobs[j];
      jobMap[job.id] = job;
    }
    var dateBeginning = DateUtils.isValidDateString(this.state.dateBeginning) ?
      DateUtils.stringToDate(this.state.dateBeginning) :
      null;
    var dateEnd = DateUtils.isValidDateString(this.state.dateEnd) ?
      DateUtils.stringToDate(this.state.dateEnd) :
      null;
    var jobId = this.state.jobId;
    var job = jobMap[jobId];
    var jobIdElements = this.props.data.jobs.map(result => {
      return (
        <option
          key={result.id}
          value={result.id}>
          {result.title}
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
            value={this.state.dateBeginning}
            onChange={this.changeDateBeginning}
            />&nbsp;
          Date End:
          <input
            type="date"
            value={this.state.dateEnd}
            onChange={this.changeDateEnd}
            />&nbsp;
          Job:
          <select
            value={this.state.jobId}
            onChange={this.changeJobId}
          >{jobIdElements}</select>&nbsp;
        </div>
        <div
          className="printButton"
        >
          <i
            className="material-icons"
            onClick={this.printInvoice}
            title="Print"
          >printer</i>
        </div>
        <InvoiceDetails
          data={this.props.data}
          dateBeginning={dateBeginning}
          dateEnd={dateEnd}
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
  },
  printInvoice: function(){
    //This opens up a new window and prints just the invoice details
    var w=window.open();
    w.document.write('<pre>'+document.getElementById('invoiceDetails').innerHTML+'</pre>');
    w.print();
    w.close();
  }
});

var InvoiceDetails = React.createClass({
  render: function() {
    var dateBeginning = this.props.dateBeginning;
    var dateEnd = this.props.dateEnd;
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
            timeEntry.date >= dateBeginning &&
            timeEntry.date <= dateEnd &&
            timeEntry.jobId === job.id
        ){
          shownEntries.push(timeEntry);
          subtotal += (timeEntry.time/60)*job.hourlyRate;
        }
      }
      //Doing math.ceil to make the invoice always add up correctly
      subtotal = Math.ceil(subtotal*100)/100;
      tax = Math.ceil(subtotal*(job.taxRate/100))/100;
      total = subtotal + tax;
    }
    var separator = '-------------------------------------------------';
    var asciiTable = new AsciiTable('Entries');
    asciiTable.setTitleAlignCenter();
    asciiTable.setHeading('Minutes', 'Date', 'Summary');
    for (var i = 0; i < shownEntries.length; i++){
      var entry = shownEntries[i];
      asciiTable.addRow(
        entry.time,
        DateUtils.formatDate(entry.date),
        entry.summary.substring(0, separator.length-24)
      );
    }
    var startDateStr = DateUtils.formatDate(dateBeginning);
    var endDateStr = DateUtils.formatDate(dateEnd);
    var asciiTableStr;
    if (shownEntries.length === 0){
      asciiTableStr = 'No Entries'
    }
    else{
      asciiTableStr = asciiTable.toString();
    }
    var subtotalStr = subtotal.toFixed(2);
    var taxStr = tax.toFixed(2);
    var totalStr = total.toFixed(2);
    var jobTitleStr = job ? job.title : '';
    return (
      <pre id="invoiceDetails" className="invoiceDetails">{`Invoice

Job: ${jobTitleStr}
Date Range: ${startDateStr} - ${endDateStr}
${separator}
${asciiTableStr}
${separator}
Subtotal: $${subtotalStr}
Tax: $${taxStr}
Total: $${totalStr}`}</pre>
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
