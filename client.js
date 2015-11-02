//var React = require('react');

//ar Router = require('react-router');
//var RouteHandler = Router.RouteHandler;
import React from "react";
var ReactDom = require('react-dom');
import Router from "react-router";
import Immutable from 'immutable';
import routes from './routes';
import App from './components/app.js';
import Newsline from './components/newsline.js'
import Context from './components/context.js'
import {createHistory} from "history"; 
import { Provider } from 'react-redux';
import configureStore from './components/d4shared/store/configureStore'

//console.log("ENTERED QWIKET !!!")
// Set a device type based on window width, so that we can write media queries in javascript
// by calling if (this.props.deviceType === "mobile")
var deviceType;

if (window.matchMedia("(max-width: 639px)").matches) {
  deviceType = "mobile";
} else if (window.matchMedia("(max-width: 768px)").matches) {
  deviceType = "tablet";
} else {
  deviceType = "desktop";
}
global.__CLIENT__ = true;
global.__SERVER__ = false;


/**
 * Fire-up React Router.
 */
const reactRoot = window.document.getElementById("react-root");
//Transmit.render(Router, {routes, history: createHistory()}, reactRoot);
//var a=22
//Router.run(routes, Router.HistoryLocation, function (Handler, state) {
 // ReactDom.render(routes, reactRoot);
//});
const initialState = window.__INITIAL_STATE__;
let app=Immutable.fromJS(initialState.app);
  let msg=Immutable.fromJS(initialState.msg);
  let newsline=Immutable.fromJS(initialState.newsline);
  let context=Immutable.fromJS(initialState.context);
  let d4context=Immutable.fromJS(initialState.d4context);
  let landing={
    msg,
    app,
    newsline,
    context,
    d4context
  }
console.log(landing);
const store = configureStore(landing);
import createBrowserHistory from 'history/lib/createBrowserHistory'
let history = createBrowserHistory()
window.firstRender=true;
ReactDom.render(<Provider store={store}><Router history={history}>{routes}</Router></Provider>, reactRoot)
setTimeout(()=>window.firstRender=false,1000);
$(".rating").rating({
        stars: 3,
        max: 3,
        showClear: false,
        showCaption: false,
        size: 'xs'
      });
  //..let React = require('react'), 
  //App = require('./router.jsx'); // Our custom react component

  //Needed for React Developer Tools
//  window.React = React;

  // Render the main app react component into the document body. 
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
 //console.log('render')
 // React.render(React.createElement(routes), reactRoot);

 
/**
 * Detect whether the server-side render has been discarded due to an invalid checksum.
 */
if (process.env.NODE_ENV !== "production") {
	if (!reactRoot.firstChild || !reactRoot.firstChild.attributes ||
	    !reactRoot.firstChild.attributes["data-react-checksum"]) {
		console.error("Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.");
	}
}

