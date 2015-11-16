import * as actions from '../actions/newslineAction';
import * as appActions from '../actions/appAction';
import * as postActions from '../d4shared/actions/postsAction';
import Immutable from 'immutable';

function createdatSort(b, a) {
  return a.createdat - b.createdat;
}

export default function newsline(state = 0, action) {
  //console.log('newsline reducer state=%o')
  switch (action.type) {
    case actions.REQUEST_TOPICS:
      return state.merge({
        topics: {
          isFetching: true,
          items: state.get("topics").get("items"),
          lastid: state.get("topics").get("lastid")
        }
      });
    case actions.START_TRANSITION:{
      if(action.sideTopics)
        return state;
      //find item in newsline and mark it for transition
      let items=state.get("topics").get("items");
       let itemsMap = new Map();
      for (var i = 0; i < items.count(); i++) {
          let item = items.get(i);

          let threadid=item.get("threadid");
          if(threadid==action.threadid){
            item.set({intransit:true})
          }
          itemsMap.set(item.get("xid"), item);
      }
      items = Immutable.fromJS(itemsMap);
      return state.merge({
        topics: {
          items
        }

      });
    }  
    case actions.RECEIVE_TOPICS:
      if (!action.items || action.items.length == 0 || action.sideTopics)
        return state;

      let oldItems = state.get("topics").get("items");
      let itemsMap = new Map();

      for (var i = 0; i < oldItems.count(); i++) {
        let item = oldItems.get(i);
        let pojso = item.toObject();
        pojso.intransit = false;
        itemsMap.set(item.get("xid"), pojso);
      }
      let actionItems = Immutable.fromJS(action.items);

      for (i = 0; i < actionItems.count(); i++) {
        let item = actionItems.get(i);
        let pojso = item.toObject();
        pojso.intransit = false;
        //console.log('setting new item '+item.qpostid)
        itemsMap.set(item.get("xid"), pojso);
      }
      let itemsArray = [...itemsMap.values()];
      let items = Immutable.fromJS(itemsArray.sort((a, b) => b.sort - a.sort));
      // console.log("itemsArray: %o",itemsArray);
      //  console.log("items: %o",items);
      //  console.log("count: %o",items.count());
      //  console.log("item: %o",items.get(items.count()-1))

      let item = items.get(items.count() - 1);
      let lastid = item.get("xid")

      return state.merge({
        topics: {
          isFetching: false,
          items,
          lastid
        }

      });

    case actions.CLEAR_TOPICS:
      if (!action.sideTopics)
        return state.merge({
          topics: {
            isFetching: false,
            items: new Immutable.List([]),
            lastid: 0
          }

        });
      else
        return state;
    case appActions.LOADED_COMMUNITY_FORUMS:

      //console.log("FORUMS: %o",action.forums)
      return state.merge({
        forums: action.forums,
        posts: new Immutable.Map({
          items: new Immutable.List([]),
          lastids: new Immutable.List([]),
          isFetching: false,
          type: "community"

        }),
        topics: new Immutable.Map({
          items: new Immutable.List([]),
          lastids: new Immutable.List([]),
          isFetching: false,
        })
      })


    case postActions.RECEIVE_COMMUNITY_POSTS:
      {

        //console.log('((((((((((((((((((((((((((((((((((((((((((((((((((((())) RECEIVE_COMMUNITY_POSTS')
        let oldItems = state.get("posts").get("items");

        let items1 = new Map();
        //console.log('first:'+oldItems.length)
        for (var i = 0; i < oldItems.count(); i++) {
          // if(i>100)
          //   break;
          let item = oldItems.get(i);
          items1.set(item.get("id"), item.toObject());
        }
        let actionItems = Immutable.fromJS(action.items);

        for (i = 0; i < actionItems.count(); i++) {
          let item = actionItems.get(i);

          //console.log('setting new item '+item.qpostid)
          items1.set(item.get("id"), item.toObject());
        }
        let items2 = [...items1.values()];
        // console.log("ITEMS2: %o",items2)
        items2.sort((a, b) => b.createdat - a.createdat)
        let items = Immutable.fromJS(items2)
          //let lastid=items[items.length-1].qpostid



        //console.log('second:'+items.length)


        let lastid = action.lastid
        let forumid = action.forumid
          //console.log('action.items %o',action.items)
        let lastids = state.get("posts").get("lastids").toArray();
        //console.log('lastids %o',lastids)
        lastids[forumid] = lastid;
        // console.log("items=%o",items)
        let isFetching = state.get("posts").get("isFetching");
        //isFetching[forumid]=false
        return state.merge({
          posts: {
            isFetching,
            items: items,
              lastids: new Immutable.List(lastids)
          }
        });
      }
    case postActions.CLEAR_COMMUNITY_POSTS:
      //console.log('processing clear posts');
      return state.merge({
        posts: {
          isFetching: new Immutable.List([]),
          items: new Immutable.List([]),
          lastids: new Immutable.List([])
        }
      });
    case postActions.REQUEST_COMMUNITY_POSTS:
      let isFetching = state.get("posts").get("isFetching");
      //isFetching[action.forumid]=true;
      return state.merge({
        posts: {
          isFetching,
          items: state.get("posts").get("items"),
            lastids: state.get("posts").get("lastids")
        }
      });

    default:
      return state;
  }
}