var React = require('react');
import InfoBox from './d4shared/infobox.jsx'
import u from './d4shared/utils.jsx'

let Community=React.createClass({
	componentDidMount: function() {
		this.fetch()
	},
	
	getInitialState: function() {
	    console.log('getInitialState')
	    return ({
	      communities:[]
		})
	},
	fetch:function(){
		$.ajax({
	        url: "api?task=load_forums",
	        dataType: 'json',
	        settings:{
	            cache:false
	        },
	        data:{
	   		},
	        context:this
	    }).success(function(data) {
	    	if(data.success){
		    	if (this.isMounted()) {
		    		let posts=[];
		    		//communities=data.forums;
		    		//console.log('SUCCESS data.forums=%o',data.forums)
		    		this.setState({
		        		communities:data.forums,
					});
		  
		        }
	    	}
	    	else {
	    		window.infoBox.setMessage('alert-danger', 'Error fetching posts from d4rum defender. Message: '+data.msg);
	    	}
      	}); 
	},
	
	
	render(){
		let lines=[];
		console.log('RENDER Community: this.params=%o',this)
		//console.log('render %o',this.state);
		for(var i=0;i<this.state.communities.length;i++){
			let c=this.state.communities[i]
			lines.push(<li id={"community_"+c.forum} key={"key_community_"+c.forum}><a href={"/#/newsline/"+c.forum}><span className="glyphicon glyphicon-log-in"></span> {c.name}</a></li>);
		}
		return(
			<li className="dropdown">
				<a className="dropdown-toggle" data-toggle="dropdown" href="#">{this.props.communityName}
		            <span className="caret"></span></a>
		            <ul className="dropdown-menu dropdown-menu-right">
		            	{lines}
		            </ul>
		    </li>        
		)
	}
});

let Online=React.createClass({
	render: function(){
		//console.log('app')
		if(server.login){
	      	return (
	      	 <div className="collapse navbar-collapse" id="myNavbar">	
			
	      	 
	      	<ul className="nav navbar-nav navbar-right">	 	
				<li className="dropdown">
			      	<a className="dropdown-toggle" data-toggle="dropdown" href="#"><span className="visible-xs">Login Menu <span className="caret"></span></span>
	            		<span className="dmenu visible-sm visible-md visible-lg" ><i className=" fa fa-bars"></i></span>
	         		</a>
		            <ul className="dropdown-menu dropdown-menu-right">
		            	<li id="login"><a href="/?login=1"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>  
		            	<li id="signup"><a href="#" data-toggle="modal" data-target="#signup_modal"><span className="glyphicon glyphicon-user"></span> Signup</a> </li>

						<li className="divider"></li>
						<li id="user_lang"><a href="#" data-toggle="modal" data-target="#userlang_modal"><i className="fa fa-language"></i> {server.lang}</a> </li>
						<li className="divider"></li>
						<li id="help_menu"><a href="/docs"><span className="glyphicon glyphicon-info-sign"></span> Help</a></li>
						<li id="support_menu"><a href="/docs#support" target="_help"><span className="glyphicon glyphicon-question-sign" ></span> Support</a></li>
						
			            
						<li className="divider"></li>
						<li id="about_menu"><a href="#"><span className="glyphicon glyphicon-exclamation-sign"></span> About</a></li> 
		            </ul>
	        	</li>
			</ul>
			</div>
	      );
	  	}
	  	else {
	  		return (
	  		<div className="collapse navbar-collapse" id="myNavbar">	
	      	<ul className="nav navbar-nav navbar-right"> 
	      
	      	
			<li className="dropdown">
	            <a className="dropdown-toggle" data-toggle="dropdown" href="#">{server.username}
	            <span className="caret"></span></a>
	            <ul className="dropdown-menu dropdown-menu-right">
	            	<li id="logout"><a href="/?logout=1"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
					<li className="divider"></li>
					<li id="user_lang"><a href="#" data-toggle="modal" data-target="#userlang_modal"><i className="fa fa-language"></i> {server.lang}</a> </li>
					<li className="divider"></li>
					<li id="help_menu"><a href="/docs" target="_help"><span className="glyphicon glyphicon-info-sign"></span> Help</a></li>
					<li id="support_menu"><a href="/docs#support" target="_help"><span className="glyphicon glyphicon-question-sign" ></span> Support</a></li>
					<li id="settings_menu"><a href="#"><span className="glyphicon glyphicon-wrench"></span> Settings</a></li>
					<li className="divider"></li>
					<li id="about_menu"><a href="#"><span className="glyphicon glyphicon-exclamation-sign"></span> About</a></li> 
	            </ul>
	        </li>
		    </ul>   
		    </div> 
      		);
	  	}
	}
});

var App = React.createClass({
	/**
	 * 
	 * We have to hack this since there are no ways of propagating state to child components that are coming via router.
	 */
	reqAppState:function(){
		//console.log('publish app state %o',this.state);
		u.publishEvent('pushAppState',{app:{communityName:this.state.communityName,communityForums:this.state.communityForums}})
	},
	updateCommunitySet:function(name,event){
		//console.log('updateCommunitySet received event %o',event)
		this.setState({communityName:event.communityName,communityForums:event.communityForums});
		this.reqAppState();
	},
	componentDidMount: function() {
		console.log('app mounted started');
		//console.log('app params=%o',this.props.params);
		
		u.registerEvent('updateCommunitySet',this.updateCommunitySet,{me:this});
		//console.log('app mounted completed');

	},
	componentWillUnmount:function(){
		//console.log('postcontext unmount');
		u.unregisterEvents('reqAppState',this);
		u.unregisterEvents('updateCommunitySet',this);
	},
	getInitialState: function() {
	  // console.log('getInitialState %s, %s',server.community, server.community_forums)
	    return ({
	      communityName:server.community,
	      communityForums:server.community_forums
		})
	},
	componentWillReceiveProps:function(nextProps){
		//console.log('APP componentWillReceiveProps props=%o nextProps=%o',this.props,nextProps)
		if(nextProps.params.community!=this.props.params.community)
			this.fetchCommunityData(nextProps.params.community)
	},
	fetchCommunityData:function(community){
		//console.log('fetchCommunityData community=%s',community)
		//this.setState({communityForums:[]})
		u.publishEvent('pushAppState',{app:{communityName:'',communityForums:[]}})
		$.ajax({
	        url: "api?task=load_community_forums",
	        dataType: 'json',
	        settings:{
	            cache:false
	        },
	        data:{
	        	community:community
	   		},
	        context:this
	    }).success(function(data) {
	    	if(data.success){
	    		//console.log('fetchCommunityData: data arrived community %s',community)	
		    	this.setState({communityName:data.communityName,communityForums:data.forums})
		    	this.reqAppState()
	    	}
	    	else {
	    		window.infoBox.setMessage('alert-danger', 'Error fetching posts from d4rum defender. Message: '+data.msg);
	    	}
      	}); 
	},
	render(){
		u.registerEvent('reqAppState',this.reqAppState,{me:this});
		if(this.props.location.pathname=="/"){
			window.location="#/newsline/"+server.forum+"/nevest";
		}
		if(!this.state.communityForums.length){
			this.fetchCommunityData(this.props.params.community);
		}
		//this.reqAppState();
    	//console.log('Render App stte=%o',this.state)
	    return (
	      	<div className="container-fluid"  style={{padding:0}}>
			 	<nav className="navbar navbar-inverse " style={{backgroundColor:"#222233",borderRadius:"0px",border:"none",marginBottom:10}}>
			 			<div className="navbar-header">
						 		<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
						          <span className="icon-bar"></span>
						          <span className="icon-bar"></span>
						          <span className="icon-bar"></span>
						        </button>
						        <img className="newsline-logo"  style={{marginLeft:10}}src="/build/css/logo2.png" alt="Qwiket"/>
					     		<a id="logo" style={{fontFamily: "'Sigmar One', cursive", fontSize: "2.1em"}} className="navbar-brand visible-xs visible-sm visible-md visible-lg" href="#"> Qwiket </a>   
				      		</div>
				      		<div style={{float:"left",marginTop:10,marginBottom:0,marginLeft:15}} role="form">
								<div className="form-group form-group-sm ">
					            <input type="text" placeholder="Paste a link to share..." className="form-control search-field input-sm" style={{float:"left",marginBottom:10,backgroundColor:"#EEEEEE"}} id="reshare" />
					            <button type="button" id="reshare_btn" style={{float:"right",marginRight:15}} className="btn btn-success btn-sm"><i className="fa fa-clipboard"></i></button>
					            </div>
	          				</div>
          				
          				<ul className="nav navbar-nav navbar">
         					<li><Community communityName={this.state.communityName} /></li>
        				</ul>
		        	<Online ref={(c) => window.login = c}/>
		        		
		        		
			 	</nav>
			 
			 	<InfoBox ref={(c) => window.infoBox = c}/>
				{this.props.children}
			</div>	  
      	);
    }
});

module.exports = {
    MainPage: App
}