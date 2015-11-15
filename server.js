import {Server} from "hapi";
import h2o2 from "h2o2";
import inert from "inert";
import React from "react";
import {renderToString} from "react-dom/server";
import {RoutingContext, match} from "react-router";
//import Transmit from "react-transmit";
import routes from "./routes";
import history from "history"
import url from "url";
import Wreck  from 'wreck'; 
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import mapify from 'es6-mapify'
import configureStore from './components/store/configureStore'

var htmlEncode = require('js-htmlencode');



//console.log(process)
var hostname = process.env.HOSTNAME || "localhost";
var port = process.env.PORT || "80";
var apiServer = process.env.QWIKETAPI|| "localhost";
var apiPort=process.env.QWIKETAPIPORT|| "8088";
GLOBAL.window = GLOBAL;  
window.firstRender=true;
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
server.route([
  {
    method: 'GET',
    path: '/{path*}',
    vhost:'d4rum.com',
    handler: {
      proxy: {
        host: 'd4rum.com',
        port: 8081,
        protocol: 'http',
        passThrough: true,
        xforward: true
      }
    }
  }
]);

server.route({
	method:  "GET",
	path:    "/",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
				let query=request.query;
				
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing";
					//console.log('INDEX / u=',u)
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
				u+='&xip='+ip;
				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				//console.log('INSIDE 111')
				//
				//
				/*if (request.query.login||request.query.code)
					return;*/
				Wreck.read(res, null, function(err, payload){
					//console.log('LANDING PAYLOAD:',JSON.parse(payload))
					matchAndRender(err, payload,request,reply,ttl);
				})
			
            	//console.log('res ',res)
			}
		}
	}
});

server.route({
	method:  "GET",
	path:    "/{community}/{threadid}/7/",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
				let query=request.query;
				//console.log('CONTEXT query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&community="+request.params.community+"&type=context&threadid="+request.params.threadid;
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
    			u+='&xip='+ip;
				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				//if (request.query.login||request.query.code)
				//	return;
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply,ttl);
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
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
				let query=request.query;
				//console.log('query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&type=newsline&community="+encodeURIComponent(request.params.community);
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
    			u+='&xip='+ip;
				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				/*if (request.query.login||request.query.code)
					return;*/
				//console.log('INSIDE 222')
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply,ttl);
				})
			
            	//console.log('res ',res)
			}
		}
	}
});
server.route({
	method:  "GET",
	path:    "/context/{community}/post/{postid}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
				let query=request.query;
				//console.log('query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&community="+request.params.community+"&type=context&postid="+request.params.postid;
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
    			u+='&xip='+ip;
				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				/*if (request.query.login||request.query.code)
					return;*/
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply,ttl);
				})
			
            	//console.log('res ',res)
			}
		}
	}
});
server.route({
	method:  "GET",
	path:    "/context/{community}/post/{postid}/{local}/{params*}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
				let query=request.query;
				//console.log('query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&community="+request.params.community+"&type=context&postid="+request.params.postid+"&local="+request.params.local;
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
    			u+='&xip='+ip;

				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
			/*	if (request.query.login||request.query.code){
					console.log("SPECIAL RETURN ",request.query.login,request.query.code)
					
					return;
				}*/
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply,ttl);
				})
			
            	//console.log('res ',res)
			}
		}
	}
});
server.route({
	method:  "GET",
	path:    "/context/{community}/topic/{threadid}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
				let query=request.query;
				//console.log('CONTEXT query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&community="+request.params.community+"&type=context&threadid="+request.params.threadid;
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
    			u+='&xip='+ip;

				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				//if (request.query.login||request.query.code)
				//	return;
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply,ttl);
				})
			
            	//console.log('res ',res)
			}
		}
	}
});
server.route({
	method:  "GET",
	path:    "/context/{community}/topic/{threadid}/{local}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
				let query=request.query;
				//console.log('CONTEXT query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&community="+encodeURIComponent(request.params.community+"&type=context&threadid="+request.params.threadid+"&local="+request.params.local);
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
    			u+='&xip='+ip;

				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				//if (request.query.login||request.query.code)
				//	return;
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply,ttl);
				})
			
            	//console.log('res ',res)
			}
		}
	}
});

server.route({
	method:  "GET",
	path:    "/publish/{params*}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				let query=request.query;
				//console.log('query=%o',request)
				let u="http://"+apiServer+":"+apiPort+"/api?task=landing&type=submit";
				if (request.query.login) {
        			u+="&login="+request.query.login;
    			}
    			if (request.query.logout) {
        			u+="&logout="+request.query.logout;
    			}
    			if (request.query.code) {
        			u+="&code="+request.query.code;
    			}
    			{
    			if (request.query.url) {
        			u+="&link="+request.query.url;
    			}
    			}
				callback(null,u);
				console.log('mapUri:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				/*if (request.query.login||request.query.code)
					return;*/
				//console.log('INSIDE 222')
				Wreck.read(res, null, function(err, payload){
					matchAndRender(err, payload,request,reply,ttl);
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
				var query = request.url.search ? request.url.search : '';
        	
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
    			console.log(ip)
				/*let u=
				 url.format({
					protocol: "http",
					host:     apiServer+":"+apiPort,
					
					pathname: "api",
					query:    request.query+'&xip='+ip
				})*/
				let u="http://"+apiServer+":"+apiPort+"/api"+query+'&xip='+ip
				callback(null,u);
				console.log('API PROXY:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				//console.log('API RESPONSE',res);
				reply(res).ttl(ttl);
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
				var query = request.url.search ? request.url.search : '';
        	
				var xFF = request.headers['x-forwarded-for'];
				var ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
    			console.log(ip)
				
				let u="http://"+apiServer+":"+apiPort+"/d4api"+query+'&xip='+ip
				callback(null,u);
				console.log('D4API PROXY:', u)
			},
			onResponse (err, res, request, reply, settings, ttl) {
				// console.log(res)
					/*Wreck.read(res, null, function(err, payload){
					//console.log(JSON.parse(payload));
				})*/
				reply(res).ttl(ttl);
				
			}
		}
	}
});

function matchAndRender (err, payload,request,reply,ttl) {
	var landing= JSON.parse(payload);
	let redirect="";
	let cookie=landing.cookie;
	
	//let logout=request.query.logout?true:false;
	if(landing.redirect){
		redirect=landing.redirect;
		reply.redirect(redirect);
		console.log("REDIRECT TO ".redirect)
		return;
	}
	let app=Immutable.fromJS(landing.app);
	let topic=Immutable.fromJS(landing.topic);
	let msg=Immutable.fromJS(landing.msg);
	let newsline=Immutable.fromJS(landing.newsline);
	let context=Immutable.fromJS(landing.context);
	let d4context=Immutable.fromJS(landing.d4context);
	let meta=landing.meta;
	let bot_comments=landing.bot_comments;
	let comments_html='';
	if(bot_comments&&bot_comments.length>0){
		comments_html="<ul class='bot-comments>'";
		for(let i=0;i<bot_comments.length;i++){
			comments_html+="<li>"+bot_commentsp[i]+"</li>";
		}
		comments_html+="</ul>";

	}
	landing={
		msg,
		app,
		newsline,
		context,
		d4context,
		topic
	}
	//console.log(landing)
		//console.log(payload,y);
		//reply(payload);
		
	//window.server = landing.server;
	//window.server.lang=landing.lang;

	//console.log("STEP 2")
	match({routes, location:request.url}, (error, redirectLocation, renderProps) => {
		//console.log('matched',error,redirectLocation, renderProps)
		if (redirectLocation) { 
			console.log('redirect')
			reply.redirect(redirectLocation.pathname + redirectLocation.search)
		}
		else if (error || !renderProps) {
			console.log('error',error,renderProps); 
			reply.continue(); 
		}
		else {
			//console.log(window.server);
			//console.log('renderToString')
			let QwiketState;
			//console.log(landing)
			
			const store = configureStore(landing);

			//console.log(' calling renderToString:',renderProps/*, store.getState()*/ )
			const html = renderToString(
      		<Provider store={store}>
        		<RoutingContext {...renderProps} />
      		</Provider>
    		);
			//console.log('renderToString done')
			//Transmit.renderToString(RoutingContext, renderProps).then(({reactString, reactData}) => {
				 const finalState = store.getState();
				//console.log('renderToString returned !!!')
		
				var output = (
					`<!doctype html>
					<html lang="en-us">
						<head>
							

							
							
							<meta http-equiv="content-type" content="text/html; charset=utf-8">
							<meta charset="utf-8">
							<meta http-equiv="X-UA-Compatible" content="IE=edge">
							<meta http-equiv="Content-Language" content="en">
							<meta name="viewport" content="width=device-width, initial-scale=1 minimum-scale=0.5"/>
							<title>Qwiket ${meta.title}</title>
							<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
							<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
							<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
							<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
							
							<meta property="og:type"   content="website" /> 
							<meta property="og:title" content=${'"'+htmlEncode(meta.title)+'"'} />
							<meta name="description" content=${'"'+htmlEncode(meta.description)+'"'} />
							<meta property="og:description" content=${'"'+htmlEncode(meta.description)+'"'} />
							
							<meta property="og:site_name" content=${'"'+htmlEncode(meta.site_name)+'"'} />
							<meta property="og:url" content=${'"'+meta.url+'"'} />
							<meta property="og:image" content=${'"'+meta.image+'"'} />
							
							
							<meta name="pjax-timeout" content="1000">
							<meta name="is-dotcom" content="true">
							<meta name="hostname" content="github.com">
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
							<link href='https://fonts.googleapis.com/css?family=Black+Ops+One' rel='stylesheet' type='text/css'>
						    
						    <script src="/js/star-rating.min.js" type="text/javascript"></script>
						    <script src="/js/visible.js" type="text/javascript"></script>
						    <script src="/js/typeahead.bundle.min.js" type="text/javascript"></script>

						    <link href="/css/star-rating.min.css" media="all" rel="stylesheet" type="text/css" />
							<link rel="stylesheet" href="/css/newsline.css"/>
							<link rel="stylesheet" href="/css/d4rum.css"/>
							<link rel="stylesheet" href="/css/load-mask.css"/>
							<link rel="icon" type="image/png" href="/css/logo2.png"/>
						</head>
						<body>	
							<div id="react-root">${html}</div>	
								<!--<script src="/dist/client.js" type="text/javascript"></script>-->
							<script>
          						window.__INITIAL_STATE__ = ${JSON.stringify(finalState)};
        					</script>
        					<script src=${'"'+(process.env.NODE_ENV === "production" ? "" : '//localhost:85')+'/dist/client.js"'}></script>
        					${bot_comments}
						</body>
					</html>`
				);
				//console.log('>>>>>>>>>>>>>sss>>',output)
				//const webserver = process.env.NODE_ENV === "production" ? "" : "//localhost:8080";

				//output          = Transmit.injectIntoMarkup(output, reactData, [`${webserver}/dist/client.js`]);
				//console.log(' output generated:', Date.now() )
				//console.log("COOKIE=%o",cookie);
				if(cookie){
					let id=cookie.identity;
					if(id){
						reply(output).ttl(ttl).state('identity',id,{path:"/",ttl: 24 * 60 * 60 * 1000 * 30});
						//console.log("set cookie identity to ",id);
					}
				}
				else
					reply(output).ttl(ttl);
				
			
		}
	});
}
