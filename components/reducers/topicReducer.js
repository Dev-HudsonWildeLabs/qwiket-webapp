import 'babel-core/polyfill';
import Immutable from 'immutable';
import * as actions from '../actions/topicAction';
export default function topic(state = new Immutable.Map({
  isSubmitting: false,
  owner: "",
  threadid: "",
  url: "",
  community: "",
  text: "",
  title: "",
  image: "",
  site_name: "",
  description: "",
  user_name: "",
  updated_time: "",
  shared_time: "",
  reshare: "",
  author: "",
  locale: "fr"
  }), action) {
  console.log("TOPIC REDUCER action=%o",action)
  switch (action.type) {
    case actions.START_SHARE_LINK:
      return state.merge( {
        isSubmitting: true,
        url: action.url
      
      });
  case actions.SUBMITTED_SHARE_LINK:
  return state.merge( {
      isSubmitting: false,
      threadid: action.threadid
    
  });
case actions.RECEIVE_TOPIC:
  console.log("RECEIVE_TOPIC");
  let thread = action.thread;
  return state.merge({
      owner: thread.owner,
      threadid: thread.threadid,
      url: thread.url,
      community: thread.community,
      text: thread.text,
      title: thread.title,
      image: thread.image,
      site_name: thread.site_name,
      description: thread.description,
      user_name: thread.user_name,
      updated_time: thread.updated_time,
      shared_time: thread.shared_time,
      reshare: thread.reshare,
      author: thread.author,
      locale: thread.local
  });
  case actions.UPDATE_STATE:
    console.log("UPDATE STATE old state=%o, new state=%o",state.toObject(),action.state.toObject());
    return action.state;
  case actions.UPDATE_COMMUNITY:
    let community=action.community;
    return state.merge({
      community
    });  
  default:
    return state;
  }
}