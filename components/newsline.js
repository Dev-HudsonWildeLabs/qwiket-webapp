require("babel/register");
import React from 'react'
import ReactDom from 'react-dom';

import u from './d4shared/utils.jsx'
import PostQueue from './d4shared/postqueue.jsx'
import Radium from 'radium'
import {Link,History} from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {fetchTopics,clearTopics,startTransition} from './actions/newslineAction';
import {invalidateContext} from './actions/contextAction';
import {fetchPosts,clearPosts} from './d4shared/actions/postsAction';


var Item=React.createClass({
	mixins: [ History ],
	itemClick:function(e,t){
		//console.log('item clicked')
		if(this.props.full){
			//console.log('do nothing')
		}
		else {
			window.scrollTo(0, 0);
			//console.log("calling invalidateContext")
			this.props.invalidateContext();
			startTransition(this.props.topic.get("threadid"),this.props.sideTopics);
			this.history.pushState(null,'/context/'+this.props.community+'/topic/'+this.props.topic.get("threadid"));
		}
	},
	shareFB(){
		//console.log('shareFB ',this.props.community);
		u.popupHandler('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('http://qwiket.com/context/'+this.props.community+'/topic/'+this.props.topic.get("threadid")));
	},
	render:function(){
		if(!this.props.topic)
			return <div/>
		let topic=this.props.topic.toObject();
		//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ topic=%o",topic);
		let threadid=topic.threadid;
		let link=topic.url;
		link="/link/"+encodeURIComponent(link);
		//console.log('link=%s',link)
		let text=topic.text;
		let image=topic.image;
		let title=topic.title;
		let site_name=topic.site_name;
		let description=topic.description;
		let author=topic.author;
		let date=topic.date;
		let user_name=topic.user_name;
		let rating=topic.rating;
		let shared_by_profileurl=topic.shared_by_profileurl;
		let shared_by_avatar=topic.shared_by_avatar;
      	let orderby=this.props.orderby;
		let sitename=(typeof(this.props.sitename)!='undefined'&&this.props.sitename)?this.props.sitename:'';	
		if(!description&&!title&&!text)
			return <div/>
	   // console.log('topic=%o',topic);
	    //console.log("shared_by_avatar=%s",shared_by_avatar)
	    var html='';
	    if(!description)
	        description='';
	    if(!text)
	        text='';
	    if(!title)
	        title='';
	    if(!rating)
	        rating=0;
	    else
	        rating=+rating;  
	       var  description_length=2048;
	        var text_length=2048;
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
	    			fontSize: '1.6rem'
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
  					display: "block",
   	 				marginTop: 10,
  					verticalAlign: "bottom",
  					fontSize: '1.4rem'
	    		},
	    		footer:{
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
	    			padding:"5px 0 0 5px",
	    			color:"#555",
	    			margin:0,
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
	    let s=(<span/>);
	    if(date)
	    	s=(<span ref="SharedBySpan" style={styles.sharedby}>{sb}&nbsp;<a ref="SharedByLink" style={styles.sblink} href={shared_by_profileurl} target="_blank">{user_name}</a>&nbsp;{pb}
	        		<span >{u.timeConverter(date,(window.firstRender?topic.stamp:0))}</span>
	        	</span>);
	    let comment=(<span/>);
	    if(text&&!sitename){
	    	let avatar=<div/>;

	    	if(shared_by_avatar)
	    		avatar=<img className="post-image img-responsive" style={{maxWidth:'10%',height:"auto", float:"left",clear:"right",marginRight:"10px",marginBottom:"4px"}} src={shared_by_avatar}/>
	    	comment=(<div ref="ItemComment" className="small alert alert-info col-xs-12" style={styles.comment}>{avatar}{text}</div>)
	    }
	    let authorHtml=(<span/>)
	    if(author){
	    	authorHtml=(<div ><em>{author}</em></div>);
	    }
	   // console.log("about to return from topic render link=%s",link)
	    /*
	  	<li><Link  className="discuss" to={"/local/"+threadid}><i className="fa fa-share-alt fa-fw fa-sm"></i>&nbsp;Share link</Link></li>
				      	<li><Link  className="discuss" to={"/local/"+threadid}><i className="fa fa-hand-paper-o fa-fw fa-sm"></i>&nbsp;Unplug this Feed</Link></li>
				   
				    */
	    return (
	    <div ref="NewsItem"  className="list-group-item" threadid={threadid} style={styles.post}>
	        <div>
		       {s}
        		<div ref ="ItemMenu" className="dropdown"  style={styles.menu}>
				   	<button type="button" className="btn btn-link dropdown-toggle"  data-toggle="dropdown" >
				   		{(!sitename)?(<i className="fa fa-bars fa-lg"></i>):(<i className="fa fa-bars fa-sm"></i>)}
				   	</button>
					<ul className="dropdown-menu dropdown-menu-right" >
				      	<li><Link  className="discuss" to={'/context/'+this.props.community+'/topic/'+this.props.topic.get("threadid")}><i className="fa fa-comments-o fa-fw fa-sm"></i>&nbsp;Comments</Link></li>
				      	<li><Link  className="discuss" to={'/publish/?url='+encodeURIComponent(topic.url)}><i className="fa fa-thumbs-o-up fa-fw fa-sm"></i>&nbsp;Reshare on Qwiket</Link></li>
				      	<li><a  href='#' onClick={this.shareFB} className="discuss" to={"/local/"+threadid}><i className="fa fa-facebook fa-fw fa-sm"></i>&nbsp;Share on Facebook</a></li>
				    </ul>
					</div>	

	        </div>
	        <div >
		      	<div>
		      	{comment}
		    	</div>
		      	<div>
		    		<Link ref="ItemTitle" to={link}   style={styles.title} dangerouslySetInnerHTML={{__html: title}}></Link>
		    	</div>
		    	
		      	<div ref="Topic" style={styles.topic} >
		        	<img ref="TopicImage" className="topic-image img-responsive" style={styles.image} src={image} onClick={this.itemClick}></img>
		        	<blockquote-reverse onClick={this.itemClick}><div dangerouslySetInnerHTML={{__html: description}}></div></blockquote-reverse>
		        	{author}
		        	<div style={styles.sitename} onClick={this.itemClick}>&copy;{site_name}</div>
		        	<Link to={link} style={styles.linkmore} >{this.props.full?"Click here to read the full article.":""}</Link>
		    
		    	</div>
		    	<div ref="ItemFooter" style={styles.footer} > 
			    	<div ref="ItemRatings" style={styles.ratings}>
			    		{(!sitename)?(<input style={{marginTop:0}}className="rating" data-size="xs" data-symbol={"\uf0f4"} data-glyphicon="false" data-rating-class="rating-fa" data-default-caption="{rating} cups" data-star-captions="{}" stars="3" value={rating}></input>):""}
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
		this.fetch(true,false,this.props);
	},
	bottomScroll:function(name,e){
		//console.log("bottomScroll")
		this.fetch(false,false,this.props);
	},
	componentDidMount: function() {
		u.registerEvent('topScroll',this.topScroll,{me:this});
		if(this.props.topics.count()==0)
			this.fetch(true,true,this.props)
		$(".rating").rating({
            stars:3,
            max:3,
            showClear:false,
            showCaption:false,
            size:'xs'
        });
	},
	componentWillUnmount:function(){
		u.unregisterEvents('topScroll',this);
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

	fetch:function(clear,remove,props){
	//	console.log("ITEMS FETCH")
		if(remove)
			props.clearTopics();
		props.fetchTopics(clear,props.community,props.orderby,props.state,this.props.sideTopics,props.state.get("lastid"),props.sitename,25,props.query);
	},
	componentWillReceiveProps:function(nextProps){
		if(this.props.orderby!=nextProps.orderby||this.props.query!=nextProps.query||this.props.community!=nextProps.community||this.props.sitename!=nextProps.sitename){
		   // console.log('componentWillReceiveProps props=%o',nextProps)
			this.fetch(true,true,nextProps);
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
  	if(!this.props.topics.equals(nextProps.topics))
  		return true;
  	else return false;
	},
	render:function(){
		let rows=[];
		//let topics=this.props.topics;
		//let l=topics.length;
		let sitename=(typeof(this.props.sitename)!='undefined'&&this.props.sitename)?this.props.sitename:'';
	//	console.log("sitename = %o",sitename)
		//console.log('length=%s',l)
		//for(var i=0;i<l;i++){
		this.props.topics.forEach((p,i)=>{
			let xid=p.get("xid");
	  		let cb=(c) =>{
	  			if(!c){
					u.unregisterEvents('bottomScroll',this);
	  			}
	  			else if(c.props.lastRow){
	  				let el= ReactDom.findDOMNode(c);
					let j=$(el);
					let offset=j.offset()
				//	u.unregisterEvents('bottomScroll',this);
					u.registerEvent('bottomScroll',this.bottomScroll,{me:this,y:offset.top});
	  			}
	  		};
	  		let lr=(i==(this.props.topics.count()-1));
	  		/*if(lr){
	  			console.log("---LAST ROW RENDERING ---");
	  		}*/
	  	  	rows.push(
	  			<Item key={xid} sitename={sitename} community={this.props.community} sideTopics={this.props.sideTopics} ref={cb} lastRow={lr} topic={p} full={false} orderby={this.props.orderby} invalidateContext={this.props.invalidateContext} startTransition={this.props.startTransition}/>
  			)
	  	})
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
		let me=this;
		$('#topics_search').keypress(function(e){
	        if(e.which == 13){//Enter key pressed
	           me.searchButtonClick();
	        }
   		});
	},	
	searchButtonClick:function(){
		this.props.history.pushState(null,"/newsline/"+this.props.params.community+"/"+this.props.params.orderby+"/?search="+$('#topics_search').val());
	},
	clearButtonClick:function(){
		$('#topics_search').val('');
		this.props.history.pushState(null,"/newsline/"+this.props.params.community+"/"+this.props.params.orderby+"/");
	},
	reportSelectedPostY:function(y){
	
	},
	render: function(){
		if(typeof(this.props.params.orderby)=='undefined'){
			this.props.history.pushState(null,'/newsline/'+this.props.params.community+'/newest');
		}

		let { query } = this.props.location
    	let search = query && query.search ? query.search : '';
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
		return (
			<div className="container" >				
				<div id="leftpanel" className="col-xs-7 col-sm-8 col-md-8 col-lg-8" >
					<div className="row">
							<div className="form-inline col-xs-12" style={{float:"right",marginBottom:15,backgroundColor:"#8888AA",borderTopLeftRadius:"4px",borderTopRightRadius:"4px",borderBottomRightRadius:"4px"}} role="form">           
					            <button type="button" id="topics_search_clear_btn" onClick={this.clearButtonClick}  style={{float:"right",marginRight:5,marginTop:10}} className="btn btn-default visible-sm visible-md visible-lg"><i className="fa fa-times"></i></button>
					            <button onClick={this.searchButtonClick} type="button"   id="topics_search_btn" style={{float:"right",marginTop:10,marginRight:5}} className="btn btn-default "><i className="fa fa-search"></i></button>
				        		<label className="visible-md visible-lg" style={{marginTop:15,marginLeft:2,float:"left",color:"#fff"}}> Search:</label>
				        		<label className="visible-sm" style={{marginTop:15,marginLeft:12,float:"left",color:"#fff"}}> <i className="fa fa-search fa-lg"></i></label>
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
	         					<Items 	query={search}  
	         							orderby={orderby} 
	         							community={this.props.params.community} 
	         							sideTopics={false} 
	         							topics={this.props.topics.get("items")} 
	         							state={this.props.topics} 
	         							clearTopics={this.props.clearTopicsAction.clearTopics} 
	         							fetchTopics={this.props.fetchTopicsAction.fetchTopics} 
	         							invalidateContext={this.props.invalidateContextAction.invalidateContext} 
	         							startTransition={this.props.startTransitionAction.startTransition}/>
	         			</div>			
				</div>
				<div id="rightpanel" className="col-xs-5 col-sm-4 col-md-4 col-lg-4">
					<div className="list-group ">
						<PostQueue scope='working' type='community' reportY={this.reportSelectedPostY} community={this.props.params.community} communityForums={this.props.forums} posts={this.props.posts.get("items")} constraint_type={""} constraint_value={0} fetchPosts={this.props.fetchPostsAction.fetchPosts} clearPosts={this.props.clearPostsAction.clearPosts} state={this.props.posts} />
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
  return {
    topics: state.newsline.get("topics"),
    posts:state.newsline.get("posts"),
    forums:state.newsline.get("forums"),
    ls:state.newsline.get("ls"),
  };
}
function mapDispatchToProps(dispatch) {
  return {
  		startTransitionAction:bindActionCreators({startTransition},dispatch),
  		invalidateContextAction:bindActionCreators({ invalidateContext }, dispatch),
		fetchTopicsAction:bindActionCreators({ fetchTopics }, dispatch),
		clearTopicsAction:bindActionCreators({ clearTopics }, dispatch),
		fetchPostsAction:bindActionCreators({ fetchPosts }, dispatch),
		clearPostsAction:bindActionCreators({ clearPosts}, dispatch)
	};
}



