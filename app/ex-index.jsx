import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link} from 'react-router';
import {render} from 'react-dom';

var Home = React.createClass({
  render: function() {
      return (
        <div>
          <h2>HELLO</h2>
          <p>Cras facilisis urna ornare ex volutpat, et
          convallis erat elementum. Ut aliquam, ipsum vitae
          gravida suscipit, metus dui bibendum est, eget rhoncus nibh
          metus nec massa. Maecenas hendrerit laoreet augue
          nec molestie. Cum sociis natoque penatibus et magnis
          dis parturient montes, nascetur ridiculus mus.</p>

          <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
        </div>
      );
    }
});

var Contact = React.createClass({
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

var Stuff = React.createClass({
  getInitialState: function() {
    return {listElements: [1,2,3,4,6,7]};
  },
  render: function() {
    return (
      <div onClick={this.handleClick}>
        <h2>STUFF</h2>
        <p>Some lorem ipsum text</p>
        <ol>
          {this.state.listElements.map(function(result){
            return <li key={result}>{result}</li>
          })}
        </ol>
      </div>
    );
  },
  handleClick: function(){
    console.log(this.state.listElements);
    this.state.listElements.pop();
    this.setState({listElements: this.state.listElements});
  }
});

var App = React.createClass( {
  render: function() {
    return (
      <div>
        <h1>Simple SPA</h1>
        <ul className="header">
          <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
          <li><Link to="/stuff" activeClassName="active">Stuff</Link></li>
          <li><Link to="/contact" activeClassName="active">Contact</Link></li>
        </ul>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
});

render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="stuff" component={Stuff}/>
      <Route path="contact" component={Contact}/>
    </Route>
  </Router>,
  document.getElementById('app'));
