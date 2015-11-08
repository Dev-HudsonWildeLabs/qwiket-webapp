require("babel/register");
import React from 'react'
//import ReactTypeahead from 'react-twitter-typeahead'
import * as actions from './actions/topicAction.js';
import u from './d4shared/utils.jsx'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {shareLink,submitTopic} from './actions/topicAction';
import Community from './community'
var Topic=React.createClass({
    
    onCommentChange(event){

    },
    render: function(){
        let html='';
        let shared_by;
        let image;

        let author=this.props.topic.get("author");
        let description=this.props.topic.get("description");
        let title=this.props.topic.get("title");
        let text=this.props.topic.get("text");
        let site_name=this.props.topic.get("site_name");
        let locale=this.props.topic.get("locale");
        let owner=this.props.topic.get("owner");
        let feed=this.props.topic.get("feed");
        let reshare=this.props.topic.get("reshare");
        let threadid=this.props.topic.get("threadid");
        let updated_time=this.props.topic.get("updated_time");
        console.log('topic: %o',this.props.topic.toObject())
        var styles={
            community:{
              
                float:"right",
                maxWidth:300,
                marginRight:17

            },
            outer:{
                backgroundColor:'#fff'
            },
            communityName:{
                color:'#000',
                float:"right",
                textDecoration:'none',
                marginLeft:0,
            },
            dropdownLine:{
                padding:4,
                maxWidth:400
            },
            button:{
                float:"right"
            }

        }

        if(!this.props.topic.get("user_name")){
            shared_by=( <div className="form-group col-sm-12">  <div className="col-sm-6"><p className="form-control-static">Not shared yet</p>    </div>  </div>);
        }
        else {
            var objDate=new Date(+updated_time*1000);
            //shared_by='Shared by '+user_name+' on '+formatDate(objDate);  
            shared_by=(
                <div className="form-group col-sm-12">  
                    <p className="form-control-static">Shared by {this.props.topic.get("user_name")} on {u.formatDate(objDate)}</p>
            </div> );
        }
        if(!author) author='';
        if(!description) description='';
        if(!image) image='';
        if(!title) title='';
        if(!site_name) site_name='';
        if(!locale) locale='';
        //title=title.replace('"','\x22');
        var isDisabled=true;
        //console.log('owner=%o,feed=%o,reshare=%o',owner,feed,reshare)
        if(+owner||(+feed&&!+reshare)){
            isDisabled=false;
        }
     
        return (
            <div className="item-edit container" threadid={'"'+threadid+'"'} style={styles.outer}>
                <h2 className="jumbotron">Publish link</h2>
                <form className="form-horizontal" role="form">
                    
                    {shared_by}
                    <div className="form-group" id="community_group"> 
                         <label className="control-label col-xs-2" htmlFor="community_dropdown">
                            Publish to:
                        </label>
                        <div id="community_dropdown" style={styles.community} className="form-control col-xs-10" >
                            <Community styles={styles} ref="Community" ls={this.props.communityState.get("ls")} communities={this.props.communityState.get("communities")} communityName={this.props.communityState.get("communityName")} select={this.props.selectCommunity} history={this.props.history}/>
                        </div>
                    </div>
                   

                   
                    <div  className="form-group " id="post_edit_group"> 
                        <label className="control-label col-sm-2" htmlFor="post_edit_text">
                            Comment:
                        </label>
                        <div className= "col-sm-10">
                            <textarea disabled={isDisabled ? "disabled" : false} className="form-control" rows="2"onChange={this.onCommentChange} id="post_edit_text" value={text}>
                            
                            </textarea>
                        </div>
                    </div>
                    
                 
                    <div className="form-group " id="title_form_group"> 
                        <label className="control-label col-sm-2"  htmlFor="post_edit_title">Title:</label>
                        <div className= "col-sm-10">
                            <input disabled={isDisabled ? "disabled" : false} type="text" className="form-control input-small" id="post_edit_title" value={title}/>
                        </div>
                    </div>

                    <div className="form-group "> 
                        <label className="control-label col-sm-2" htmlFor="image_static"></label>  
                        <div className="col-sm-10">
                            <p className="form-control-static">
                                <img id="item_edit_image_output" className="img-responsive" src={image}/>
                            </p>    
                        </div>  
                    </div>
                    <div className="form-group " id="image_form_group"> 
                        <label className="control-label col-sm-2"  htmlFor="post_edit_image">Image:</label>
                        <div className= "col-sm-10">
                            <input disabled={isDisabled ? "disabled" : false} type="text" className="form-control" id="post_edit_image" value={image}/>
                        </div>
                    </div>
                   <div  className="form-group" id="description_form_group"> 
                        <label className="control-label col-sm-2" htmlFor="post_edit_description">Quote:</label>
                        <div className= "col-sm-10">
                            <textarea disabled={isDisabled ? "disabled" : false} className="form-control col-sm-8" rows="8" id="post_edit_description" value={description}></textarea>
                        </div>
                    </div>
                   <div className="form-group" id="site_name_form_group"> 
                        <label className="control-label col-sm-2" htmlFor="post_edit_site_name">Site Name:</label>
                        <div className= "col-sm-10">
                            <input disabled={isDisabled ? "disabled" : false} type="text" className="form-control" id="post_edit_site_name" value={site_name}/>
                        </div>
                    </div>
                    <div className="form-group"> 
                        <label className="control-label col-sm-2" htmlFor="post_edit_author">Author:</label>
                        <div className= "col-sm-10"><input disabled={isDisabled ? "disabled" : false} type="text" className="form-control" id="post_edit_author" value={'"'+author+'"'}/></div>
                    </div>
                    <div id="prefetch_locales" className="form-group"> 
                        <label className="control-label col-sm-2" htmlFor="locales_selector">Language:</label>
                        <div className= "col-sm-10"><input disabled={isDisabled ? "disabled" : false} id="locales_selector"  type="text" className="form-control" placeholder="Locales"/></div>
                    </div>
                    <div className="form-group" >
                        <div style={styles.button} className=" col-xs-2 col-lg-1">
                                <button id="post_item_cancel" type="button" className="btn btn-default ">Cancel</button>
                        </div>
                        <div style={styles.button}>
                                <button id="post_item_submit" type="button" className="btn btn-success ">Submit</button>
                        </div>
                        
                    </div>

                 
                </form>
            </div>);
       
    }
});

function mapStateToProps(state) {
  return {
   topic:state.topic,
   communityState:state.app.get("community"),
  };
}
function mapDispatchToProps(dispatch) {
  return {
        shareLinkAction:bindActionCreators({ shareLink }, dispatch),
        submitTopicAction:bindActionCreators({ submitTopic }, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(Topic)