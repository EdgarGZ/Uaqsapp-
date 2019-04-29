import React from 'react';
import axios from 'axios';
import { Spin, Icon } from 'antd';
import { connect } from 'react-redux';
import * as authAcciones from '../../store/actions/auth';
import * as navAcciones from '../../store/actions/nav';
import Contacto from '../../components/Contacto';
import * as msjAcciones from '../../store/actions/mensaje'

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class Panel extends React.Component {

    state = { 
        loginForm: true,
    }

    espararDetallesDeAuth() {
        const componente = this;
        setTimeout(function(){
            if (componente.props.token !== null && componente.props.token !== undefined) {
                componente.props.obtenerChatsUsuario(componente.props.username, componente.props.token);
                return;
            } else {
                console.log('Esperando detalles de autenticacion...');
                componente.espararDetallesDeAuth();
            }
        }, 100)
    }

    componentDidMount() {
        this.espararDetallesDeAuth()
    }

    openAddChatPopup() {
        this.props.addChat();
    }

    cambiarForm = () => {
        this.setState({ loginForm: !this.state.loginForm });
    }

    autenticar = (e) => {
        e.preventDefault();
        if (this.state.loginForm) {
            this.props.login(
                e.target.username.value, 
                e.target.password.value
            );
        } else {
            this.props.signup(
                e.target.username.value, 
                e.target.password.value, 
                e.target.password2.value
            );
        }
    }

    render() {
        const ChatsActivos = this.props.chats.map((chat) => {
            console.log(chat)
            return (
                <Contacto 
                    key={chat.id}
                    nombre={chat.participantes[0] !== this.props.username ? chat.participantes[0] : chat.participantes[1]} 
                    URLimagen={`http://placehold.it/40/007bff/fff&text=${chat.participantes[0] !== this.props.username ? chat.participantes[0][0].toUpperCase() : chat.participantes[1][0].toUpperCase()}`}
                    status="busy"
                    URLchat={`/${chat.id}`} />
            )
        })
        return (
            <div id="sidepanel">
            <div id="profile">
                <div className="wrap">
                { this.props.isAuthenticated ? 
                <div>
                    <img id="profile-img" src={`http://placehold.it/40/007bff/fff&text=${this.props.username[0].toUpperCase()}`} className="online" alt="" />
                    <p>{this.props.username}</p>
                    {/* <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i> */}
                    <div id="status-options">
                        <ul>
                        <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                        <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                        <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                        <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                        </ul>
                    </div>
                </div> 
                : 
                <div><img id="profile-img" src={require('../../assets/logo.png')} alt="" /> <p>¡Uaqsapp!</p></div> 
                }
                <div id="expanded">
                    {
                        this.props.loading ?

                        <Spin indicator={antIcon} /> :

                        this.props.isAuthenticated ? 

                        <button onClick={() => this.props.logout()} className="authBtn"><span>Logout</span></button>

                        :

                        <div>
                            <form method="POST" onSubmit={this.autenticar}>

                                {
                                    this.state.loginForm ?

                                    <div>
                                        ¡Iniciar sesión!<br/><br/>
                                        <input name="username" type="text" placeholder="Nombre de Usuario" />
                                        <input name="password" type="password" placeholder="Contraseña" />
                                    </div>

                                    :

                                    <div>
                                        ¡Registrarse!<br/><br/>
                                        <input name="username" type="text" placeholder="Nombre de Usuario" />
                                        {/* <input name="email" type="email" placeholder="email" /> */}
                                        <input name="password" type="password" placeholder="Contraseña" />
                                        <input name="password2" type="password" placeholder="Confirmar contraseña" />
                                    </div>
                                }

                                <button type="submit">Enviar</button>

                            </form>

                            <button onClick={this.cambiarForm}>Cambiar</button>
                        </div>
                    }
                </div>
                </div>
            </div>
            { this.props.isAuthenticated ?
            <div>
                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search contacts..." />
                </div>
                <div id="contacts">
                    <ul>
                        {ChatsActivos}
                    </ul>
                </div>
                <div id="bottom-bar">
                    <button onClick={() => this.openAddChatPopup()} 
                        id="addcontact"
                    ><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Añadir chat</span></button>
                    {/* <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button> */}
                </div>
            </div>
            :
            <div>
            </div>
            }
            </div>
        );
    };
}

const mapEstadoAProp = (state) => {
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        token: state.auth.token,
        username: state.auth.username,
        chats: state.mensaje.chats
    }
}

const mapEnvioAProp = (envio) => {
    return {
        login: (userName, password) => envio(authAcciones.authLogin(userName, password)),
        logout: () => envio(authAcciones.logout()),
        signup: (username, password1, password2) =>  envio(authAcciones.authSignup(username, password1, password2)), 
        addChat: () => envio(navAcciones.openAddChatPopup()),
        obtenerChatsUsuario: (username, token) => envio(msjAcciones.obtenerChatsUsuario(username, token)) 
    }
}

export default connect(mapEstadoAProp, mapEnvioAProp)(Panel); 


// import React from 'react';

// class Panel extends React.Component {
//     render() {
//         return (
//             <div id="sidepanel">
//             <div id="profile">
//                 <div className="wrap">
//                 <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
//                 <p>Mike Ross</p>
//                 <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
//                 <div id="status-options">
//                     <ul>
//                     <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
//                     <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
//                     <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
//                     <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
//                     </ul>
//                 </div>
//                 <div id="expanded">
//                     {/* <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
//                     <input name="twitter" type="text" value="mikeross" />
//                     <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
//                     <input name="twitter" type="text" value="ross81" />
//                     <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
//                     <input name="twitter" type="text" value="mike.ross" /> */}
//                 </div>
//                 </div>
//             </div>
//             <div id="search">
//                 <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
//                 <input type="text" placeholder="Search contacts..." />
//             </div>
//             <div id="contacts">
//                 <ul>
//                 <li className="contact">
//                     <div className="wrap">
//                     <span className="contact-status online"></span>
//                     <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
//                     <div className="meta">
//                         <p className="name">Louis Litt</p>
//                         <p className="preview">You just got LITT up, Mike.</p>
//                     </div>
//                     </div>
//                 </li>
//                 <li className="contact active">
//                     <div className="wrap">
//                     <span className="contact-status busy"></span>
//                     <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
//                     <div className="meta">
//                         <p className="name">Harvey Specter</p>
//                         <p className="preview">Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and htmlForty six other things.</p>
//                     </div>
//                     </div>
//                 </li>
//                 </ul>
//             </div>
//             <div id="bottom-bar">
//                 <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
//                 <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
//             </div>
//             </div>

//         );
//     };
// }

// export default Panel;

