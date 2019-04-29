import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'antd/dist/antd.css';
import authReducer from './store/reducers/auth';
import navReducer from './store/reducers/nav';
import mensajeReducer from './store/reducers/mensaje';
import App from './App';

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function configureStore() {

    const rootReducer = combineReducers({
        auth: authReducer,
        mensaje: mensajeReducer,
        nav: navReducer,
    })

    const store = createStore(rootReducer, composeEnhances(
        applyMiddleware(thunk)
    ));

    if (module.hot) {
      module.hot.accept('./store/reducers', () => {
        const nextRootReducer = require('./store/reducers/auth');
        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
}

const store = configureStore();

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById("app"));

// import React from "react";
// import ReactDOM from "react-dom";
// import Chat from './containers/Chat';
// import InstanciaWebSocket from './websocket';


// class App extends React.Component {

//     componentDidMount() {
//         InstanciaWebSocket.conectar();
//     }

//     render() {
//         return(
//             <Chat />
//         );
//     };
// }

// ReactDOM.render(<App />, document.getElementById("app"));