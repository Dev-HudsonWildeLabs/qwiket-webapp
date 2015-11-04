import 'babel-core/polyfill';
import Immutable from 'immutable';
import fetch from 'isomorphic-fetch';
import * as common from '../d4shared/actions/common'
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SELECT_LANGUAGE='SELECT_LANGUAGE';
export const SET_LANGUAGE='SET_LANGUAGE'

export function selectCommunity(community) {
 //TODO: ajax update the server community property
 console.log('selectCommunity '+community)
 return function(dispatch) { //middleware thunk

    let url = `/api?task=load_community_forums&community=${community}`;
    return fetch(url, {
        credentials: 'same-origin'
      })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        dispatch(receiveForums(Immutable.fromJS(json.forums)))
        return dispatch(receiveCommunity(community,json.communityName))
      }
      else{
        return dispatch(common.serviceError(json.msg))
      }
    });
  }
}
export const SELECT_COMMUNITY = 'SELECT_COMMUNITY';
export function receiveCommunity(community,communityName) { 

  return {
    type: SELECT_COMMUNITY,
    community,
    communityName
  };
}
export const LOADED_COMMUNITY_FORUMS = 'LOADED_COMMUNITY_FORUMS';
export function receiveForums(forums) { 
  return {
    type: LOADED_COMMUNITY_FORUMS,
    forums
  };
}
export function login() {
  return {
    type: LOGIN
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}
export function selectLanguage(value) {
  return {
    type: SELECT_LANGUAGE,
    payload: value
  };
}
export function setLanguage(value) {
  return {
    type: SET_LANGUAGE,
    payload: value
  };
}

