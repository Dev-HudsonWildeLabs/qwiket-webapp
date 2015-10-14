import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';

import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import PrettyError from 'pretty-error';
import http from 'http';
//import SocketIo from 'socket.io';

import Router from "react-router";
const pretty = new PrettyError();
const app = new Express();
//const server = new http.Server(app);

var hostname = process.env.HOSTNAME || "localhost";
var apiServer = process.env.QWIKETAPI|| "localhost";
var apiPort=process.env.QWIKETAPIPORT|| "8088";
var port=process.env.PORT|| "85";





const proxy = httpProxy.createProxyServer({
  target: apiServer +':'+ apiPort,
  ws: true
});

app.use(compression());
app.use(favicon(path.join(__dirname, 'static/css', 'logo2.png')));

app.use(require('serve-static')(path.join(__dirname, 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});
app.use(function(req, res, next) {
  var router = Router.create({location: req.url, routes: './routes.js'})
  router.run(function(Handler, state) {
    var html = React.renderToString(<Handler/>)
    
    let output = (
          `<!doctype html>
          <html lang="en-us">
            <head>
              <meta charset="utf-8">

              <title>Qwiket </title>
              <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
              <meta http-equiv="Pragma" content="no-cache" />
              <meta http-equiv="Expires" content="0" />
                
              <meta name="viewport" content="width=device-width, initial-scale=1 minimum-scale=0.5"/>
              <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
              <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
              <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

              <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"/>

            <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/css/jasny-bootstrap.min.css">

            <!-- Latest compiled and minified JavaScript -->
            <script src="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/js/jasny-bootstrap.min.js"></script>

              <link href='https://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'>
              <link href='https://fonts.googleapis.com/css?family=Shadows+Into+Light' rel='stylesheet' type='text/css'>
              <link href='https://fonts.googleapis.com/css?family=Sigmar+One' rel='stylesheet' type='text/css'>
                <script type="text/javascript" src="build/bootbox.min.js"></script>
                <script src="/build/star-rating.min.js" type="text/javascript"></script>
                <link href="/build/css/star-rating.min.css" media="all" rel="stylesheet" type="text/css" />
              <link rel="stylesheet" href="build/css/newsline.css"/>
              <link rel="stylesheet" href="build/css/d4rum.css"/>
              <link rel="icon" type="image/png" href="build/css/logo2.png"/>
            </head>
            <body>
              <div id="react-root">${html}</div>
            </body>
          </html>`
        );




    return res.render('react_page', {html: output})
  })
})
var server = app.listen(port, function() {  
  var addr = server.address();
  console.log('Listening @ http://%s:%d', addr.address, addr.port);
});