require("babel/register");
var React = require('react');
import BurgerMenu from 'react-burger-menu';
import Radium from 'radium'

import InfoBox from './d4shared/infobox.jsx'
import u from './d4shared/utils.jsx'
import {Link} from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {selectCommunity} from './actions/appAction.js';
import Community from './community'



 var App = React.createClass({
 	getInitialState: function() {
    	return {link: ''};
  	},
	componentDidMount: function() {
       //console.log('props =%o',this.props)
		// console.log('search=%s',this.props.location.search);
        if(this.props.location.search){
            //console.log(this.props.location.search.toUpperCase());
            if(this.props.location.search.toUpperCase().indexOf('URL')==-1)
                this.props.history.pushState(null,this.props.location.pathname);
        }
        if(this.props.location.pathname=="/"){
			//console.log
			//console.log('redirect to %o',"/newsline/"+this.props.communityState.forum+"/newest")
			this.props.history.pushState(null,"/newsline/"+this.props.communityState.get("forum")+"/newest");
		}

	},
	showSettings: function(event) {
    	event.preventDefault();
    
  	},
  	onClick:function(){
  		//console.log('click');
  		this.refs.BurgerMenu.toggleMenu();
  	},
  	onSubmitLink:function(event){
  		//console.log('onSubmitLink ref=%o',this.state.link)
  		let link=this.state.link;
  		this.props.history.pushState(null,"/publish/?url="+encodeURIComponent(link));      
  	},
	handleLinkChange: function(event) {
    	this.setState({link: event.target.value});
  	},
    linkSelect:function(event){
        //console.log(event)
        event.target.select();
    },
    linkKeyDown:function(event){
        let key=event.keyCode;
        if(key==13){
            this.onSubmitLink(event);
        }
    },
    paste:function(event){
        let c=event.clipboardData;
        let items=c.items;
        let l=items.length;
        let item;
        let me=this;
        if(l==1){
            item=items[0];
            let type=item.type;
            let kind=item.kind;
            if(kind=='string'&&type=="text/plain"){
                items[0].getAsString((link)=>{
                   // console.log("ITEM=%s, type=%s,kind=%s",link,type,kind);
                    this.refs.link.value=link;
                    this.props.history.pushState(null,"/publish/?url="+encodeURIComponent(link));     
                });
            }
           
        }
        
    },
	render:function(){
		let Menu = BurgerMenu['push'];
		u.registerEvent('reqAppState',this.reqAppState,{me:this});
		
	    var styles={
	    	community:{
	    		display:'block',
	    		float:"right",
	    		//width:300,
	    		marginTop:10,
	    		marginRight:20,
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
    			marginTop:-15,
    			fontFamily: "'Sigmar One', cursive"
    		},
    		uname:{
    			fontSize:'1.0rem',
    			color:"#fff",
    			marginTop:-10,
    			marginBottom:20
    		},
    		avatar:{
    			float:"right",
    			position:"fixed",
    			width:48,
    			height:'auto',
    			padding:10
    		},
    		logoMenu:{float:"left",marginLeft:-15,width:30,marginTop:-15,height:"auto"},
    		brandMenu:{color:"#fff",float:"left",marginLeft:20, marginTop:-15,fontFamily: "'Sigmar One', cursive", fontSize: "2.3rem"},
    		brand:{
    			fontFamily: "'Sigmar One', cursive", 
    			
    			'@media (minWidth: 180px)': {
   					fontSize: "1.8rem"
  				},
  				'@media (minWidth: 780px)': {
   					fontSize: "2.5rem"
  				},
    			marginLeft:20,
    			marginTop:10,
    			padding:0}
    	
	    }
	    let communityStyles={
	    	 communityName:{
                color:'#fff',
                backgroundColor:'#222244',
                textDecoration:'none',
                marginLeft:30,
            },
            dropdownLine:{
                padding:4,
                maxWidth:400
            }
	    }
	    let umenu="",avatar=<span/>;
	    if(this.props.onlineState.get("login")){
	    	//console.log("LOGIN %o",this.props.onlineState.toObject())
            let path=this.props.location.pathname;
	        let arg=(path.indexOf('?')!=-1)?'&':'?';
            let loginArg=arg+((path.indexOf('login=1')!=-1)?'':'login=1');
          //  console.log('loginArg=%s',loginArg)

            umenu=(
	    		<div>
		    		<div>
		    			<a href={path+loginArg}><span className="glyphicon glyphicon-log-in"></span> Login [Disqus] </a> 
		    		</div>
	        		<div id="signup">
	        			<Link to="#" data-toggle="modal" data-target="#signup_modal"><span className="glyphicon glyphicon-user"></span> Signup</Link> 
	        		</div>
        		</div>
			);
           
	    }
	    else{
           // console.log("LOGOUT %o",this.props.onlineState.toObject())
	    	//console.log(this.props.onlineState.toObject())
         
            let path=this.props.location.pathname;
            let arg=(path.indexOf('?')!=-1)?'&':'?';
            let logoutArg=arg+((path.indexOf('logout=1')!=-1)?'':'logout=1');
                
	    	umenu=(
				<div>
					<div style={{height:"40px"}}><span className="avatar" style={{float:"right",marginRight:10}}><img  style={styles.avatar} src={this.props.onlineState.get("avatar")}/></span><span className="user-name" style={styles.uname}>{"Logged in as: "+this.props.onlineState.get("userName")}</span></div>
					<div className="divider"></div>
					<div className="divider"></div><br/>
					<div>
						<a href={path+logoutArg}><span className="glyphicon glyphicon-log-out"></span> Logout </a> 
					</div>
	        		
        		</div>
	    	);
            avatar=<div id="user_avatar" style={{float:'right',marginTop:10,width:24,display:'inline-block'}}><img className="post-image img-responsive" style={{maxWidth:20,height:"auto", marginRight:"auto",marginLeft:"auto",marginBottom:"auto",marginTop:"auto"}} src={this.props.onlineState.get("avatar")}/></div>;
	      // console.log('avatar %o',avatar)
        }
	   // console.log('Render App stte=%o',this.state)
       // 
	    return (
	    	<div id="outer-container" style={{minWidth:460}}>  
	    	<Menu ref="BurgerMenu" width={220} pageWrapId={ "page-wrap" } outerContainerId={"outer-container"} >
	    	<div style={{display:"block",width:"auto"}}>
		    	<div>
		    	<img className="newsline-logo-menu"  style={styles.logoMenu} src="/css/logo2.png" alt="Qwiket"/>
					     	
				<Link id="logo" style={styles.brandMenu} className="visible-xs visible-sm visible-md visible-lg" to={'/newsline/'+this.props.communityState.get("forum")+'/newest'}> Qwiket </Link>
				<br/><br/><span className="text-uppercase" style={styles.slogan}>the internet of us</span> <br/>
				
				</div>	
			</div> 
            	
        	{umenu}
			<div className="divider"></div><br/>
			<div id="user_lang"><Link to="#" data-toggle="modal" data-target="#userlang_modal"><i className="fa fa-language"></i> {this.props.onlineState.get("userLang")} </Link> </div>
			<div className="divider"></div>
			<div id="help_menu"><Link to="/docs"><span className="glyphicon glyphicon-info-sign"></span> Help</Link></div>
			<div id="support_menu"><Link to="/docs#support" target="_help"><span className="glyphicon glyphicon-question-sign" ></span> Support</Link></div>
			
            
			<div className="divider"></div>
			<div id="about_menu"><Link to="#"><span className="glyphicon glyphicon-exclamation-sign"></span> About</Link></div> 
		          
			
	        
	        
	      </Menu>
			<main id="page-wrap">
	      	<div onPaste={this.paste} className="container-fluid"  style={{padding:0,background:"#EEE"}}>
			 
			 	<nav className="navbar navbar-inverse " style={{backgroundColor:"#222244",borderRadius:"0px",border:"none",marginBottom:10,height:42,minHeight:42,padding:0}}>
		 			
				    
				    <button type="button" className="navbar-toggle visible-xs visible-sm visible-md visible-lg" style={styles.button} onClick={this.onClick}>
				        <span className="icon-bar" onClick={this.onClick}></span>
				        <span className="icon-bar" onClick={this.onClick}></span>
				        <span className="icon-bar" onClick={this.onClick}></span>
				    </button>
				   
			     	<Link to={'/newsline/'+this.props.communityState.get("forum")+'/newest'}>  <img  style={styles.logo}  src="/css/logo2.png" alt="Qwiket"/><span style={styles.brand}  className="navbar-brand ">Qwiket</span> </Link>   
		      		
		      		

			      	
      				<div style={{float:"left",height:20,marginTop:0,marginBottom:0,marginLeft:15}} onKeyDown={this.linkKeyDown} role="form">
						<div className="form-group form-group-sm visible-lg visible-md visible-sm">
		            		<input ref="link" type="text" placeholder="Paste a link to publish..." onChange={this.handleLinkChange} onClick={this.linkSelect} className="form-control search-field input-sm" style={{float:"left",marginLeft:10,height:20,marginTop:10,marginBottom:0,backgroundColor:"#EEEEEE"}} id="reshare" />
		            		<button type="button" onClick={this.onSubmitLink} id="reshare_btn" style={{float:"right",marginTop:10,marginRight:15,marginLeft:2,height:20,width:20,padding:0}} className="btn btn-success btn-sm"><i className="fa fa-clipboard"></i></button>
		            	</div>
					</div>
  		            
          		
         			<div style={styles.community}><Community styles={communityStyles} ref="Community" ls={this.props.communityState.get("ls")} communities={this.props.communityState.get("communities")} communityName={this.props.communityState.get("communityName")} select={this.props.selectCommunity} history={this.props.history}/></div>
        			 {avatar}    		
		        </nav>
		       <div>
			 	<InfoBox ref="InfoBox"/> 
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
App=Radium(App)
function mapStateToProps(state) {
 // console.log('mapStateToProps community %o',state.app.get("community").toObject())
  return {
    msg: state.msg,
    communityState:state.app.get("community"),
    onlineState:state.app.get("online")
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectCommunity }, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(App);
