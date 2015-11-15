import Immutable from 'immutable';

import * as newslineActions from '../actions/newslineAction';
import * as contextActions from '../actions/contextAction';
import * as postActions from '../d4shared/actions/postsAction';
import * as appActions from '../actions/appAction';



function createdatSort(b,a) {
  return a.createdat-b.createdat;
}

export default function context(state = new Immutable.Map({}), action) {
  //console.log('context reducer state=%o',state)
  switch (action.type) {
  

  case contextActions.CLEAR_CONTEXT_TOPIC:
    return state.set("topic",new Immutable.Map({}))
  //return Object.assign({}, state, {topic:{}}); 
  
  case contextActions.REQUEST_CONTEXT_TOPIC:
    return state.set("isFetching",true);
  //return Object.assign({}, state, {isFetching:true}); 
  case appActions.LOADED_COMMUNITY_FORUMS:

  //console.log("FORUMS: %o",action.forums)
    return state.merge({
     
      sideTopics:new Immutable.Map({
        items:new Immutable.List([]),
        lastids:new Immutable.List([]),
        isFetching:false,
      }) 
    })


  case contextActions.RECEIVE_CONTEXT_TOPIC:
 // console.log("RECEIVE_CONTEXT_TOPIC %o",action)
  //return Object.assign({}, state, 
    return state.merge({
        isFetching:false,
        topic:action.topic,
        nativeD4:action.nativeD4,
        qwiketD4:action.qwiketD4,
        nativeForumid:action.nativeForumid,
        qwiketForumid:action.qwiketForumid,
        nativeThread:action.nativeThread,
        qwiketThread:action.qwiketThread
    }); 
   



 case newslineActions.REQUEST_TOPICS:
    return state.merge({
      sideTopics:{
        isFetching: true,
        items:state.get("sideTopics").get("items"),
        lastid:state.get("sideTopics").get("lastid")
      }
        
  }); 
  case newslineActions.RECEIVE_TOPICS:
 // console.log("RECEIVE_TOPICS")
  if(!action.items||action.items.length==0||!action.sideTopics)
    return state;
  let oldItems=state.get("sideTopics").get("items");
  let items1
  items1=new Map();
  //console.log('first:'+oldItems.length)
  for (var i=0;i<oldItems.count();i++){
    //if(i>100)
    //  break;
    let item=oldItems.get(i);
    items1.set(item.get("xid"),item);
  }
  let actionItems=Immutable.fromJS(action.items) 
  for (i=0;i<actionItems.count();i++){
      let item=actionItems.get(i);
     
      //console.log('setting new item '+item.qpostid)
      items1.set(item.get("xid"),item);
  }
  let items2=[...items1.values()];
  let items=items2.sort((a,b)=> b.get("sort")-a.get("sort"))
  let lastid=items[items.length-1].get("xid")
  items=new Immutable.List(items);
   // unique(combine(oldItems,items));
   if(!action.sideTopics) 
    return state;
   else
    return  state.merge({
     
      sideTopics:{
          isFetching: false,
          items,
          lastid
        }
      
    });  
  case newslineActions.CLEAR_TOPICS:
  if(!action.sideTopics) 
   state
  else
    return state.merge({
      
      sideTopics:{
          isFetching: false,
          items:new Immutable.List([]),
          lastid:0
        }
       
    })









 
  default:
    return state;
  }
}