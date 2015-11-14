require("babel/register");
import React from 'react'
import ReactDom from 'react-dom';
import {Link} from 'react-router';
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

var QwiketLink=React.createClass({
    componentDidMount() {
        //$(ReactDom.findDOMNode(this.refs.innerWrapper)).height( $(window).height());
        //$('body').css('overflow','hidden');
    },
    onBack(){
        console.log('history=%o',this.props.history);
        this.props.history.goBack();   
        //this.props.params.postid
    },
     componentDidUpdate(prevProps, prevState){
        //console.log("********************************************************************************************************************")
       //$(ReactDom.findDOMNode(this.refs.innerWrapper)).height( $(window).height());
       // $('body').css('overflow','hidden');
        
    },
    
    render(){
        console.log("LINK RENDER")
        let height='100%';
        if(__CLIENT__)
            height=$(window).height();
        return (
          
        <div id="target_wrapper">
            <div id="target_top" style={{height:0}}>
                <a id="return_newsline" href="#" onClick={this.onBack} data-toggle="tooltip" title="Click here to return to <?php  echo $productname ?>"> 
                    <i className="fa fa-arrow-circle-o-left fa-4x" style={{opacity:0.4,marginLeft:5}}></i>
                </a>  
            </div>
            <div id="target_inner_wrapper">
                <iframe refs="innerWrapper" frameBorder="0" style={{width:'100%',height:height}} src={this.props.params.url}></iframe>
            </div>
        </div>);
    }
});
module.exports =QwiketLink;
