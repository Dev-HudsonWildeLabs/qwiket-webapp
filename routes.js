import React from 'react'
import { Router, Route, Link } from 'react-router'
import MainPage from  './components/app.js' 
import {Newsline} from  './components/newsline.js' 
import Local from  './components/local.js' 
import Context from  './components/context.js' 
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
