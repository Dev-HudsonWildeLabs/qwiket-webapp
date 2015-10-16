import {Server} from "hapi";
import h2o2 from "h2o2";
import inert from "inert";
import React from "react";
import ReactDOM from "react-dom/server";
import {RoutingContext, match} from "react-router";
//import createLocation from "history/lib/createLocation";
import Transmit from "react-transmit";
import routes from "./routes";
import history from "history"
import url from "url";
var Wreck = require('wreck'); 
//console.log(process)
var hostname = process.env.HOSTNAME || "localhost";
var apiServer = process.env.QWIKETAPI|| "localhost";
var apiPort=process.env.QWIKETAPIPORT|| "8088";
GLOBAL.window = GLOBAL;  
GLOBAL.$= require('jquery')


/**
 * Start Hapi server on port 8000.
 */

//console.info('$$$$$$$$######  process.env=%o',process.env)
console.log('starting server 1 ',Date.now());
const server = new Server();
console.log('starting server 2 ',Date.now());
server.connection({port: process.env.PORT || 8000});
server.connection({host: 'localhost', port: process.env.PORT || 8000});
console.log('starting server 3 ',Date.now());
server.register([
	h2o2,
    inert
], function (err) {
	if (err) {
		throw err;
	}
console.log('starting server 4 ',Date.now());
try{
	server.start(function () {
		for(var i=0;i<server.connections.length;i++){
		console.info("==> ✅  Server is listening");
		console.info("==> 🌎  Go to " + server.connections[i].info.uri.toLowerCase());
		}
	});
}
	catch(err){
		console.log('EXCEPTION %o',err)
	}
});
console.log('starting server 5 ',Date.now());

/**
 * Attempt to serve static requests from the public folder.
 */ 
server.route({
	method:  "GET",
	path:    "/",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				let query=request.query;
				console.log('INDEX /')
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing";

				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				console.log('INSIDE 111')
				Wreck.read(res, null, function(err, payload){
					console.log('LANDING PAYLOAD:',JSON.parse(payload))
					matchAndRender(err, payload,request,reply)
				})
			
            	//console.log('res ',res)
			}
		}
	}
});
server.route({
	method:  "GET",
	path:    "/newsline/{community}/{params*}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				let query=request.query;
				//console.log('query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&community="+encodeURIComponent(request.params.community);

				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				//console.log('INSIDE 222')
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply)
				})
			
            	//console.log('res ',res)
			}
		}
	}
});
server.route({
	method:  "GET",
	path:    "/context/{community}/{params*}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				let query=request.query;
				//console.log('query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&community="+encodeURIComponent(request.params.community);

				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply)
				})
			
            	//console.log('res ',res)
			}
		}
	}
});
server.route({
	method:  "GET",
	path:    "/css/{params*}", 
	handler: {
		file: (request) => "static" + request.path
	}
});

server.route({
	method:  "GET",
	path:    "/js/{params*}", 
	handler: {
		file: (request) => "static" + request.path
	}
});
server.route({
	method:  "GET",
	path:    "/dist/{params*}", 
	handler: {
		file: (request) => "static" + request.path
	}
});
/**
 * Endpoint that proxies all GitHub API requests to https://api.github.com.
 */
server.route({
	method: "GET",
	path: "/api/{params*}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				let u=
				 url.format({
					protocol: "http",
					host:     apiServer+":"+apiPort,
					
					pathname: "api",
					query:    request.query
				})
				callback(null,u);
				console.log('API PROXY:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				//console.log('API RESPONSE',res);
				reply(res);
			}
		}
	}
});
server.route({
	method: "GET",
	path: "/d4api/{params*}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				let u=
				 url.format({
					protocol: "http",
					host:     apiServer+":"+apiPort,
				
					pathname: "d4api",
					query:    request.query
				})
				callback(null,u);
				console.log('D4API PROXY:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				
				reply(res);
			}
		}
	}
});

function matchAndRender (err, payload,request,reply) {
	let y= JSON.parse(payload);
		//console.log(payload,y);
		//reply(payload);
		
	window.server = y.server;

	//console.log("STEP 2")
	match({routes, location:request.url}, (error, redirectLocation, renderProps) => {
		//console.log('matched',error,redirectLocation, renderProps)
		if (redirectLocation) { 
			console.log('redirect')
			reply.redirect(redirectLocation.pathname + redirectLocation.search)
		}
		else if (error || !renderProps) {
			console.log('continue');
			reply.continue(); 
		}
		else {
			//console.log(window.server);
			//console.log('renderToString')
			console.log(' calling renderToString:', Date.now() )
			Transmit.renderToString(RoutingContext, renderProps).then(({reactString, reactData}) => {
				//console.log('renderToString returned !!!')
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
						    
						    <script src="/js/star-rating.min.js" type="text/javascript"></script>
						    <link href="/css/star-rating.min.css" media="all" rel="stylesheet" type="text/css" />
						  <link rel="stylesheet" href="/css/newsline.css"/>
						  <link rel="stylesheet" href="/css/d4rum.css"/>
						  <link rel="icon" type="image/png" href="/css/logo2.png"/>
						</head>
						<body>
							<script id="server-payload">
								window.server= ${JSON.stringify(window.server)}
							</script>
							<div id="react-root">${reactString}</div>
							
								<!--<script src="/dist/client.js" type="text/javascript"></script>-->
							
						</body>
					</html>`
				);
				//console.log('>>>>>>>>>>>>>sss>>',output)
				const webserver = process.env.NODE_ENV === "production" ? "" : "//localhost:8080";

				output          = Transmit.injectIntoMarkup(output, reactData, [`${webserver}/dist/client.js`]);
				console.log(' output generated:', Date.now() )
				reply(output);
			}).catch((error) => {
				console.error(error);
			});
		}
	});
}
