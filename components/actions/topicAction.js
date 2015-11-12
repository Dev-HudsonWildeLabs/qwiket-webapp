import 'babel-core/polyfill';
import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';
import u from '../d4shared/utils.jsx'
import * as common from '../d4shared/actions/common'

export const START_SHARE_LINK = 'START_SHARE_LINK';
export function startShareLink(url) {
  return {
    type: START_SHARE_LINK,
    url
  };
}
export const SUBMITTED_SHARE_LINK = 'SUBMITTED_SHARE_LINK';
export function submittedShareLink(threadid) {
  return {
    type: SUBMITTED_SHARE_LINK,
    threadid
  };
}



export function selectCommunity(history,community){
 return function (dispatch){
    updateCommunity(community);
  }
}
export function shareLink(link,state){
 //console.log("shareLink")
  return function(dispatch) { //middleware thunk
  /*  if (state.get("isSubmitting")) {
      console.log('skipping shareLink')
      return;
    }*/
    dispatch(startShareLink(link));
    let url = `/api?task=submit_link&link=${link}`;
    return fetch(url, {
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          dispatch(submittedShareLink(json.threadid))
          dispatch(loadTopic(json.threadid, state))
        } else {
          return dispatch(common.serviceError(json.msg))
        }
    });

  }
}
export function loadTopic(threadid,state){
  return function(dispatch) { //middleware thunk

    let url = `/api?task=edit_thread&threadid=${threadid}`;
    dispatch(startShareLink(state.get("url")));
    return fetch(url, {
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => {
        //console.log("############################################################")
        if (json.success) {
          dispatch(receiveTopic(json.thread))
        
        } else {
          return dispatch(common.serviceError(json.msg))
        }
    });
  } 
}
export const RECEIVE_TOPIC = 'RECEIVE_TOPIC';
export function receiveTopic(json) {
  return {
    type: RECEIVE_TOPIC,
    thread:json
  };
}
export function submitTopic(state){
  return function(dispatch) { //middleware thunk
  dispatch(startShareLink(state.get("url")));

  let description=u.entityToHtml(state.get("description"));
  description=u.entityToHtml(description);
  description=u.entityToHtml(description); //additional cleanup for bad data
  description=u.entityToHtml(description);
  let title=state.get("title");
  let author=state.get("author");
  let image=state.get("image");
  let community=state.get("community");
  let text=state.get("text");
  let locale=encodeURIComponent(state.get("locale"));
  //console.log('Saving topic title=%s,description=%s,author=%s,image=%s,community=%s,text=%s,locale=%s',title,description,author,image,community,text,locale);
  title=u.entityToHtml(title);
  author=u.entityToHtml(author);
  image=u.entityToHtml(image);
  community=u.entityToHtml(community);
  text=u.entityToHtml(text);
  
  //console.log('After cleanup: Saving topic title=%s,description=%s,author=%s,image=%s,community=%s,text=%s,locale=%sEND',title,description,author,image,community,text,locale);
   let url = `/api?task=submit_topic&threadid=${state.get("threadid")}&title=${title}&author=${author}&image=${image}&site_name=${state.get("site_name")}&description=${description}&text=${text}&locale=${locale}&forum=${community}`;
   // return fetch(url, {
/*let url = `/api?task=submit_topic&threadid=${state.get("threadid")}&title=${encodeURIComponent(title)}
   &author=${encodeURIComponent(author)}&image=${encodeURIComponent(image)}
   &site_name=${state.get("site_name")}&description=${encodeURIComponent(description)}
   &text=${encodeURIComponent(text)}&locale=${state.get("locale")}
   &community=${encodeURIComponent(community)}`;*/
   //console.log("FETCHING URL=%s",url)
    return fetch(url, {
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => {
        //console.log("RETURNED!!!!!!!!!!!!!!!!!")
        if (json.success) {
          //dispatch(submittedShareLink(json.thread.threadid))   
          dispatch(common.serviceSuccess("Topic submitted.")) ;
          dispatch(doUpdateState(state.merge({isSubmitting:false})))
          
        } else {
          return dispatch(common.serviceError(json.msg))
        }
    });
  } 
}
export function updateState(state){
 // console.log('inside updateState');
  return doUpdateState(state);
  
}
export const UPDATE_STATE = 'UPDATE_STATE';
export function doUpdateState(state) {
  //console.log('doUpdateState')
  return {
    type: UPDATE_STATE,
    state:state
  };
}
export const UPDATE_COMMUNITY = 'UPDATE_COMMUNITY';
export function updateCommunity(community) {
  return {
    type: UPDATE_COMMUNITY,
    community
  };
}


