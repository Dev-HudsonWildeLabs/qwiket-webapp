import 'babel-core/polyfill';
import fetch from 'isomorphic-fetch';
//import Immutable from 'immutable';

import * as common from '../d4shared/actions/common'

export const CLEAR_TOPICS = 'CLEAR_TOPICS';
export function clearTopics() {
  return {
    type: CLEAR_TOPICS
  };
}
export const REQUEST_TOPICS = 'REQUEST_TOPICS';
export function requestTopics() {
  return {
    type: REQUEST_TOPICS
  };
}
export const START_TRANSITION='START_TRANSITION';
export function startTransition(threadid,sideTopics) {
  console.log('startTransition')
  return {
    type: START_TRANSITION,
    threadid,
    sideTopics
  };
}

export const RECEIVE_TOPICS = 'RECEIVE_TOPICS';
export function receiveTopics(json,url,sideTopics) {
//  console.log(receiveTopics);
  return {
    type: RECEIVE_TOPICS,
    items: json,
    url,
    sideTopics
  };
}

export function fetchTopics(clear,community = 'pointofviewworld', orderby = 0, state,sideTopics=false,lastid = common.MAXID, sitename = '', limit = 25, query = '') {
//console.log("INSIDE fetchTopics")
  return function(dispatch) { //middleware thunk
  /*if(state.isFetching){
      console.log('skipping fetch')
      return;
  }*/
   //console.log('fetchTopics lastid=%s',lastid)
    dispatch(requestTopics());
    if(clear)
      lastid=common.MAXID;
    var url = '';
    if (orderby > 1) {
      url = `/api?task=load_topics&orderby=${orderby}&last=${lastid}&sitename={encodeURIComponent(sitename)}&limit=${limit}&query=${query}`;
    } else {
      url = `/api?task=load_community_topics&orderby=${orderby}&last=${lastid}&sitename=${encodeURIComponent(sitename)}&limit=${limit}&community=${community}`;
    }
  //  console.log("inside-inside")
    return fetch(url, {
        credentials: 'same-origin'
      })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        return dispatch(receiveTopics(json.topics,url,sideTopics))
      }
      else{
        return dispatch(common.serviceError(json.msg))
      }
    });
  }
}

 