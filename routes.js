import React from 'react'
import { Router, Route, Link } from 'react-router'
import MainPage from  './components/app.js' 
import {Newsline} from  './components/newsline.js' 
import Local from  './components/local.js' 
import Context from  './components/context.js' 
import Topic from './components/topic.js'
import QwiketLink from './components/link.js'
export default (
	<Router>
      <Route path="/link/:url" component={QwiketLink}>
        </Route>

    	<Route path="/" component={MainPage}>
    		<Route path="/:community/:threadid/7"  component={Context}>
        </Route>

        <Route path="/publish/" component={Topic}>
        </Route>

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
