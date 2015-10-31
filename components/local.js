import React from 'react'
var ReactDisqusThread = require('react-disqus-thread');
var Local=React.createClass({
	
	
	render: function(){
        //console.log('LOCAL RENDER %o',this.props)
        if(this.props.topic.get("title")){
		var t=this.props.topic.get("title").replace(/"/g,'\'');
		t=t.replace(':','-');
		let url="http://qwiket.com/"+this.props.community+"/"+this.props.topic.get("threadid")+"/7/";
		//console.log('title=%s',t);
		//console.log('shortname=%s',this.props.community)
		//console.log('identifier=%s',this.props.topic.threadid)	
		//console.log('url=%s',url)
	   	return (
            <ReactDisqusThread
                shortname={this.props.community}
                identifier={this.props.topic.get("threadid")}
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