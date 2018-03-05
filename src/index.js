import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from './reducers'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers.rootReducer);

ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();

// List of Reducers as of now:
//  From app:
//      - Update tree;
//  From tree:
//      - Update selected Id;
//  From constructor:
//      - Update Child parameters;
//
//
//
//
//
//
//
//