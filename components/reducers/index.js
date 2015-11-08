import { combineReducers } from 'redux';
import app from './appReducer';
import newsline from './newslineReducer';
import context from './contextReducer';
import topic from './topicReducer';
import d4context from '../d4shared/reducers/D4ContextReducer';
import msg from '../d4shared/reducers/info';

const rootReducer = combineReducers({
  msg,app,newsline,context,d4context,topic
});

export default rootReducer;