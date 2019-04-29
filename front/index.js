// import React from 'react';
// import ReactDOM from 'react-dom';


// class App extends React.Component {
// 	render() {
// 		return (
// 			<div>Hola</div>
// 		);
// 	}
// }

// ReactDOM.render(<App />, document.getElementById('app'));

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'antd/dist/antd.css';
import reducer from './store/reducers/auth';
import App from './App';

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhances(
    applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById("app"));