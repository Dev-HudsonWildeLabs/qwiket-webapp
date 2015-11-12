require("babel/register");
import React from 'react'
//import ReactTypeahead from 'react-twitter-typeahead'
import * as actions from './actions/topicAction.js';
import u from './d4shared/utils.jsx'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Item} from  './newsline.js' 
import {shareLink,submitTopic,updateState,selectCommunity} from './actions/topicAction';
import Community from './community'
//require('react-load-mask/index.css')
var LoadMask = require('react-load-mask')

var Topic=React.createClass({
    componentDidMount: function() {
        //console.log("componentDidMount %o",this.props.topic)
        let url=this.props.location.query.url;
        let me=this;
        if(this.props.topic.get("url")!=url){
            this.props.shareLinkAction.shareLink(url,this.props.topic);
        }
        if(__CLIENT__){
           // console.log("init locales")

            $('#post_edit_locales_selector').typeahead(null, {
                name: 'locales',
                valueKey:'id',
                displayKey: 'name',
                source:locales
            });
            console.log("init locale from %s",this.props.topic.get("locale"))
            $.ajax({
                url: "/api?task=load_locales",
                data:{
                    query:this.props.topic.get("locale").trim()
                },
                dataType: 'json'
            }).success(function(data) {
                //console.log(data);
                if(data.length==1){
                    var l=data[0];
                    if(l)
                        $('#post_edit_locales_selector').typeahead('val',l.name.trim());
                 }
            });
            $("#post_edit_locales_selector").on("typeahead:selected typeahead:autocompleted", function(e,datum) {
                //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
                me.props.updateStateAction.updateState(me.props.topic.merge({locale:datum.id}));
            /* me.selected_locale= datum.id;*/ console.log('selected '+datum.id)});
            let community=this.props.topic.get("community");
            if(!community){
                let communityName=this.props.communityState.get("communityName")
                community=this.props.communityState.get("forum");
               // console.log("BLANK COMMUNITY setting community=%s, communityName=%s",community,communityName);
                this.onCommunitySelect(this.props.history,community,communityName);
            }
            $(".rating").rating({
              stars: 3,
              max: 3,
              showClear: false,
              showCaption: false,
              size: 'xs'
            });
        }
    },
    componentWillReceiveProps(nextProps){
        let url=nextProps.location.query.url;
        let link=this.props.topic.get("url")
        console.log("URL=%s, LINK=%s",url,link)
        if(link!=url){
            console.log('calling shareLink')
           this.props.shareLinkAction.shareLink(url,this.props.topic);
        }
    },
    componentDidUpdate:function(prevProps, prevState){
        
        let url=this.props.location.query.url;
        let link=this.props.topic.get("url")
        console.log("URL=%s, LINK=%s",url,link)
        if(link!=url){
            console.log('adjusting urlk')
           this.props.history.pushState(null,"/publish/?url="+encodeURIComponent(link));   
        }   
        //console.log("REFRESH LOCALE %s",this.props.topic.get("locale"))
        // $('#post_edit_locales_selector').typeahead('val',this.props.topic.get("locale").trim());
        
        
    },
    
    onCommentChange(event){
        this.props.updateStateAction.updateState(this.props.topic.merge({text:event.target.value}));
    },
    onDescriptionChange(event){
        this.props.updateStateAction.updateState(this.props.topic.merge({description:event.target.value}));
    },
    onTitleChange(event){
        this.props.updateStateAction.updateState(this.props.topic.merge({title:event.target.value}));
    },
    onAuthorChange(event){
        this.props.updateStateAction.updateState(this.props.topic.merge({author:event.target.value}));
    },
    onSitenameChange(event){
        this.props.updateStateAction.updateState(this.props.topic.merge({site_name:event.target.value}));
    },
    onLocaleChange(event){
        console.log('onLocaleChange event=%o',event)
        this.props.updateStateAction.updateState(this.props.topic.merge({locale:event.target.value}));
    },
    onImageChange(event){ 
        this.props.updateStateAction.updateState(this.props.topic.merge({image:event.target.value}));
    },
    onCommunitySelect(history,community,community_name){
       // console.log('onCommunitySelect %s, props=%o',community,this.props)
        this.props.updateStateAction.updateState(this.props.topic.merge({community,community_name}));
    },
    submitTopic(){
        console.log('submitTopic')
        this.props.submitTopicAction.submitTopic(this.props.topic);
    },
    render: function(){
        console.log("RENDER TOPIC")
        let html='';
        let shared_by;
        
        let image=this.props.topic.get("image");
        let author=u.entityToHtml(this.props.topic.get("author"));
       //  console.log('before convert =%s',this.props.topic.get("description"))
        let description=u.entityToHtml(this.props.topic.get("description"));
       //  description=u.entityToHtml(description); //second convert just in case
         description=u.entityToHtml(description); //second convert just in case
      //  console.log(description)
        let title=u.entityToHtml(this.props.topic.get("title"));
        let text=u.entityToHtml(this.props.topic.get("text"));
        if(!text)
            text='';
        let site_name=u.entityToHtml(this.props.topic.get("site_name"));
        let locale=this.props.topic.get("locale");
        let owner=this.props.topic.get("owner");
        let feed=this.props.topic.get("feed");
        let reshare=this.props.topic.get("reshare");
        let threadid=this.props.topic.get("threadid");
        let updated_time=this.props.topic.get("updated_time");
        let communityName=this.props.topic.get("community_name");
        let community=this.props.topic.get("community");
        
        if(!communityName){
            communityName=this.props.communityState.get("communityName")
          
            community=this.props.communityState.get("forum");
            console.log("BLANK COMMUNITY setting community=%s, communityName=%s",community,communityName);
           // setTimeout(this.onCommunitySelect(this.props.history,community,communityName));
        }
        if(!locale){
            locale='en_EN';
             $('#post_edit_locales_selector').typeahead('val','English');
            //setTimeout(this.props.updateStateAction.updateState(this.props.topic.merge({locale:'en_US'})));
        }
        console.log("communityname=%s",communityName)
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
                float:"right",
                marginRight:17
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
       // console.log("IMAGE=%s",image);
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
                <h2 className="jumbotron">Publish link
                     
                </h2>
              
                <form className="form-horizontal" role="form">
                    {shared_by}
                    <div className="form-group" > 
                         <label className="control-label col-xs-2" htmlFor="community_dropdown">
                            Publish to:
                        </label>
                        <div style={styles.community} className="form-control col-xs-10" >
                            <Community styles={styles} ref="TopicCommunity" ls={this.props.communityState.get("ls")} communities={this.props.communityState.get("communities")} communityName={communityName} select={this.onCommunitySelect} history={this.props.history}/>
                        </div>
                    </div>
                    <div  className="form-group " > 
                        <label className="control-label col-sm-2" htmlFor="post_edit_text">
                            Comment:
                        </label>
                        <div className= "col-sm-10">
                            <textarea disabled={isDisabled ? "disabled" : false} className="form-control" rows="2"onChange={this.onCommentChange} id="post_edit_text" value={text}>
                            
                            </textarea>
                        </div>
                    </div>
                    <div className="form-group " > 
                        <label className="control-label col-sm-2"  htmlFor="post_edit_title">Title:</label>
                        <div className= "col-sm-10">
                            <input disabled={isDisabled ? "disabled" : false} type="text" className="form-control input-small" id="post_edit_title" onChange={this.onTitleChange} value={title}/>
                        </div>
                    </div>
                    <div className="form-group "> 
                        <label className="control-label col-sm-2" htmlFor="image_static"></label>  
                        <div className="col-sm-10">
                            <p className="form-control-static">
                             <div style={{float:"right"}}><Item topic={this.props.topic} full={true} orderby={0}/></div>
                               </p>    
                        </div>  
                    </div>
                    <div className="form-group " > 
                        <label className="control-label col-sm-2"  htmlFor="post_edit_image">Image:</label>
                        <div className= "col-sm-10">
                            <input disabled={isDisabled ? "disabled" : false} type="text" className="form-control" id="post_edit_image"onChange={this.onImageChange}  value={image}/>
                        </div>
                    </div>
                   <div  className="form-group" > 
                        <label className="control-label col-sm-2" htmlFor="post_edit_description">Quote:</label>
                        <div className= "col-sm-10">
                            <textarea disabled={isDisabled ? "disabled" : false} className="form-control col-sm-8" rows="8" id="post_edit_description" onChange={this.onDescriptionChange} value={description}></textarea>
                        </div>
                    </div>
                   <div className="form-group" > 
                        <label className="control-label col-sm-2" htmlFor="post_edit_site_name">Site Name:</label>
                        <div className= "col-sm-10">
                            <input disabled={isDisabled ? "disabled" : false} type="text" className="form-control" id="post_edit_site_name" onChange={this.onSitenameChange} value={site_name}/>
                        </div>
                    </div>
                    <div className="form-group"> 
                        <label className="control-label col-sm-2" htmlFor="post_edit_author">Author:</label>
                        <div className= "col-sm-10"><input disabled={isDisabled ? "disabled" : false} type="text" className="form-control" id="post_edit_author" onChange={this.onAuthorChange} value={author}/></div>
                    </div>
                    <div id="prefetch_locales" className="form-group"> 
                        <label className="control-label col-sm-2" htmlFor="post_edit_locales_selector">Language:</label>
                        <div className= "col-sm-10"><input disabled={isDisabled ? "disabled" : false} id="post_edit_locales_selector"  type="text" className="form-control" onChange={this.onLocaleChange} placeholder="Locales" /></div>
                    </div>
                    <div className="form-group" >
                        <div style={styles.button}>
                                <button id="post_item_submit" onClick={this.submitTopic} type="button" className="btn btn-success ">Submit</button>
                        </div>
                    </div>
                </form>
                <LoadMask visible={this.props.topic.get("isSubmitting")}/>
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
        submitTopicAction:bindActionCreators({ submitTopic }, dispatch),
        updateStateAction:bindActionCreators({updateState},dispatch),
        selectCommunityAction:bindActionCreators({selectCommunity},dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(Topic)
function decodeHtml(html) {
    if(__CLIENT__){
        var txt = document.createElement("textarea");

        txt.innerHTML = html;
        return txt.value;
    }
    else
        return html;
}
if(__CLIENT__){
    var locales = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('id'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url:'/api?task=load_locales',
            cache:false
         }, 
          remote: {
            url: '/api?task=load_locales&query=%QUERY',
            wildcard: '%QUERY'
        }
    });
}
