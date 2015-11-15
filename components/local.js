import React from 'react'
var ReactDisqusThread = require('react-disqus-thread');
var Local=React.createClass({
	
	 handleNewComment: function(comment) {
        console.log(comment.text);
    },
	render: function(){
    let topic=this.props.topic.toObject();
        //console.log('LOCAL RENDER %o',this.props)
    if(topic.title){
  		var t=topic.title.replace(/"/g,'\'');
  		t=t.replace(':','-');
  		let url="http://qwiket.com/context/"+this.props.community+"/topic/"+topic.threadid;
  		console.log('title=%s',t);
  		console.log('shortname=%s',this.props.community)
  		console.log('identifier=%s',topic.threadid)	
  		console.log('url=%s',url)
  	  return (
              <ReactDisqusThread
                  shortname={this.props.community}
                  identifier={topic.threadid}
                  title={t}
                  url={url}
                  categoryId="3710580"
                  onNewComment={this.handleNewComment}/>

          );
     }
     else {
        return(
          <div/>)
     }
  }
});
module.exports = Local;