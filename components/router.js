import React from 'react'
import { Router, Route, Link } from 'react-router'
import {MainPage} from  './app.js' 
import {Newsline} from  './newsline.js' 
import Local from  './local.js' 
import Context from  './context.js' 
/*
const QwiketRouter = React.createClass({ 
	render() { 
		console.log('** rendering router **')
		return (
		  	<Router>
		    	<Route path="/" component={MainPage}>
		      		
		      		<Route path="/newsline/:community" component={Newsline}>
		      			<Route path="/newsline/:community/:orderby" component={Newsline}>
		      			</Route>
		      		</Route>
		      		
	      			<Route path="/context/:community/post/:postid" component={Context}>
	      				<Route path="/context/:community/post/:postid/:local" component={Context}>
		      				<Route path="/context/:community/post/:postid/:local/:showcontext" component={Context}>
		      				</Route>

	      				</Route>

	      			</Route>  
	      			<Route path="/context/:community/topic/:threadid" component={Context}>
	      				<Route path="/context/:community/topic/:threadid/:local" component={Context}>
		      				<Route path="/context/:community/topic/:threadid/:local/:showcontext" component={Context}>
		      				</Route>
		      			</Route>
	      			</Route>  
		    	</Route>
		  	</Router>
		)
	}
});
*/
//module.exports = QwiketRouter
//
export default (
	<Router>
    	<Route path="/" component={MainPage}>
      		
      		<Route path="/newsline/:community" component={Newsline}>
      			<Route path="/newsline/:community/:orderby" component={Newsline}>
      			</Route>
      		</Route>
      		
  			<Route path="/context/:community/post/:postid" component={Context}>
  				<Route path="/context/:community/post/:postid/:local" component={Context}>
      				<Route path="/context/:community/post/:postid/:local/:showcontext" component={Context}>
      				</Route>

  				</Route>

  			</Route>  
  			<Route path="/context/:community/topic/:threadid" component={Context}>
  				<Route path="/context/:community/topic/:threadid/:local" component={Context}>
      				<Route path="/context/:community/topic/:threadid/:local/:showcontext" component={Context}>
      				</Route>
      			</Route>
  			</Route>  
    	</Route>
	</Router>
);
