require("babel/register");
import React from 'react'
import {Link} from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PostContext from './d4shared/postcontext.jsx'
import {Items,Item} from  './newsline.js' 
import Local from  './local.js' 
import u from './d4shared/utils.jsx'


var Context=React.createClass({
	pushAppState:function(name,event){
		//console.log('Context receive app state event=%o',event)
		this.setState({app:event.app})
	},
	native:function(name,event){
		//console.log('Context handling %s event=%o',name,event);
		this.setState({nativeD4:event.on})
	},
	componentDidMount:function(){
		//console.log('context mount params %o',this.props.params);
		this.fetch(this.props)
		$(".rating").rating({
            stars:3,
            max:3,
            showClear:false,
            showCaption:false,
            size:'xs'
		});
		u.registerEvent('native',this.native,{me:this});
		u.registerEvent('pushAppState',this.pushAppState,{me:this});
		u.publishEvent('reqAppState',{}); 
	},
	componentWillUnmount:function(){
		u.unregisterEvents('native',this);
		u.unregisterEvents('pushAppState',this);	
	},
	componentDidUpdate:function(prevProps, prevState){
		//console.log('context unmount params %o',this.props.params);
		$(".rating").rating({
            stars:3,
            max:3,
            showClear:false,
            showCaption:false,
            size:'xs'
		});
	},
	getInitialState: function() {
		/**
		 * Note that by default nativeD4 state params is true until proven otherwise, gives a chance for a child component to go and get posts for native forum. If it can't it will trigger event "noNative" that will reset this state param
		 * qwoketD4 which plays similiar role for local (qwiket hosted) forums is set to false as the check will be made by this component in any case and it will enable this state if succesful (adding a button to switch to context view of local forum)
		 */
	    return {
	      topic:null,				/*the newsline item (topic)																*/
	      qwiketD4:false, 			/*this thread on selected qwiket community forum is loaded on D4 						*/
	      nativeD4:true,			/*this thread on native forum is loaded on D4  											*/
	      qwiketForumid:0,          /*forumid of the qwiket community forum for this thread 								*/
	      qwiketThread:""           /*Disqus thread id (or future similiar alternative from other services)                 */
	     
	    };
	},
	componentWillReceiveProps:function(nextProps){
		if(this.props.params.threadid!=nextProps.params.threadid||this.props.params.local!=nextProps.params.local){	
			this.fetch(nextProps);
		}
	},
	fetch:function(props){
		//console.log('FETCH props=%o',props );
		this.setState({nativeD4:true})
		if(u.is(props.params.postid)){
			$.ajax({
		        url: "/api?task=get_thread_for_post",
		        dataType: 'json',
		        settings:{
		            cache:false
		        },
		        data:{
		   			postid:props.params.postid
		        },
		        context:this
		    }).success(function(data) {
		    	//console.log('get_thread_for_post SUCCESS data=%o',data)
		    	if(data.success){
			    	if (this.isMounted()) {
			    		this.setState({
			        		topic:data.topic
			        		//native:true							
						});
			        }      
			        let url="http://qwiket.com/"+this.props.params.community+"/"+data.topic.threadid+"/7/";
			       // console.log('calling get_d4_status for postid url=%s,forum=%s',url,this.props.params.community)
			        if(typeof(this.props.params.local)=='undefined'||this.props.params.local=='local'){
				        $.ajax({
					        url: "/api?task=get_d4_status",
					        dataType: 'json',
					        settings:{
					            cache:false
					        },
					        data:{
					   			url:url,
					   			forum:this.props.params.community
					        },
					        context:this
					    }).success(function(data) {
					    	//console.log('get_d4_status SUCCESS data=%o',data)
					    	if(data.success){
					    		window.infoBox.clear();
					    		
						    	if (this.isMounted()) {
						    		this.setState({
						        		qwiketD4:data.d4,
						        		qwiketForumid:data.forumid,
						        		qwiketThread:data.thread
									});
						        }
					    	}
					    	else {
					    		window.infoBox.setMessage('alert-danger', 'Error fetching posts from d4rum defender. Message: '+data.msg);
					    	}
				 		});
					}
		    	}
		    	else {
		    		window.infoBox.setMessage('alert-danger', 'Error fetching posts from d4rum defender. Message: '+data.msg);
		    	}
		  	});
		}
		else
		if(typeof(props.params.threadid)!='undefined'&&props.params.threadid){
			$.ajax({
		        url: "/api?task=get_thread",
		        dataType: 'json',
		        settings:{
		            cache:false
		        },
		        data:{
		   			threadid:props.params.threadid
		        },
		        context:this
		    }).success(function(data) {
		    	//console.log('get_thread SUCCESS data=%o',data)
		    	if(data.success){
			    	if (this.isMounted()) {
			    		this.setState({
			        		topic:data.thread
						});
			        }
			        let url="http://qwiket.com/"+this.props.params.community+"/"+data.thread.threadid+"/7/";
			       // console.log('calling get_d4_status for threadid url=%s,forum=%s',url,this.props.params.community)
			        if(typeof(this.props.params.local)=='undefined'||this.props.params.local=='local'){
				        $.ajax({
					        url: "/api?task=get_d4_status",
					        dataType: 'json',
					        settings:{
					            cache:false
					        },
					        data:{
					   			url:url,
					   			forum:this.props.params.community
					        },
					        context:this
					    }).success(function(data) {
					    	//console.log('get_d4_status SUCCESS data=%o',data)
					    	if(data.success){
					    		//window.infoBox.clear();    		
						    	if (this.isMounted()) {
						    		this.setState({
						        		qwiketD4:data.d4,
						        		qwiketForumid:data.forumid,
						        		qwiketThread:data.thread
									});
						        }
					    	}
					    	else {
					    		//console.log('get_d4_status FAIL data=%o',data)
					    		window.infoBox.setMessage('alert-danger', 'Error fetching posts from d4rum defender. Message: '+data.msg);
					    	} 
				 		});
					}
		    	}
		    	else {
		    		window.infoBox.setMessage('alert-danger', 'Error fetching posts from d4rum defender. Message: '+data.msg);
		    	}	    
	 		});
		}
	},
	render:function(){
		let communityName='';
		if(u.is(this.state.app)){
			communityName=this.state.app.communityName;
		}
    	let community=this.props.params.community
    	let resp=[],postid=-1,cv,ct,native_href='',local_href='',showContextBtn
		//console.log('render this.props=%o',this.props)
		let showQwiketForum=(typeof this.props.params.local==='undefined'||this.props.params.local=='local')?((typeof this.props.params.local==='undefined'&&this.state.nativeD4)?false:true):false
		let showContext=(!(typeof this.props.params.showcontext==='undefined')||this.state.nativeD4&&!showQwiketForum)?true:false

    	if(u.is(this.props.params.postid)){
    		postid=this.props.params.postid
    		cv=this.props.params.postid
    		ct='post'
			native_href='/context/'+community+'/post/'+cv+'/native'
			local_href='/context/'+community+'/post/'+cv+'/local'
			showContextBtn=showContext?(<Link to={'/context/'+community+'/post/'+cv+'/local/'} 		  style={{textDecoration: "none"}} className="label label-default">Disqus View</Link>)
									  :(<Link to={'/context/'+community+'/post/'+cv+'/local/context'} style={{textDecoration: "none"}} className="label label-default">Context View</Link>)
    	}
    	else if(u.is(this.props.params.threadid)){
    		cv=this.props.params.threadid
    		//console.log('SETTING THREAD CV=%s',cv)
    		ct='thread'
    		native_href='/context/'+community+'/topic/'+this.props.params.threadid+'/native'
			local_href='/context/'+community+'/topic/'+this.props.params.threadid+'/local'
			showContextBtn=showContext?(<Link to={'/context/'+community+'/topic/'+this.props.params.threadid+'/local/'} style={{textDecoration: "none"}} className="label label-default">Disqus View</Link>)
									  :(<Link to={'/context/'+community+'/topic/'+this.props.params.threadid+'/local/context'} style={{textDecoration: "none"}} className="label label-default">Context View</Link>)
    	}
    	//console.log('DEBUG showContext=%s, this.state=%o',showContext,this.state)    
    	//console.log('show context showContext=%s,showLocal=%s,qwiket_forumid=%s,qwiket_thread=%s,community=%s,ct=%s,cv=%s',showContext,showLocal,this.state.qwiket_forumid,this.state.qwiket_thread,community,ct,cv)
    	let localChild=this.state.topic?(showContext?(showQwiketForum?
    		 (<PostContext  ref="QwiketContext" scope='working' local={true} forumid={this.state.qwiket_forumid} thread={this.state.qwiket_thread} type='context' community={community} constraint_type={ct} constraint_value={cv}/>)
    		:(<PostContext  ref="NativeContext"scope='working' local={false} type='context' community={community} constraint_type={ct} constraint_value={cv}/>))
    	    :(<Local ref="QwiketDisqus" url={local_href} community={community} topic={this.state.topic}/>))
    		:(<div/>)
    	
	    let forum_str="Native";
		if(this.state.topic){
			resp.push(<div className="row" key={postid}><Item topic={this.state.topic} full={true} orderby={0}/></div>)
			forum_str=this.state.topic.site_name;
			//console.log('forum_str %s',forum_str)
		}
		/**/
		if(showQwiketForum){
				//console.log('inside showLocal')
			let native='';
			if(this.state.nativeD4){
				native=(<Link to={native_href} style={{float:"right", textDecoration: "none"}} ><span className="hidden-xs">{forum_str}&nbsp;</span><span className="label label-default"></span>&nbsp;&nbsp;<i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i></Link>)
			}
			resp.push(
				<div className="row" key={'context-wrap-'+cv}>                              
					<div className="panel panel-default" style={{marginTop:10}}>
					  <div className="panel-heading">{communityName} &nbsp;&nbsp;{this.state.d4?showContextBtn:''}{native}</div>
					  <div className="panel-body">{localChild}</div>
					</div>
				</div>
			)
		}
		else{
			if(ct=='thread')
				cv=this.props.params.threadid;
			//console.log('CV=%s',cv)
			resp.push(
				<div className="row" key={'context-wrap-17'}>                              
					<div className="panel panel-default" style={{marginTop:10}}>
					  <div className="panel-heading"><span className="label label-success">{"Qwiket Fluid Context: "}<span className="hidden-xs">{forum_str}</span></span> <Link  to={local_href} style={{float:"right", textDecoration: "none"}} ><span className="label label-default">{communityName+ " forum"}</span>&nbsp;&nbsp;<i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i></Link></div>
					  <div className="panel-body"><PostContext  key="postcontext1" local={false} scope='working' type='context' community={community} constraint_type={ct} constraint_value={cv}/></div>
					</div>
				</div>
			)
		}
		let sn=this.state.topic?this.state.topic.site_name:''
		return (	
			<div className="container" >
				<div className="col-md-9">
				{resp}
				</div>
				<div className="col-md-3 hidden-xs hidden-sm ">
					 
					<div ><span className="label label-info">{sn}</span>
						{sn?(<Items query={""} sitename={sn} orderby={0} community={community}/>):""}
		         	
		         	</div>

				</div>
			</div>
		)
	}
});
module.exports = Context;