import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link, hashHistory} from 'react-router';
import {render} from 'react-dom';
import {DateUtils, JobValidator, TimeEntryValidator} from './Validator';
import * as Network from './Network';
import {TimeSheet} from './TimeSheet.jsx';
import {Jobs} from './Jobs.jsx';
import {Invoice} from './Invoice.jsx';

var App = React.createClass({
  getInitialState: function() {
    return {
      jobs: [],
      timeEntries: []
    };
  },
  componentDidMount: function() {
    Network.getAll(this);
  },
  render: function() {
    //TODO implement sorting
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
    var validatorOptions = {
      needsId: data.id !== 'NEW'
    };
    if (type == 'TimeEntry'){
      entries = this.state.timeEntries;
      key = 'timeEntries';
      data.date = DateUtils.stringToDate(data.date);
      //validate the time entry and return if bad
      if (!TimeEntryValidator(data, validatorOptions)){
        var state = {};
        state[key] = entries;
        //reset the state to get rid of the bad record
        this.setState(state);
        return;
      }
    }
    else if (type == 'Job'){
      entries = this.state.jobs;
      key = 'jobs';
      //validate the job and return if bad
      if (!JobValidator(data, validatorOptions)){
        var state = {};
        state[key] = entries;
        //reset the state to get rid of the bad record
        this.setState(state);
        return;
      }
    }
    if (data.id !== 'NEW'){
      //The entry already exists, update it's state
      for (var i = 0; i < entries.length; i++){
        //search for the entry that is correct
        var result = entries[i];
        if (result.id === data.id){
          if (del){
            delete entries[i];
            Network.delete(this, data.id, type);
          }
          else{
            entries[i] = data;
            Network.update(this, Object.assign({}, data), type);
          }
          var state = {};
          state[key] = entries;
          this.setState(state);
          return;
        }
      }
    }
    else {
      entries.push(data);
      var state = {};
      state[key] = entries;
      this.setState(state);
      Network.create(this, state, key, Object.assign({}, data), type);
    }
  }
});

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={TimeSheet}/>
      <Route path="jobs" component={Jobs}/>
      <Route path="invoice" component={Invoice}/>
    </Route>
  </Router>,
  document.getElementById('app'));
