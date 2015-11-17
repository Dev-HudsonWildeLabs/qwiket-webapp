import React from 'react'
var ReactDisqusThread = require('react-disqus-thread');
var Local=React.createClass({
	
	 handleNewComment: function(comment) {
      //  console.log(comment.text);
    },
	render: function(){
    let topic=this.props.topic.toObject();
       // console.log('LOCAL RENDER %s',this.props.community)
    if(topic.title){
  		var t=topic.title.replace(/"/g,'\'');
  		t=t.replace(':','-');
  		let url="http://qwiket.com/context/"+this.props.community+"/topic/"+topic.threadid;
  		//console.log('title=%s',t);
  	//	console.log('shortname=%s',this.props.community)
  		//console.log('identifier=%s',topic.threadid)	
  	//	console.log('url=%s',url)
  	  return (
              <ReactDisqusThread
                  shortname={this.props.community}
                  identifier={topic.threadid}
                  title={t}
                  url={url}
                 
                  onNewComment={this.handleNewComment}/>

          );
     }
     else {
        return(
          <div/>)
     }
  }
  /*
  render:function(){

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
       disqus_shortname =this.props.community
       disqus_identifier=topic.threadid
       disqus_url=url
       disqus_title = t;
    return  (
    <div>
    <div id='disqus_thread' ></div>
    <noscript>Please enable JavaScript to view the <a href='https://disqus.com/?ref_noscript' rel='nofollow'>comments powered by Disqus.</a></noscript>
    </div>
        );
  }
  else return (<div/>)
  }*/
});
module.exports = Local;
 /* * * CONFIGURATION VARIABLES * * */
     /*   var disqus_shortname ;
        var disqus_identifier;
        var disqus_url;
        var disqus_title;
        var disqus_config = function () {
          this.language ='EN'
        };*/
        
        /* * * DON'T EDIT BELOW THIS LINE * * */
      

      /*  (function() {
          if(__CLIENT__){
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
          }
        })(); */