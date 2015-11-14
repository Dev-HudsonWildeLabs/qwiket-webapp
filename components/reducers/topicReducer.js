import 'babel-core/polyfill';
import Immutable from 'immutable';
import * as actions from '../actions/topicAction';
import u from '../d4shared/utils.jsx'

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
 //console.log("TOPIC REDUCER action=%o",action)
  switch (action.type) {
    case actions.START_SHARE_LINK:
    //console.log("STATE=%o, action=%o",state.toObject(),action)
    let link=state.get("url");

    if(action.url&&link!=action.url)
      link=action.url
      return state.merge( {
        isSubmitting: true,
        url: link
      
      });
  case actions.SUBMITTED_SHARE_LINK:
  return state.merge( {
      isSubmitting: false,
      threadid: action.threadid
    
  });
case actions.RECEIVE_TOPIC:
  //console.log("RECEIVE_TOPIC");
  let thread = action.thread;
  let locale=thread.locale;
  if(!locale){
    locale="en_EN";
  }
  return state.merge({
      isSubmitting: false,
      owner: thread.owner,
      threadid: u.entityToHtml(thread.threadid),
      url: u.entityToHtml(thread.url),
      text: u.entityToHtml(thread.text),
      title: u.entityToHtml(thread.title),
      image: u.entityToHtml(thread.image),
      site_name: u.entityToHtml(thread.site_name),
      description: u.entityToHtml(u.entityToHtml(u.entityToHtml(thread.description))),
      user_name: u.entityToHtml(thread.user_name),
      updated_time: thread.updated_time,
      shared_time: thread.shared_time,
      reshare: thread.reshare,
      author: u.entityToHtml(thread.author),
      locale
  });
  case actions.UPDATE_STATE:
  //  console.log("UPDATE STATE old state=%o, new state=%o",state.toObject(),action.state.toObject());
    return state.merge(action.changes);
  case actions.UPDATE_COMMUNITY:
    let community=action.community;
    return state.merge({
      community
    });  
  default:
    return state;
  }
}