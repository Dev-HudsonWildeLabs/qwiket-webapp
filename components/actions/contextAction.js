import 'babel-core/polyfill';
import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';

import * as common from '../d4shared/actions/common'

export const CLEAR_CONTEXT_TOPIC = 'CLEAR_CONTEXT_TOPIC';
export function clearContextTopic() {
  return {
    type: CLEAR_CONTEXT_TOPIC
  };
}
export const REQUEST_CONTEXT_TOPIC = 'REQUEST_CONTEXT_TOPIC';
export function requestContextTopic() {
  return {
    type: REQUEST_CONTEXT_TOPIC
  };
}

export const RECEIVE_CONTEXT_TOPIC = 'RECEIVE_CONTEXT_TOPIC';
export function receiveContextTopic(topic,qwiketForumid,qwiketD4,qwiketThread,nativeForumid,nativeD4,nativeThread,url) {
  return {
    type: RECEIVE_CONTEXT_TOPIC,
    topic,
    qwiketForumid,
    qwiketD4,
    qwiketThread,
    nativeForumid,
    nativeD4,
    nativeThread,
    url
  };
}

export function fetchContextTopicForPostid(postid,state,community = 'pointofviewworld') {
  return function(dispatch) { //middleware thunk
  if(state.isFetching){
      console.log('skipping context topic fetch')
      return;
  }
 // console.log('fetchContextTopic postid=%s',postid)
  dispatch(requestContextTopic());
  let url = `/api?task=get_context_topic_for_post&postid=${postid}&community=${community}`;
  return fetch(url, {
        credentials: 'same-origin'
      })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        return dispatch(receiveContextTopic(json.topic,json.info.qwiketForumid,json.info.qwiketD4,json.info.qwiketThread,json.info.nativeForumid,json.info.nativeD4,json.info.nativeThread,url))
      }
      else{
        return dispatch(common.serviceError(json.msg))
      }
    });
  }
}
export function fetchContextTopicForThread(threadid,state,community = 'pointofviewworld') {
  return function(dispatch) { //middleware thunk
  if(state.isFetching){
      console.log('skipping context topic fetch')
      return;
  }
  //console.log('fetchContextTopic postid=%s',postid)
  dispatch(requestContextTopic());
  let url = `/api?task=get_context_topic_for_thread&threadid=${threadid}&community=${community}`;
  return fetch(url, {
        credentials: 'same-origin'
      })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        return dispatch(receiveContextTopic(json.topic,json.info.qwiketForumid,json.info.qwiketD4,json.info.qwiketThread,json.info.nativeForumid,json.info.nativeD4,json.info.nativeThread,url))
      }
      else{
        return dispatch(common.serviceError(json.msg))
      }
    });
  }
}