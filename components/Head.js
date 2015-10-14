
// The head component ONLY gets rendered server-side
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Head = React.createClass({

  displayName: 'Head',

  mixins: [PureRenderMixin],

  render: function() {
    return (
      <head>
        <meta charSet="utf-8" />
        <title>{this.props.title}</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
      
        <meta name="viewport" content="width=device-width, initial-scale=1 minimum-scale=0.5"/>
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
        <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"/>

      
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/css/jasny-bootstrap.min.css"/>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/js/jasny-bootstrap.min.js"></script>

        <link href="https://fonts.googleapis.com/css?family=Oswald" rel='stylesheet' type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Shadows+Into+Light" rel="stylesheet" type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Sigmar+One" rel="stylesheet" type="text/css"/>
        <script type="text/javascript" src="static/bootbox.min.js"></script>
        <script src="/static/star-rating.min.js" type="text/javascript"></script>
        <link href="/static/css/star-rating.min.css" media="all" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="static/css/newsline.css"/>
        <link rel="stylesheet" href="static/css/d4rum.css"/>
        <link rel="icon" type="image/png" href="static/css/logo2.png"/>
      </head>
    );
  }
});

module.exports = Head;
