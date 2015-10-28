require("babel/register");
var React = require('react');
import BurgerMenu from 'react-burger-menu';


import InfoBox from './d4shared/infobox.jsx'
import u from './d4shared/utils.jsx'
import {Link} from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {selectCommunity} from './d4shared/actions/appAction.js';

let Community=React.createClass({
	
	
	render:function(){
		console.log('Community render %o',this.props.communityName)
		let lines=[];
		//console.log('RENDER Community: this.params=%o',this.props)
		//console.log('render %o',this.state);
		for(var i=0;i<this.props.communities.length;i++){
			let c=this.props.communities[i]
			lines.push(<li id={"community_"+c.forum} key={"key_community_"+c.forum}><Link to={"/newsline/"+c.forum+"/newest"}><span className="glyphicon glyphicon-log-in"></span> {c.name}</Link></li>);
		}
		var styles={
	    	communityName:{
	    		color:'#fff',
	    		backgroundColor:'#222244',
	    		textDecoration:'none',
	    		marginLeft:30,
	    	}
    	}
	
		return(
			<div className="dropdown">
				<a className="dropdown-toggle" data-toggle="dropdown" href="#" style={styles.communityName}>{this.props.communityName}
		            <span className="caret"></span></a>
		            <ul className="dropdown-menu dropdown-menu-right">
		            	{lines}
		            </ul>
		    </div>        
		)
	}
});

let Online=React.createClass({
	render: function(){
		//console.log('render Online %o',this.props)
		var styles={
    	menu:{
    		color:'#fff',
    		backgroundColor:'#222244',
    		textDecoration:'none'
    	   	},
    	button:{
    		padding:3,
    		marginTop:0,
    		//marginBottom:15
    		//width:20,
    		//height:20
    		}   	
    	}
	
		if(this.props.login){
			
	      	return (
	    <div className="collapse navbar-collapse" id="myNavbar">	
		  	<ul className="nav navbar-nav navbar-right">	 	
				<li className="dropdown">
					<a className="dropdown-toggle" data-toggle="dropdown" href="#" style={styles.menu}><span className="visible-xs">Login Menu</span>

					    <button type="button" className="navbar-toggle visible-sm visible-md visible-lg" style={styles.button}>
					        <span className="icon-bar"></span>
					        <span className="icon-bar"></span>
					        <span className="icon-bar"></span>
					    </button>
					</a>
		            <ul className="dropdown-menu dropdown-menu-right">
		            	<li id="login"><a href="/?login=1"><span className="glyphicon glyphicon-log-in"></span> Login with Disqus</a></li>  
		            	<li id="signup"><a href="#" data-toggle="modal" data-target="#signup_modal"><span className="glyphicon glyphicon-user"></span> Signup</a> </li>

						<li className="divider"></li>
						<li id="user_lang"><a href="#" data-toggle="modal" data-target="#userlang_modal"><i className="fa fa-language"></i> {this.props.lang}</a> </li>
						<li className="divider"></li>
						<li id="help_menu"><a href="/docs"><span className="glyphicon glyphicon-info-sign"></span> Help</a></li>
						<li id="support_menu"><a href="/docs#support" target="_help"><span className="glyphicon glyphicon-question-sign" ></span> Support</a></li>
						
			            
						<li className="divider"></li>
						<li id="about_menu"><a href="#"><span className="glyphicon glyphicon-exclamation-sign"></span> About</a></li> 
		            </ul>
	        	</li>
			</ul>
		</div>);
	  	}
	  	else {
	  		
	  		return (
	  		<div className="collapse navbar-collapse" id="myNavbar">	
	      	<ul className="nav navbar-nav navbar-right"> 
	      
	      	
			<li className="dropdown">
	            <a className="dropdown-toggle" data-toggle="dropdown" href="#">{this.props.username}
	            <span className="caret"></span></a>
	            <ul className="dropdown-menu dropdown-menu-right">
	            	<li id="logout"><a href="/?logout=1"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
					<li className="divider"></li>
					<li id="user_lang"><a href="#" data-toggle="modal" data-target="#userlang_modal"><i className="fa fa-language"></i> {this.props.lang}</a> </li>
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
	
	componentDidMount: function() {
		if(this.props.location.pathname=="/"){
			console.log
			console.log('redirect to %o',"/newsline/"+this.props.communityState.forum+"/newest")
			this.props.history.pushState(null,"/newsline/"+this.props.communityState.forum+"/newest");
		}
	},
	
	componentWillReceiveProps:function(nextProps){
		//console.log('APP componentWillReceiveProps props=%o nextProps=%o',this.props,nextProps)
		//if(nextProps.params.community!=this.props.params.community){
			//console.log('Community changing community',nextProps.params.community)
			//this.props.fetchCommunityData(nextProps.params.community)
		//}
	},
	fetchCommunityData:function(community){
		//console.log('fetchCommunityData community=%s',community)
		//this.setState({communityForums:[]}
		/*
		u.publishEvent('pushAppState',{app:{communityName:'',communityForums:[]}})
		$.ajax({
	        url: "/api?task=load_community_forums",
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
	    		//console.log('fetchCommunityData: data arrived community %s',data)	
		    	this.setState({communityName:data.communityName,communityForums:data.forums})
		    	this.reqAppState()
	    	}
	    	else {
	    		if(__CLIENT__)
	    		window.infoBox.setMessage('alert-danger', 'Error fetching posts from d4rum defender. Message: '+data.msg);
	    	}
      	}); 
*/
	},
	 showSettings: function(event) {
    	event.preventDefault();
    
  	},
  	onClick:function(){
  		console.log('click');
  		this.refs.BurgerMenu.toggleMenu();
  	},
	render:function(){
		   let Menu = BurgerMenu['push'];
		 //  	console.log('render app %o',this.props)
		u.registerEvent('reqAppState',this.reqAppState,{me:this});
		
		/*if(!this.state.communityForums.length){
			this.fetchCommunityData(this.props.params.community);
		}*/
		if(__CLIENT__)
		if(this.props.communityState.forum!=this.props.params.community)
			setTimeout(()=>this.props.selectCommunity(this.props.params.community));
		
		//this.reqAppState();
    	
	    var styles={
	    	community:{
	    		display:'block',
	    		float:"right",
	    		width:300,
	    		marginTop:10,
	    		marginBottom:"auto"
	    	},
	    	collapse:{
	    		float:'left'
	    	},
	    	button:{
	    		padding:5,
	    		marginTop:7,
	    		marginLeft:30,
	    		float:"left"
    		},
    		logo:{
    			float:"left",
    			//position:"absolute",
    			
    			marginLeft:10,
    			marginTop:9		,
    			width:20,
    			height:"auto"
    		},
    		slogan:{
    			display:'block',
    			fontSize:'1.3rem',
    			marginLeft:-15,
    			marginRight:0,
    			padding:0,
    			fontFamily: "'Sigmar One', cursive"
    		},
    		logoMenu:{float:"left",marginLeft:-15,width:30,height:"auto"},
    		brandMenu:{color:"#fff",float:"left",marginLeft:20, fontFamily: "'Sigmar One', cursive", fontSize: "2.3rem"},
    		brand:{fontFamily: "'Sigmar One', cursive", fontSize: "2.5rem",marginLeft:20,marginTop:10,padding:0}
    	
	    }
	   // console.log('Render App stte=%o',this.state)
	    return (
	    	<div id="outer-container" style={{minWidth:390}}>  
	    	<Menu ref="BurgerMenu" width={220} pageWrapId={ "page-wrap" } outerContainerId={"outer-container"} >
	    	<div style={{height:200,display:"block",height:"200px",width:"auto"}}>
	    	<div>
	    	<img className="newsline-logo-menu"  style={styles.logoMenu} src="/css/logo2.png" alt="Qwiket"/>
				     	
			<Link id="logo" style={styles.brandMenu} className="visible-xs visible-sm visible-md visible-lg" to={'/newsline/'+this.props.params.community+'/newest'}> Qwiket </Link>
			<br/><br/><span className="text-uppercase" style={styles.slogan}>the internet of us</span> <br/>
			
			</div>	
			</div>      	
        	<div><Link to="/?login=1"><span className="glyphicon glyphicon-log-in"></span> Login [Disqus] </Link> </div>
        	<div id="signup"><Link to="#" data-toggle="modal" data-target="#signup_modal"><span className="glyphicon glyphicon-user"></span> Signup</Link> </div>

			<div className="divider"></div>
			<div id="user_lang"><Link to="#" data-toggle="modal" data-target="#userlang_modal"><i className="fa fa-language"></i> {this.props.onlineState.userLang} </Link> </div>
			<div className="divider"></div>
			<div id="help_menu"><Link to="/docs"><span className="glyphicon glyphicon-info-sign"></span> Help</Link></div>
			<div id="support_menu"><Link to="/docs#support" target="_help"><span className="glyphicon glyphicon-question-sign" ></span> Support</Link></div>
			
            
			<div className="divider"></div>
			<div id="about_menu"><Link to="#"><span className="glyphicon glyphicon-exclamation-sign"></span> About</Link></div> 
		          
			
	        
	        
	      </Menu>
			<main id="page-wrap">
	      	<div className="container-fluid"  style={{padding:0,background:"#EEE"}}>
			 
			 	<nav className="navbar navbar-inverse " style={{backgroundColor:"#222244",borderRadius:"0px",border:"none",marginBottom:10,height:42,minHeight:42,padding:0}}>
		 			
				    
				    <button type="button" className="navbar-toggle visible-xs visible-sm visible-md visible-lg" style={styles.button} onClick={this.onClick}>
				        <span className="icon-bar" onClick={this.onClick}></span>
				        <span className="icon-bar" onClick={this.onClick}></span>
				        <span className="icon-bar" onClick={this.onClick}></span>
				    </button>
				    <img  className=" visible-sm visible-md visible-lg" style={styles.logo}  src="/css/logo2.png" alt="Qwiket"/>
			     	<Link style={styles.brand} className="navbar-brand visible-md visible-lg" to={'/newsline/'+this.props.params.community+'/newest'}> Qwiket </Link>   
		      		
		      		

			      	
      				<div style={{float:"left",height:20,marginTop:0,marginBottom:0,marginLeft:15}} role="form">
						<div className="form-group form-group-sm visible-lg visible-md visible-sm">
		            		<input type="text" placeholder="Paste a link to publish..." className="form-control search-field input-sm" style={{float:"left",marginLeft:10,height:20,marginTop:10,marginBottom:0,backgroundColor:"#EEEEEE"}} id="reshare" />
		            		<button type="button" id="reshare_btn" style={{float:"right",marginTop:10,marginRight:15,marginLeft:2,height:20,width:20,padding:0}} className="btn btn-success btn-sm"><i className="fa fa-clipboard"></i></button>
		            	</div>
					</div>
  		
          		
         			<div style={styles.community}><Community ref="Community" ls={this.props.communityState.ls} communities={this.props.communityState.communities} communityName={this.props.communityState.communityName} /></div>
        					
		        </nav>
		        
		        <div className="col-xs-6">
			 	<InfoBox ref="InfoBox" text={this.props.msg.text} type={this.props.msg.type}/>
				</div>
			 	

				<div className="col-xs-12">	


				{this.props.children}
				</div>
			</div>
			</main>
			</div>	  
      	);
    }
});

function mapStateToProps(state) {
	//console.log('mapStateToProps app')
  return {
    msg: state.msg,
    communityState:state.app.community,
    onlineState:state.app.online
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectCommunity }, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(App);
