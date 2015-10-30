require("babel/register");
import React from 'react'
import ReactDom from 'react-dom';

import u from './d4shared/utils.jsx'
import PostQueue from './d4shared/postqueue.jsx'
import Radium from 'radium'
import {Link,History} from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {fetchTopics,clearTopics} from './d4shared/actions/newslineAction';
import {fetchPosts,clearPosts} from './d4shared/actions/postsAction';


var Item=React.createClass({
	mixins: [ History ],
	itemClick:function(e,t){
		//console.log('click %o %o',e,this.props);
		window.scrollTo(0, 0);
		this.history.pushState(null,'/context/'+this.props.community+'/topic/'+this.props.topic.threadid);
			
		
	},
	render:function(){
		//console.log('Render Item %o',this.props)
		let topic=this.props.topic;
		let threadid=topic.threadid;
		let link=topic.link;
		let text=topic.text;
		let image=topic.image;
		let title=topic.title;
		let site_name=topic.site_name;
		let description=topic.description;
		let date=topic.date;
		let user_name=topic.user_name;
		let rating=topic.rating;
		let shared_by_profileurl=topic.shared_by_profileurl;
      	let orderby=this.props.orderby;
		let sitename=(typeof(this.props.sitename)!='undefined'&&this.props.sitename)?this.props.sitename:'';	
	    
	    var html='';
	    if(!description)
	        description='';
	    if(!text)
	        text='';
	    //full=true;
	    if(!title)
	        title='';
	    if(!rating)
	        rating=0;
	    else
	        rating=+rating;  
	   // var description_length=512;
	   // var text_length=64;
	  // var full_cls="";
	   //full=true;
	    //if(full){
	       var  description_length=2048;
	        var text_length=2048;
	       // full_cls=" topic-full";
	    //}
	  /*  if(shared_by_profileurl){
	        user_name='<a href="'+shared_by_profileurl+'" target="_blank">'+user_name+'</a>';
	    }*/
	    
	    if(description.length>description_length)
	        description=description.slice(0,description_length)+'<span class="more"> <Link to="'+link+'" class="inner-link" target="origin">more...</Link></span>"';
	    if(text.length>text_length)
	        text=text.slice(0,text_length)+'<span class="more"> more...</span>"';

	    var sb="Shared by";
	    var pb='';
	    let bg="#fcfcfc"
	    if(this.props.full)
	    	 bg="#fcfcF4"
	    if(orderby>0){
	        pb="Published ";
	        date=topic.published_time;
	    }
	    let styles;
	    if(!sitename){
	    	styles={
	    		post:{
	    			backgroundColor:bg,
	    			padding:"5px 10px"
	    		},
	    		menu:{
	    			float:"right"
	    		},
	    		title:{
	    			color:'#555',
		    		':hover':{
		    			color:'black'
		    		},
		    		':active':{
		    			color:'greay'
		    		},
	    			fontSize: '1.5rem'
	    		},
	    		comment:{
	    			fontSize: '1.2rem'
	    		},
	    		topic:{
	    			//backgroundColor:bg,
	    			padding:"5px 0 0 5px",
	    			color:"#555",
	    			margin:0,
	    			//position:"relative",
  					display:"inline-block",
  					fontSize: '1.3rem'
	    		},
	    		image:{
	    			float:"left",
	    			clear:"left",
	    			marginRight:10,
	    			maxWidth:"20%"
	    		},
	    		sharedby:{
	    			fontSize: '1.2rem',
	    			color:"#AAA",
	    			':hover':{
	    				color:'black'
		    		},
		    		':active':{
		    			color:'grey'
		    		}

	    		},
	    		sblink:{
	    			color:'#AAA',
	    			':hover':{
	    				color:'black'
		    		},
		    		':active':{
		    			color:'grey'
		    		}
	    		},
	    		sitename:{
	    			position:"relative",
  					//float:"bottom",
  					display: "block",
  					//textAlign: "top",
   	 				marginTop: 10,
  					verticalAlign: "bottom",
  					fontSize: '1.4rem'
	    		},
	    		footer:{
	    			//float:"bottom",
	    			//width:"100%",
	    			height:"2.4rem"
	    			
	    		},
	    		ratings:{
	    				float:"right",
	    				marginLeft:10,
	    				marginTop:0
	    		},
	    		linkmore:{
	    				marginTop:40
	    		}
	    	}
	    }
	    else{
	    	styles={
				post:{
	    			backgroundColor:bg,
	    			padding:"5px 10px"
	    		},
	    		menu:{
	    			float:"right"
	    		},
	    		title:{
	    			color:'#555',
		    		':hover':{
		    			color:'black'
		    		},
		    		':active':{
		    			color:'grey'
		    		},
	    			fontSize: '1.3rem'
	    		},
	    		comment:{
	    			fontSize: '0.9rem'
	    		},
	    		topic:{
	    			//backgroundColor:bg,
	    			padding:"5px 0 0 5px",
	    			color:"#555",
	    			margin:0,
	    			//position:"relative",
  					display:"inline-block",
  					fontSize: '1.1rem'
	    		},
	    		image:{
	    			float:"left",
	    			clear:"left",
	    			marginRight:10,
	    			maxWidth:"20%"
	    		},
	    		sharedby:{
	    			fontSize: '1.0rem',
	    			color:"#AAA",
	    			':hover':{
	    				color:'black'
		    		},
		    		':active':{
		    			color:'grey'
		    		}
	    		},
	    		sblink:{
	    			color:'#AAB',
	    			':hover':{
	    			color:'black'
		    		},
		    		':active':{
		    			color:'grey'
		    		}
	    		},
	    		sitename:{
	    			position:"relative",
  					display: "block",
   	 				marginTop: 10,
  					verticalAlign: "bottom",
  					fontSize: '1.0rem'
	    		},
	    		footer:{
	    			//float:"bottom",
	    			//width:"100%",
	    			height:"0.1rem"
	    			
	    		},
	    		ratings:{
	    				float:"right",
	    				marginLeft:10,
	    				marginTop:0
	    		},
	    		linkmore:{
	    				marginTop:10
	    		}
	    	}
	    }
	    //console.log(topic.stamp)
	    return (
	    <div ref="NewsItem"  className="list-group-item" threadid={threadid} style={styles.post}>
	        <div>
		       	<span ref="SharedBySpan" style={styles.sharedby}>{sb}&nbsp;<a ref="SharedByLink" style={styles.sblink} href={shared_by_profileurl} target="_blank">{user_name}</a>&nbsp;{pb}
	        		<span >{u.timeConverter(date,(window.firstRender?topic.stamp:0))}</span>
	        	</span>
        		<div ref ="ItemMenu" className="dropdown"  style={styles.menu}>
				   	<button type="button" className="btn btn-link dropdown-toggle"  data-toggle="dropdown" >
				   		{(!sitename)?(<i className="fa fa-bars fa-lg"></i>):(<i className="fa fa-bars fa-sm"></i>)}
				   	</button>
					<ul className="dropdown-menu dropdown-menu-right" >
				      	<li><Link  className="discuss" to={"/local/"+threadid}><i className="fa fa-comments-o fa-fw fa-sm"></i>&nbsp;Comments</Link></li>
				      	<li><Link  className="discuss" to={"/local/"+threadid}><i className="fa fa-thumbs-o-up fa-fw fa-sm"></i>&nbsp;Reshare on Qwiket</Link></li>
				      	<li><Link  className="discuss" to={"/local/"+threadid}><i className="fa fa-facebook fa-fw fa-sm"></i>&nbsp;Share on Facebook</Link></li>
				      	<li><Link  className="discuss" to={"/local/"+threadid}><i className="fa fa-share-alt fa-fw fa-sm"></i>&nbsp;Share link</Link></li>
				      	<li><Link  className="discuss" to={"/local/"+threadid}><i className="fa fa-hand-paper-o fa-fw fa-sm"></i>&nbsp;Unplug this Feed</Link></li>
				    </ul>
					</div>	
	        </div>
	        <div onClick={this.itemClick}>
		      	<div ref="ItemComment" className="small" style={styles.comment}>{text}</div>
		    	<span >
		    		<a ref="ItemTitle" href={link}  className="" style={styles.title} target="origin"><div dangerouslySetInnerHTML={{__html: title}}></div></a>
		    	</span>
		        <div ref="Topic" style={styles.topic}>
		        	<img ref="TopicImage" className="topic-image img-responsive" style={styles.image} src={image}/>
		        	<blockquote-reverse><div dangerouslySetInnerHTML={{__html: description}}></div></blockquote-reverse>
		        	<div style={styles.sitename}>&copy;{site_name}</div>
		        	<a href={link} style={styles.linkmore} target="origin">{this.props.full?"Click here to read the full article.":""}</a>
		    
		    	</div>
		    	<div ref="ItemFooter" style={styles.footer}>
			    	<div ref="ItemRatings" style={styles.ratings}>
			    		{(!sitename)?(<input style={{marginTop:0}}className="rating" data-size="xs" data-symbol={"\uf0f4"} data-glyphicon="false" data-rating-class="rating-fa" data-default-caption="{rating} cups" data-star-captions="{}" stars="3" value={rating}/>):""}
			    	</div>
			    </div>
		    </div>
	        
	    </div>
		);	  
	}
});

Item=Radium(Item)
var Items=React.createClass({

	topScroll:function(name,e){
		//console.log('items topscroll');
		//if(this.props.type.indexOf('context')<0)
			this.fetch(true,false,this.props);
	},
	bottomScroll:function(name,e){
		//console.log('items bottomscroll');
		//if(this.props.type.indexOf('context')<0)
			this.fetch(false,false,this.props);
	},
	componentDidMount: function() {
		u.registerEvent('topScroll',this.topScroll,{me:this});
		//Utils.registerEvent('bottomScroll',this.bottomScroll,this);
		if(this.props.topics.length==0)
			this.fetch(true,true,this.props)
		//console.log('MOUNT state=%o',this.state)
		$(".rating").rating({
			            stars:3,
			            max:3,
			            showClear:false,
			            showCaption:false,
			            size:'xs'
			        });
		//console.log('MOUNTED')
	},
	componentWillUnmount:function(){
		u.unregisterEvents('topScroll',this);
		//Utils.unregisterEvents('bottomScroll',this);
		//Utils.unregisterEvents(this);
		//console.log('items UNMOUNT')
	},
	componentDidUpdate:function(prevProps, prevState){
	    $(".rating").rating({
	      stars: 3,
	      max: 3,
	      showClear: false,
	      showCaption: false,
	      size: 'xs'
	    });

	},
	/*getInitialState: function() {
	    return {
	      topics:[],
	      lastid:99999999999999999
	    };
	},*/
	//fetchTopics(community = 'pointofviewworld', orderby = 0, lastid = common.MAXID, sitename = '', limit = 25, query = '') 
	fetch:function(clear,remove,props){
		//console.log('fetch clear=%s,props=%o',clear,this.props)
		if(remove)
			props.clearTopics();
		props.fetchTopics(clear,props.community,props.orderby,props.state,this.props.sideTopics,props.state.lastid,props.sitename,25,props.query);
	},
	/*
	fetch:function(clear,remove,props){
		//console.log('fetch %o',props)
		let orderby=props.orderby;
		let sitename=(typeof(props.sitename)!='undefined'&&props.sitename)?props.sitename:'';	
		//console.log('ITEMS sitename=%s',sitename)
		let query=props.query;
		let lastid=this.state.lastid;
		if(remove){
			lastid=99999999999999999;
			this.setState({lastid:lastid,topics:[]});
		}
		else if(clear){
			lastid=99999999999999999;
		}
		
		
		if(orderby>1){
			$.ajax({
			    url: "/api?task=load_topics",
			    dataType: 'json',
			    settings:{
			        cache:false
			    },
			    data:{
			        orderby:orderby,
			        last:lastid,
			        site_name:sitename,
			        start:0,
			        limit:25,
			        query:query,
			        sitename:sitename
			    },
			    context:this
			}).success(function(data) {
			    var items = [];
			    if(!data.success){
			        window.infoBox.setMessage('alert-danger', 'Error fetching items from qwiket. Message: '+data.msg);
			    }
		        else {
			        var topics=data.topics;
			        //console.log('SUCCESS xid=%s, length=%s',data.topics[data.topics.length-1].xid,data.topics.length);
			        let old_topics=this.state.topics;
			        if(clear)
			        	old_topics=[];
			        if(data.topics.length>0){
			        	this.setState({lastid:data.topics[data.topics.length-1].xid,topics:old_topics.concat(data.topics)})
			        }
			    	else{
			    		this.setState({lastid:tlastid,topics:old_topics})
			    	}
			    	$(".rating").rating({
			            stars:3,
			            max:3,
			            showClear:false,
			            showCaption:false,
			            size:'xs'
			        });
			    }
	        });
		}
		else{
			$.ajax({
			    url: "/api?task=load_community_topics",
			    dataType: 'json',
			    settings:{
			        cache:false
			    },
			    data:{
			    	last:lastid,
			        orderby:orderby,
			        site_name:sitename,
			        community:props.community,
			        limit:25,
			        query:query
			    },
			    context:this
			}).success(function(data) {
			    var items = [];
			    if(!data.success){
			        window.infoBox.setMessage('alert-danger', 'Error fetching items from qwiket. Message: '+data.msg);
			    }
		        else {
			        var topics=data.topics;
			        
			        //console.log('SUCCESS xid=%s, length=%s',data.topics[data.topics.length-1].xid,data.topics.length);
			        let old_topics=this.state.topics;
			        if(clear)
			        	old_topics=[]; // TODO in the morning - same optimization as in postqueue!!!!!!!!!!!!!
			        if(data.topics.length>0){
			        	let l=old_topics.length;
			        	//old_topics=old_topics.slice(0,data.topics.length);
			        	old_topics=old_topics.concat(data.topics);
			        	//console.log('old topics %o',old_topics)
			        	//if(old_topics.length>50){
			        		
			        		let sp=old_topics.length-60;
			        		//console.log('cutting topics sp=%s',sp)
			        		old_topics[old_topics.length-1]
			        		
			        		//console.log('old_topics length=%s',old_topics.length)
			        	//}
			        	//console.log('last topic %o,%o',old_topics,data.topics)
			        	this.setState({lastid:old_topics[old_topics.length-1].xid,topics:old_topics})
			        }
			    	else{
			    		this.setState({lastid:lastid,topics:old_topics})
			    	}
			    	$(".rating").rating({
			            stars:3,
			            max:3,
			            showClear:false,
			            showCaption:false,
			            size:'xs'
			        });
			    }
	        });


		}
	},
	*/
	componentWillReceiveProps:function(nextProps){

		//let scope=nextProps.scope;
		//let type=nextProps.type;
		//console.log('props %o',nextProps);
		/*if(nextProps.orderby!=server.orderby){
			server.orderby=nextProps.orderby;
			$.ajax({
            url: "api?task=orderby",
            dataType: 'json',
            data:{
                orderby:server.orderby
            }
        });
		}*/
		if(this.props.orderby!=nextProps.orderby||this.props.query!=nextProps.query||this.props.community!=nextProps.community||this.props.sitename!=nextProps.sitename){
		   // console.log('componentWillReceiveProps props=%o',nextProps)
			this.fetch(true,true,nextProps);
		}

	},
	render:function(){
		//console.log('render Items props=%o,state=%o',this.props,this.state);
		let rows=[];
		let topics=this.props.topics;
		let l=topics.length;
		let sitename=(typeof(this.props.sitename)!='undefined'&&this.props.sitename)?this.props.sitename:'';
		//console.log('length=%s',l)
		for(var i=0;i<l;i++){
			
			let p=topics[i];
			
			//console.log('p=%o',p)
	  		
	  		let xid=p.xid;
	  		//console.log(xid)

	  		//console.log(1)
	  		let cb=(c) =>{
	  			//console.log('INSIDE %o',c.props.lastRow);
	  			if(!c){
					u.unregisterEvents('bottomScroll',this);
	  			}
	  			else
	  			if(c.props.lastRow){
	  				let el= ReactDom.findDOMNode(c);
					let j=$(el);
					let offset=j.offset()
					//console.log('offset=%o',offset);
					u.registerEvent('bottomScroll',this.bottomScroll,{me:this,y:offset.top});
	  			}
	  		};
	  	  	rows.push(
	  			<Item key={xid} sitename={sitename} community={this.props.community} ref={cb} lastRow={i==l-1} topic={p} full={false} orderby={this.props.orderby}/>
  			)
	  	}

	  	//if(rows.length>0)
      	return (
      		<div>
			<div>
			{rows}
			</div>
			<span><i className="fa fa-refresh fa-spin"></i>&nbsp;Loading items from the server...</span>
			</div>
      	);
	}
});


/**
 * Top level router component
 * 
 */
var Newsline=React.createClass({
	
	componentDidMount: function() {
		//console.log('newsline mounted stararted');
		//console.log('mount');
		//u.registerEvent('pushAppState',this.pushAppState,{me:this});
		//u.publishEvent('reqAppState',{});  
		/*if(typeof(this.props.params.orderby)=='undefined'){
			let orderbyString='newest';
			switch(server.orderby){
				case 1:
				orderbyString='published';
				break;
				case 2:
				orderbyString='selected';
				break;
				case 3:
				orderbyString='myhistory';
				break;

			}
			window.location='/#/newsline/'+this.state.app.community+'/'+orderbyString;
		}*/
		
		
		let me=this;
		$('#topics_search').keypress(function(e){
	        if(e.which == 13){//Enter key pressed
	           me.searchButtonClick();
	        }
   		});

   		//console.log('newsline mounted completed');
		
	},	
	componentWillUnmount:function(){
		//u.unregisterEvents('pushAppState',this);	
	},
	componentWillReceiveProps:function(nextProps){
		
	},
	searchButtonClick:function(){
		//console.log('searching %o',$('#topics_search').val())

		this.props.history.pushState(null,"/newsline/"+this.props.params.community+"/"+this.props.params.orderby+"/?search="+$('#topics_search').val());
		//window.location="#/newsline/"+this.props.params.community+"/"+this.props.params.orderby+"/?search="+$('#topics_search').val();

	},
	clearButtonClick:function(){
		//console.log('clear %o',$('#topics_search').val())
		$('#topics_search').val('');

		this.props.history.pushState(null,"/newsline/"+this.props.params.community+"/"+this.props.params.orderby+"/");
		//window.location="#/newsline/"+this.props.params.community+"/"+this.props.params.orderby+"/";
	},
	reportSelectedPostY:function(y){
	
	},
	render: function(){
		//console.log('RENDER NEWSLINE props %o',this.props)
		if(typeof(this.props.params.orderby)=='undefined'){
			this.props.history.pushState(null,'/newsline/'+this.props.params.community+'/newest');
			//window.location='/newsline/'+this.props.params.community+'/newest';
		}

		let { query } = this.props.location
    	let search = query && query.search ? query.search : '';
    	//console.log(search);

		//console.log('PROPS %o',this.props)
		let orderbyString=this.props.params.orderby;
		let orderby=0;
		switch(orderbyString){
			case 'newest':
			orderby=0;
			break;
			case 'published':
			orderby=1;
			break;
			case 'selected':
			orderby=2;
			break;
			case 'myhistory':
			orderby=3;
		}
	//	console.log('SEARCH %o',this.props.params.community+"/"+orderbyString+"?"+search)
		//console.log("RENDER NEWSLINE community %s forums %o",this.props.params.community,this.state.app.communityForums)
		return (
			<div className="container" >				
				<div id="leftpanel" className="col-xs-9 col-sm-8 col-md-8 col-lg-8" >
							<div className="row">
								<div className="form-inline col-xs-12" style={{float:"right",marginBottom:15,backgroundColor:"#8888AA",borderTopLeftRadius:"4px",borderTopRightRadius:"4px",borderBottomRightRadius:"4px"}} role="form">           
						            <button type="button" id="topics_search_clear_btn" onClick={this.clearButtonClick}  style={{float:"right",marginRight:5,marginTop:10}} className="btn btn-default "><i className="fa fa-times"></i></button>
						        
						            <button onClick={this.searchButtonClick} type="button"   id="topics_search_btn" style={{float:"right",marginTop:10,marginRight:5}} className="btn btn-default "><i className="fa fa-search"></i></button>
			     
					        		
					        		<label className="visible-md visible-lg" style={{marginTop:15,marginLeft:2,float:"left",color:"#fff"}}> Search:</label>
					        		<label className="visible-xs visible-sm" style={{marginTop:15,marginLeft:12,float:"left",color:"#fff"}}> <i className="fa fa-search fa-lg"></i></label>
					        			<input type="text" className="form-control search-field" style={{float:"right",margin:10,maxWidth:400}} defaultValue={search}  id="topics_search" />
			          					
			          			</div>
		          				
		          				<div className="btn-group btn-group-xs" role="group" style={{float:"right",marginTop:-4,marginBottom:15}}>
						            <Link id="timeline_by_shared"  to={"/newsline/"+this.props.params.community+"/newest"}  type="button" className={"btn btn-primary"+(orderby==0?" active":"")}>By Newest</Link>
						            <Link id="timeline_by_published" to={"/newsline/"+this.props.params.community+"/published"}  type="button" className={"btn btn-primary"+(orderby==1?" active":"")}>By Published</Link>
						            <Link id="starred" type="button" to={"/newsline/"+this.props.params.community+"/selected"}  className={"btn btn-primary"+(orderby==2?" active":"")}>Selected</Link>
						            <Link id="history" type="button" to={"/newsline/"+this.props.params.community+"/myhistory"}  className={"btn btn-primary"+(orderby==3?" active":"")}>Shared by me</Link>
		         				</div>
		         				
         					</div>		
		         			<div className="row">
		         					<Items query={search}  orderby={orderby} community={this.props.params.community} sideTopics={false} topics={this.props.topics.items} state={this.props.topics} clearTopics={this.props.clearTopicsAction.clearTopics} fetchTopics={this.props.fetchTopicsAction.fetchTopics}/>
		         			</div>			
					</div>
					<div id="rightpanel" className="col-sx-3 col-sm-4 col-md-4 col-lg-4">
						<div className="list-group ">
							<PostQueue scope='working' type='community' reportY={this.reportSelectedPostY} community={this.props.params.community} communityForums={this.props.forums} posts={this.props.posts.items} constraint_type={""} constraint_value={0} fetchPosts={this.props.fetchPostsAction.fetchPosts} clearPosts={this.props.clearPostsAction.clearPosts} state={this.props.posts} />
						</div>
					</div>	
			</div>
		)
	}
});
module.exports ={
	Newsline: connect(mapStateToProps,mapDispatchToProps)(Newsline),
	Items,
	Item:Item
} 

function mapStateToProps(state) {
 // console.log('INJECTING PROPS state.newsline=%o',state)
  return {

    topics: state.newsline.topics,
    posts:state.newsline.posts,
    forums:state.newsline.forums,
    ls:state.newsline.ls,
  };
}
function mapDispatchToProps(dispatch) {
  return {
  		fetchTopicsAction:bindActionCreators({ fetchTopics }, dispatch),
		clearTopicsAction:bindActionCreators({ clearTopics }, dispatch),
		fetchPostsAction:bindActionCreators({ fetchPosts }, dispatch),
		clearPostsAction:bindActionCreators({ clearPosts}, dispatch)
		};
}



