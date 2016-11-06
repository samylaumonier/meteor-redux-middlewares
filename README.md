Middlewares to sync meteor reactive sources with redux store.

- [Live demo](https://meteor-redux-middlewares-demo.herokuapp.com)
- [Demo sources on GitHub](https://github.com/samybob1/meteor-redux-middlewares-demo)
- [Package on npm](https://www.npmjs.com/package/meteor-redux-middlewares)
- [Package on Atmosphere](https://atmospherejs.com/samy/redux-middlewares)


# Installation

##### Using npm

`npm i meteor-redux-middlewares --save`

##### Using yarn

`yarn add meteor-redux-middlewares`

##### Using meteor

`meteor add samy:redux-middlewares`


# Table of contents

- [Example of use](#example-of-use)
    - [Step 1: apply middlewares](#step-1-apply-middlewares)
    - [Step 2: create actions](#step-2-create-actions)
    - [Step 3: create reducers](#step-3-create-reducers)
- [Stop a subscription](#stop-a-subscription)
- [Pass extra data to the reducer](#pass-extra-data-to-the-reducer)
- [Credits](#credits)


# Example of use

All the following code is available on the [demo repository](https://github.com/samybob1/meteor-redux-middlewares-demo).


##### Step 1: apply middlewares

```js
// File '/imports/store/index.js'
import { Tracker } from 'meteor/tracker';
import createReactiveMiddlewares from 'meteor-redux-middlewares';
// or: import createReactiveMiddlewares from 'meteor/samy:redux-middlewares';
import { applyMiddleware, createStore, compose } from 'redux';

// Of course, you can use other middlewares as well
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from '/imports/reducers';

// We use an injection pattern to avoid any direct dependency on the meteor
// build tool, or version of tracker within the package.
//
// This way you should be able to use your meteor version, a community npm
// version, the future extracted official mdg package etc...
const {
sources,
subscriptions,
} = createReactiveMiddlewares(Tracker);

const store = createStore(rootReducer, compose(
applyMiddleware(sources, subscriptions, thunk, logger)
));

export default store;
```


##### Step 2: create actions

```js
// File '/imports/actions/user/load.js'
import { Meteor } from 'meteor/meteor';
import { registerReactiveSource } from 'meteor-redux-middlewares';

export const USER_REACTIVE_SOURCE_CHANGED = 'USER_REACTIVE_SOURCE_CHANGED';

export const loadUser = () =>
registerReactiveSource({
  key: 'user',
  get: () => Meteor.user() || {},
});
```

This action will automatically be intercepted by the `sources` middleware. Your `get` function is running inside a `Tracker.autorun`, that means each time the data will change, the middleware will dispatch an action with the `_REACTIVE_SOURCE_CHANGED` suffix. In this example, we are dispatching an action with a key of `user`, so we have to handle the `USER_REACTIVE_SOURCE_CHANGED` action in our reducer.

```js
// File '/imports/actions/home/posts/load.js'
import { Meteor } from 'meteor/meteor';
import { startSubscription } from 'meteor-redux-middlewares';
import { Posts } from '/imports/api/collections/posts';

export const HOME_POSTS_SUBSCRIPTION_READY = 'HOME_POSTS_SUBSCRIPTION_READY';
export const HOME_POSTS_SUBSCRIPTION_CHANGED = 'HOME_POSTS_SUBSCRIPTION_CHANGED';
export const HOME_POSTS_SUB = 'home.posts';

export const loadHomePosts = () =>
startSubscription({
  key: HOME_POSTS_SUB,
  get: () => Posts.find().fetch(),
  subscribe: () => Meteor.subscribe(HOME_POSTS_SUB),
});
```

This action will automatically be intercepted by the `subscriptions` middleware. Your `get` function is running inside a `Tracker.autorun`, that means each time the data will change, the middleware will dispatch an action with the `_SUBSCRIPTION_CHANGED` suffix. In the same way, each time the subscription will be ready (or not), the middleware will dispatch an action with the `_SUBSCRIPTION_READY` suffix. In this example, we are dispatching an action with a key of `home.posts`, so we have to handle the `HOME_POSTS_SUBSCRIPTION_READY` and `HOME_POSTS_SUBSCRIPTION_CHANGED` actions in our reducer.


##### Step 3: create reducers

```js
// File '/imports/reducers/user.js'
import { USER_REACTIVE_SOURCE_CHANGED } from '/imports/actions/user/load';

const initialState = {
ready: false,
};

export function user(state = initialState, action) {
switch (action.type) {
  case USER_REACTIVE_SOURCE_CHANGED:
    return {
      ...action.payload,
      ready: true,
    };
  default:
    return state;
}
}
```

With the **reactive sources**, we can access to the data returned by our `get` function inside the `action.payload` attribute.

```js
// File '/imports/reducers/home.js'
import { STOP_SUBSCRIPTION } from 'meteor-redux-middlewares';

import {
HOME_POSTS_SUBSCRIPTION_READY,
HOME_POSTS_SUBSCRIPTION_CHANGED,
HOME_POSTS_SUB,
} from '/imports/actions/home/posts/load';

const initialState = {
ready: false,
posts: [],
postsSubscriptionStopped: false,
};

export function home(state = initialState, action) {
switch (action.type) {
  case HOME_POSTS_SUBSCRIPTION_READY:
    return {
      ...state,
      ready: action.payload.ready,
    };
  case HOME_POSTS_SUBSCRIPTION_CHANGED:
    return {
      ...state,
      posts: action.payload,
    };
  case STOP_SUBSCRIPTION:
    return action.payload === HOME_POSTS_SUB
      ? { ...state, postsSubscriptionStopped: true }
      : state;
  default:
    return state;
}
}
```

With the **subscriptions**, we can access to:
- the data returned by our `get` function inside the `action.payload` attribute.
- the readiness state of the subscription inside the `action.payload.ready` attribute.


# Stop a subscription

You can stop a subscription by dispatching the `stopSubscription` action, for example inside a container component:

```js
import { connect } from 'react-redux';
import { stopSubscription } from 'meteor-redux-middlewares';
import { loadHomePosts, HOME_POSTS_SUB } from '/imports/actions/home/posts/load';
import { HomePageComponent } from '/imports/ui/components/pages/HomePageComponent';

const mapStateToProps = state => ({
postsReady: state.home.ready,
posts: state.home.posts,
postsSubscriptionStopped: state.home.postsSubscriptionStopped,
});

const mapDispatchToProps = dispatch => ({
loadPosts: () => {
  dispatch(loadHomePosts());
},
stopPostsSubscription: () => {
  dispatch(stopSubscription(HOME_POSTS_SUB));
},
});

export const HomePageContainer = connect(
mapStateToProps,
mapDispatchToProps
)(HomePageComponent);  
```


# Pass extra data to the reducer

If you need to pass some extra data to the reducer with the `subscriptions` middleware when your subscription's ready state changes, you can add an `onReadyData` attribute in your action:

```js
import { Meteor } from 'meteor/meteor';
import { startSubscription } from 'meteor-redux-middlewares';
import { Posts } from '/imports/api/collections/posts';

export const HOME_POSTS_SUBSCRIPTION_READY = 'HOME_POSTS_SUBSCRIPTION_READY';
export const HOME_POSTS_SUBSCRIPTION_CHANGED = 'HOME_POSTS_SUBSCRIPTION_CHANGED';
export const HOME_POSTS_SUB = 'home.posts';

export const loadHomePosts = () =>
startSubscription({
  key: HOME_POSTS_SUB,
  get: () => Posts.find().fetch(),
  subscribe: () => Meteor.subscribe(HOME_POSTS_SUB),
  onReadyData: () => ({
    extraKey1: 'extraValue1',
    extraKey2: 'extraValue2',
  }),
});
```

Then in your reducer, you can access to the extra data by using the `payload.data` attribute;

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
    console.log(action.payload.data);

    return {
      ...state,
      ready: action.payload.ready,
    };
  case HOME_POSTS_SUBSCRIPTION_CHANGED:
    return {
      ...state,
      posts: action.payload
    };
  default:
    return state;
}
}
```


# Credits

Based on the work of [Gildas Garcia (@djhi)](https://github.com/djhi) on his [My-Nutrition project](https://github.com/djhi/my-nutrition/tree/master/app/client/middlewares).
Thanks to [Kyle Chamberlain (@Koleok)](https://github.com/Koleok) for his [contribution](https://github.com/samybob1/meteor-redux-middlewares/commits/master?author=Koleok).
