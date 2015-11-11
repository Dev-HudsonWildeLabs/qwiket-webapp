import 'babel-core/polyfill';
import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';

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
 console.log("shareLink")
  return function(dispatch) { //middleware thunk
    if (state.get("isSubmitting")) {
      console.log('skipping shareLink')
      return;
    }
    dispatch(startShareLink(url));
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
  dispatch(startShareLink());
   let url = `/api?task=edit_thread&threadid=${threadid}`;
    return fetch(url, {
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => {
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
export function submitTopic(threadid,title,author,image,site_name,description,text,locale,community,state){
  return function(dispatch) { //middleware thunk
  dispatch(startShareLink());
   let url = `/api?task=submit_topic&threadid=${threadid}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&image=${encodeURIComponent(image)}&site_name=${site_name}&description=${encodeURIComponent(description)}&text=${encodeURIComponent(text)}&local${locale}&community=${community}`;
    return fetch(url, {
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          dispatch(submittedShareLink(json.thread))    
        } else {
          return dispatch(common.serviceError(json.msg))
        }
    });
  } 
}
export function updateState(state){
  console.log('inside updateState');
  return doUpdateState(state);
  
}
export const UPDATE_STATE = 'UPDATE_STATE';
export function doUpdateState(state) {
  console.log('doUpdateState')
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


