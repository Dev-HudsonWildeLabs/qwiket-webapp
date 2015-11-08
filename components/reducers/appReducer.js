
import 'babel-core/polyfill';
import Immutable from 'immutable';
import * as actions from '../actions/appAction';

export default function app(state = 0, action) {
//  console.log('app reducer state=%o, action=%o,action.type=%s',state,action,action.type)
  switch (action.type) {
  case actions.SELECT_COMMUNITY:
//  console.log('*****************************    *****    ACTION=%o',action)
    /* return Object.assign({}, state, {
      community:{
        communityName: action.communityName,
        forum:action.community,
        communities:state.community.communities,
        ls:state.community.ls
      }});
*/
    setTimeout(()=> action.history.pushState(null,"/newsline/"+action.community+"/newest"));      
    return state.set('community',new Immutable.Map({
        communityName: action.communityName,
        forum:action.community,
        communities:state.get("community").get("communities"),
        ls:state.get("community").get("ls")
      }))
    case actions.NAVIGATE_TO_COMMUNITY:
     // console.log("NAVIGATE_TO_COMMUNITY")
     
    return state;

  default:
    return state;
  }
}
