import React from 'react';

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

exports.Invoice = Invoice;
