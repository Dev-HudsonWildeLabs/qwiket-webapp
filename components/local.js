import React from 'react'
var ReactDisqusThread = require('react-disqus-thread');
var Local=React.createClass({
	
	
	render: function(){
    let topic=this.props.topic.toObject();
        //console.log('LOCAL RENDER %o',this.props)
    if(topic.title){
  		var t=topic.title.replace(/"/g,'\'');
  		t=t.replace(':','-');
  		let url="http://qwiket.com/"+this.props.community+"/"+topic.threadid+"/7/";
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
                  categoryId="3710580"/>
          );
     }
     else {
        return(
          <div/>)
     }
  }
});
module.exports = Local;