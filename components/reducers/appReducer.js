
import 'babel-core/polyfill';
import Immutable from 'immutable';
import * as actions from '../actions/appAction';

export default function app(state = 0, action) {
  //console.log('app reducer state=%o')
  switch (action.type) {
  case actions.SELECT_COMMUNITY:
  console.log('ACTION=%o',action)
    /* return Object.assign({}, state, {
      community:{
        communityName: action.communityName,
        forum:action.community,
        communities:state.community.communities,
        ls:state.community.ls
      }});
*/
    return state.set('community',new Immutable.Map({
        communityName: action.communityName,
        forum:action.community,
        communities:state.get("community").get("communities"),
        ls:state.get("community").get("ls")
      }))
  default:
    return state;
  }
}
