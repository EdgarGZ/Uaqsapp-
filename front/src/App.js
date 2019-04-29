import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as authAcciones from './store/actions/auth';
import * as navAcciones from './store/actions/nav';
import * as msjAcciones from './store/actions/mensaje';
import BaseRouter from './routes';
import Panel from './containers/panelLateral/Panel';
import Perfil from './containers/Perfil';
import AnadirModalChat from './containers/Popup';
import InstanciaWebSocket from './websocket';

class App extends React.Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    constructor(props) {
        super(props)
        InstanciaWebSocket.añadirLlamadas(
            this.props.colocarMensajes.bind(this),
            this.props.añadirMensaje.bind(this)
        );
    }

    render() {
        return(
            <Router>
                <div id="frame">
                    <Panel />
                        <div className="content">
                            <AnadirModalChat 
                                isVisible={this.props.showAddChatPopup}
                                close={() => this.props.closeAddChatPopup()}
                            />
                            <Perfil />
                            <BaseRouter />
                        </div>
                </div>
            </Router>
        );
    };
}

const mapEstadoAProp = (state) => {
    return {
        showAddChatPopup: state.nav.showAddChatPopup,
        authenticated: state.auth.token
    }
}

const mapDispatchToProps = (envio) => {
    return {
        onTryAutoSignup: () => envio(authAcciones.authCheckState()),
        closeAddChatPopup: () => envio(navAcciones.closeAddChatPopup()),
        añadirMensaje: (mensaje) => envio(msjAcciones.añadirMensaje(mensaje)),
        colocarMensajes: (mensajes) => envio(msjAcciones.colocarMensajes(mensajes)),
    }
}

export default connect(mapEstadoAProp, mapDispatchToProps)(App);