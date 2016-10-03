Redux middlewares that allow you to sync the store with Mongo and any reactive sources.

- [Live demo](https://meteor-redux-middlewares-demo.herokuapp.com)
- [Demo sources on GitHub](https://github.com/samybob1/meteor-redux-middlewares-demo)
- [Package on Atmosphere](https://atmospherejs.com/samy/meteor-redux-middlewares)


# Installation

`meteor add samy:redux-middlewares`


# Example of use

All the following code is available on the [demo repository](https://github.com/samybob1/meteor-redux-middlewares-demo).


##### Step 1: apply middlewares

```js
  // File '/imports/store/index.js'
  import { sources, subscriptions } from 'meteor/samy:redux-middlewares';

  import { applyMiddleware, createStore, compose } from 'redux';

  // Of course, you can use other middlewares as well
  import thunk from 'redux-thunk';
  import createLogger from 'redux-logger';

  import rootReducer from '/imports/reducers';

  const store = createStore(rootReducer, compose(
    applyMiddleware(sources, subscriptions, thunk, logger)
  ));

  export default store;
```


##### Step 2: create actions

```js
  // File '/imports/actions/user/load.js'
  import { Meteor } from 'meteor/meteor';

  export const USER = 'USER';
  export const USER_CHANGED = 'USER_CHANGED';

  export function loadUser() {
    return dispatch => {
      dispatch({
        type: USER,
        meteor: {
          get: () => Meteor.user() || {},
        },
      });
    };
  }
```

This action will automatically be intercepted by the `sources` middleware. Your `get` function is running inside a `Tracker.autorun`, that means each time the data will change, the middleware will dispatch an action with the `_CHANGED` suffix. In this example, we are dispatching an action of type `USER`, so we have to handle the `USER_CHANGED` action in our reducer.

```js
  // File '/imports/actions/home/posts/load.js'
  import { Meteor } from 'meteor/meteor';

  import { Posts } from '/imports/api/collections/posts';

  export const HOME_POSTS_SUBSCRIPTION = 'HOME_POSTS_SUBSCRIPTION';
  export const HOME_POSTS_SUBSCRIPTION_READY = 'HOME_POSTS_SUBSCRIPTION_READY';
  export const HOME_POSTS_SUBSCRIPTION_CHANGED = 'HOME_POSTS_SUBSCRIPTION_CHANGED';

  export function loadHomePosts() {
    return dispatch => {
      dispatch({
        type: HOME_POSTS_SUBSCRIPTION,
        meteor: {
          subscribe: () => Meteor.subscribe('home.posts'),
          get: () => Posts.find().fetch(),
        },
      });
    };
  }
```

This action will automatically be intercepted by the `subscriptions` middleware. Your `get` function is running inside a `Tracker.autorun`, that means each time the data will change, the middleware will dispatch an action with the `_CHANGED` suffix. In the same way, each time the subscription will be ready (or not), the middleware will dispatch an action with the `_READY` suffix. In this example, we are dispatching an action of type `HOME_POSTS_SUBSCRIPTION`, so we have to handle the `HOME_POSTS_SUBSCRIPTION_READY` and `HOME_POSTS_SUBSCRIPTION_CHANGED` actions in our reducer.


##### Step 2: create reducers

```js
  // File '/imports/reducers/user.js'
  import { USER_CHANGED } from '/imports/actions/user/load';

  const initialState = {
    ready: false,
  };

  export function user(state = initialState, action) {
    switch (action.type) {
      case USER_CHANGED:
        return {
          ...action.data,
          ready: true,
        };
      default:
        return state;
    }
  }
```

With the **reactive sources**, we can access to the data returned by our `get` function inside the `action.data` attribute.

```js
  // File '/imports/reducers/home.js'
  import {
    HOME_POSTS_SUBSCRIPTION_READY,
    HOME_POSTS_SUBSCRIPTION_CHANGED
  } from '/imports/actions/home/posts/load';

  const initialState = {
    ready: false,
    posts: [],
  };

  export function home(state = initialState, action) {
    switch (action.type) {
      case HOME_POSTS_SUBSCRIPTION_READY:
        return {
          ...state,
          ready: action.ready,
        };
      case HOME_POSTS_SUBSCRIPTION_CHANGED:
        return {
          ...state,
          posts: action.data
        };
      default:
        return state;
    }
  }
```

With the **subscriptions**, we can access to:
- the data returned by our `get` function inside the `action.data` attribute.
- the readiness state of the subscription inside the `action.ready` attribute.


# Pass extra data to the reducer

If you need to pass some extra data to the reducer with the `subscriptions` middleware when your subscription's ready state changes, you can add an `onReadyData` attribute in your action:

```js
  import { Meteor } from 'meteor/meteor';

  import { Posts } from '/imports/api/collections/posts';

  export const HOME_POSTS_SUBSCRIPTION = 'HOME_POSTS_SUBSCRIPTION';
  export const HOME_POSTS_SUBSCRIPTION_READY = 'HOME_POSTS_SUBSCRIPTION_READY';
  export const HOME_POSTS_SUBSCRIPTION_CHANGED = 'HOME_POSTS_SUBSCRIPTION_CHANGED';

  export function loadHomePosts() {
    return dispatch => {
      dispatch({
        type: HOME_POSTS_SUBSCRIPTION,
        meteor: {
          subscribe: () => Meteor.subscribe('home.posts'),
          get: () => Posts.find().fetch(),
          onReadyData: () => ({
            extraKey1: 'extraValue1',
            extraKey2: 'extraValue2',
          }),
        },
      });
    };
  }
```

Then in your reducer, you can access to the extra data by using the `data` attribute;

```js
  import {
    HOME_POSTS_SUBSCRIPTION_READY,
    HOME_POSTS_SUBSCRIPTION_CHANGED
  } from '/imports/actions/home/posts/load';

  const initialState = {
    ready: false,
    posts: [],
  };

  export function home(state = initialState, action) {
    switch (action.type) {
      case HOME_POSTS_SUBSCRIPTION_READY:
        // This will log: Object { extraKey1="extraValue1", extraKey2="extraValue2" }
        console.log(action.data);

        return {
          ...state,
          ready: action.ready,
        };
      case HOME_POSTS_SUBSCRIPTION_CHANGED:
        return {
          ...state,
          posts: action.data
        };
      default:
        return state;
    }
  }
```
