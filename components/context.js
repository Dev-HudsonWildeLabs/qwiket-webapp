//require("babel/register");
import React from 'react'
import {Link} from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title'

import {Items,Item} from  './newsline.js' 
import Local from  './local.js' 
import u from './d4shared/utils.jsx'
import {fetchTopics,clearTopics} from './actions/newslineAction';
import {fetchContextTopicForPostid,fetchContextTopicForThread,clearContextTopic,invalidateContext} from './actions/contextAction';
import {setChildTop} from './d4shared/actions/D4ContextAction';
import PostContext from './d4shared/postcontext.jsx'



var Context=React.createClass({
	
	/*native:function(name,event){
		//console.log('Context handling %s event=%o',name,event);
		this.setState({nativeD4:event.on})
	},*/
	componentDidMount:function(){
		//console.log('context mount params %o',this.props.params);
		this.fetch(this.props)
		if(__CLIENT__)
	  	 $(".rating").rating({
	      stars: 3,
	      max: 3,
	      showClear: false,
	      showCaption: false,
	      size: 'xs'
	    });
		//u.registerEvent('native',this.native,{me:this});
		//u.registerEvent('pushAppState',this.pushAppState,{me:this});
		//u.publishEvent('reqAppState',{}); 
	},
	componentWillUnmount:function(){
		//u.unregisterEvents('native',this);
		//u.unregisterEvents('pushAppState',this);	
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
	
	componentWillReceiveProps:function(nextProps){
		if(this.props.params.threadid!=nextProps.params.threadid||this.props.params.local!=nextProps.params.local||this.props.params.postid!=nextProps.params.postid){	
			//console.log('componentWillReceiveProps')
			this.fetch(nextProps);
		}
	},
	fetch:function(props){
		//console.log("@@@ FETCH TOPIC postid= %s",props.params.postid)
		if(u.is(props.params.postid)){
			this.props.fetchContextTopicForPostid.fetchContextTopicForPostid(props.params.postid,props.context,props.params.community)
		}
		else if(u.is(props.params.threadid)){
			this.props.fetchContextTopicForThread.fetchContextTopicForThread(props.params.threadid,props.context,props.params.community)
		}
	},
	reportSelectedPostY:function(y){
			//console.log(y)
			this.props.setChildTopAction.setChildTop(y);
	},
	render:function(){
		//console.log('rendering Context %o',this.props)
		let bg="#AAB"

        let invalid=this.props.context.get("invalid")

		let communityName=this.props.communityName;
	
    	let community=this.props.params.community
    	let resp=[],postid=-1,cv,ct,native_href='',local_href='',showContextBtn
		//console.log('render this.props=%o',this.props)
		let showQwiketForum=(typeof this.props.params.local==='undefined'||this.props.params.local=='local')?((typeof this.props.params.local==='undefined'&&this.props.context.get("nativeD4"))?false:true):false
		let showContext=(!(typeof this.props.params.showcontext==='undefined')||this.props.context.get("nativeD4")&&!showQwiketForum)?true:false
		if(showQwiketForum)
			bg="#CDC"
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
    	let localChild=this.props.context.get("topic")?(showContext?(showQwiketForum?
    		 (<PostContext  ref="QwiketContext" scope='working' reportY={this.reportSelectedPostY} local={true} forumid={this.props.context.get("qwiketForumid")} thread={this.props.context.get("qwiketThread")} type='context' community={community} constraint_type={ct} constraint_value={cv}/>)
    		:(<PostContext  ref="NativeContext"scope='working' reportY={this.reportSelectedPostY} local={false} type='context' forumid={this.props.context.get("nativeForumid")} thread={this.props.context.get("nativeThread")} community={community} constraint_type={ct} constraint_value={cv}/>))
    	    :(<Local ref="QwiketDisqus" url={local_href} community={community} topic={this.props.context.get("topic")}/>))
    		:(<div/>)
    	
	    let forum_str="Native";
		if(this.props.context.get("topic")){
			//resp.push(<div className="row" style={{borderTopLeftRadius: 4,borderTopRightRadius: 4,background:bg,padding:20}} key={postid}><Item topic={this.props.context.topic} full={true} orderby={0}/></div>)
			if(this.props.context.get("qwiketForumid")!=this.props.context.get('nativeForumid'))
                forum_str=this.props.context.get("topic").get("site_name");
            else
                forum_str=communityName;
			//console.log('forum_str %s',forum_str)
		}
		/**/
		if(showQwiketForum){
				//console.log('inside showLocal')
			let native='';
			if(this.props.context.get("nativeD4")){
				native=(<Link to={native_href} style={{float:"right", textDecoration: "none"}} ><span className="hidden-xs"><span className="label label-default">{forum_str}</span>&nbsp;</span><span className="label label-default"></span>&nbsp;&nbsp;<span style={{marginTop:2,float:"right", textDecoration: "none"}}><i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i></span></Link>)
			}
			resp.push(
				<div style={{background:bg,padding:0,borderRadius: 4}} className="row" key={'context-wrap-'+cv}>                              
					<div className="panel panel-default" style={{marginTop:0,marginBottom:0,paddingBottom:600,background:bg,borderBottomLeftRadius: 4,borderBottomRightRadius:4}}>
					  <div  style={{background:bg}} className="panel-heading"><span className="label label-default">{communityName}</span> &nbsp;&nbsp;{this.props.context.get("qwiketd4")?showContextBtn:''}{native}</div>
					  <div  style={{borderTopLeftRadius: 4,borderTopRightRadius: 4,background:bg,padding:20,opacity:(invalid?"0.4":"1")}} key={postid}><Item topic={this.props.context.get("topic")} community={community} full={true} sideTopics={false} orderby={0}/></div>
					  <div className="panel-body">{localChild}</div>
					</div>
				</div>
			)
		}
		else{
			if(ct=='thread')
				cv=this.props.context.get("nativeThread");
			//console.log('CV=%s',cv)
			resp.push(
				<div style={{background:bg,padding:0,borderRadius: 4}} className="row" key={'context-wrap-17'}>                              
					<div className="panel panel-default" style={{marginTop:0,marginBottom:0,paddingBottom:600,background:bg,borderBottomLeftRadius: 4,borderBottomRightRadius:4}}>
					  <div style={{background:bg}} className="panel-heading"><span className="label label-default">{"Fluid Context: "}<span className="hidden-xs">{forum_str}</span></span> <Link  to={local_href} style={{marginTop:0,float:"right", textDecoration: "none"}} ><span className="label label-default">{communityName+ ""}</span>&nbsp;&nbsp;<span style={{marginTop:2,float:"right", textDecoration: "none"}}><i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i><i className="fa fa-chevron-right fa-lg"></i></span></Link></div>
					  <div  style={{borderTopLeftRadius: 4,borderTopRightRadius: 4,background:bg,padding:20,opacity:(invalid?"0.4":"1")}} key={postid}><Item topic={this.props.context.get("topic")} community={community} sideTopics={false} full={true} orderby={0}/></div>
					  <div className="panel-body"><PostContext  reportY={this.reportSelectedPostY} key="postcontext1" local={false} scope='working' type='context' forumid={this.props.context.get("nativeForumid")} thread={this.props.context.get("nativeThread")} community={community} constraint_type={ct} constraint_value={cv}/></div>
					</div>
				</div>
			)
		}
		let sn=this.props.context.get("topic")?this.props.context.get("topic").get("site_name"):''
        let title=this.props.context.get("topic")?this.props.context.get("topic").get("title"):'Qwiket:The Internet of Us';
       // console.log('title=%s',title);
		return (	
			<DocumentTitle title={title}>
            <div className="container" >
            
				<div className="col-xs-12 col-sm-9 col-md-9 col-lg-8">
				{resp}
				</div>
				<div className="col-sm-3 col-md-3 col-lg-4 hidden-xs  " style={{opacity:(invalid?"0.4":"1")}}>
					 
					<div ><span className="label label-info">{sn}</span>
						{sn?(<Items 
                            query={""} 
                            topics={this.props.sideTopics.get("items")} 
                            state={this.props.sideTopics} 
                            sideTopics={true} 
                            clearTopics={this.props.clearTopicsAction.clearTopics} 
                            fetchTopics={this.props.fetchTopicsAction.fetchTopics} 
                            sitename={sn} 
                            orderby={0} 
                            community={community}
                            invalidateContext={this.props.invalidateContextAction.invalidateContext} />):""}
		         	
		         	</div>

				</div>
            
			</div>
            </DocumentTitle>    
		)
	}
});

function mapStateToProps(state) {
//  console.log('INJECTING OUTER CONTEXTPROPS %o',state)
  return {
   context:state.context,
   sideTopics:state.context.get("sideTopics"),
   communityName:state.app.get("community").get("communityName")
  };
}
function mapDispatchToProps(dispatch) {
//	console.log('mapDispatch')
  return {
  		fetchTopicsAction:bindActionCreators({ fetchTopics }, dispatch),
  		clearTopicsAction:bindActionCreators({ clearTopics }, dispatch),
  		fetchContextTopicForPostid:bindActionCreators({ fetchContextTopicForPostid }, dispatch),
		fetchContextTopicForThread:bindActionCreators({ fetchContextTopicForThread }, dispatch),
		clearContextTopicAction:bindActionCreators({clearContextTopic},dispatch),
		setChildTopAction:bindActionCreators({setChildTop},dispatch),
        invalidateContextAction:bindActionCreators({ invalidateContext }, dispatch)
	};
}
export default connect(mapStateToProps,mapDispatchToProps)(Context)