import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'App';
import { Provider } from 'react-redux';
import registerServiceWorker from 'registerServiceWorker';
import 'index.css';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';
import { applyMiddleware, createStore, Store as ReduxStore } from 'redux';
import reducers, * as state from 'reducers'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

let store: ReduxStore<state.All> = createStore(
  reducers,
  {} as state.All,
  composeWithDevTools(applyMiddleware(thunk)),
)

store.subscribe(() => {
  console.log("stuff = ", store.getState())
})

const Root: React.SFC<{}> = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(
  <Root />,
  document.getElementById('aurita-app') as HTMLElement
);
registerServiceWorker();
