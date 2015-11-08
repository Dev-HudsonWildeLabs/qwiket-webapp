//require("babel/register");
var React = require('react');
import Radium from 'radium'

import {Link} from 'react-router'

//import {selectCommunity} from './actions/appAction.js';
//<Link to={"/newsline/"+forum+"/newest"}>
let Community=React.createClass({
    
    //setTimeout(()=>this.props.selectCommunity(this.props.params.community)
    onSelect:function(forum,event){
        console.log("onSelect %s",forum)
        setTimeout(()=>this.props.select(this.props.history,forum));
    },
    render:function(){
        //console.log('Community render %o',this.props.communityName)
        let lines=[];
        //console.log('RENDER Community: this.params=%o',this.props)
        //console.log('render %o',this.state);
        /*for(var i=0;i<this.props.communities.count;i++){ 
            let c=this.props.communities[i]
            lines.push(<li id={"community_"+c.forum} key={"key_community_"+c.forum}><Link to={"/newsline/"+c.forum+"/newest"}><span className="glyphicon glyphicon-log-in"></span> {c.name}</Link></li>);
        }*/
     
        var styles=this.props.styles;
        this.props.communities.forEach((item,index,array)=>{
            let forum=item.get("forum");
            let name=item.get("name");
           // console.log("forum %s",forum)
            lines.push(<li id={"community_"+forum} key={"key_community_"+forum} style={styles.dropdownLine} onClick={this.onSelect.bind(this,forum)}><span className="glyphicon glyphicon-log-in"></span> {name}</li>);
        })
        
    
        return(
            <div className="dropdown">
                <a className="dropdown-toggle" data-toggle="dropdown" href="#" style={styles.communityName}>{this.props.communityName}
                    <span className="caret"></span></a>
                    <ul className="dropdown-menu dropdown-menu-right">
                        {lines}
                    </ul>
            </div>        
        )
    }
});


Community=Radium(Community)
module.exports = Community;