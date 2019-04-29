
import React from 'react'
import { connect } from 'react-redux';
import InstanciaWebSocket from '../websocket';
import Hoc from '../hoc/hoc';

class Chat extends React.Component {

	state = {mensaje: ''}

	inicializarChat() {
		this.esperarConexionSocket(() => {
			// InstanciaWebSocket.añadirLlamadas(
			// 	this.colocarMensajes.bind(this),
			// 	this.añadirMensaje.bind(this)
			// );
			InstanciaWebSocket.obtenerMensajes(
				this.props.username,
				this.props.match.params.chatID
			);
		});
		InstanciaWebSocket.conectar(this.props.match.params.chatID);
	}

	constructor(props) {
		super(props);
		this.inicializarChat();
	}

	esperarConexionSocket(llamada) {
		// El componente hace referncia a Chat
        const componente = this;
        setTimeout(
            function () {
                if(InstanciaWebSocket.estado() === 1){
                    console.log('Conexion asegurada!');
					llamada();
                    return;
                }
                else {
                    console.log('Esperando conexion...')
                    componente.esperarConexionSocket(llamada);
                }
            }, 100)
	}
	
	// añadirMensaje(mensaje) {
	// 	this.setState({
	// 		mensajes: [ ...this.state.mensajes, mensaje ]
	// 	})
	// }

	// colocarMensajes(mensajes) {
	// 	this.setState({
	// 		mensajes: mensajes.reverse()
	// 	});
	// }

	manejadorMandarMensaje = (e) => {
		e.preventDefault();
		const message = this.cifradoCesar(this.state.mensaje, 'encrypt')
		console.log(message)
		const objetoMensaje = {
			de: this.props.username,
			contenido: message,
			chatId: this.props.match.params.chatID
		}
		InstanciaWebSocket.nuevoMensajeChat(objetoMensaje);
		this.setState({
			mensaje: ''
		})
	}

	manejadorMensajeCambio = (e) => {
		this.setState({
			mensaje: e.target.value
		});
	}

	renderTiempo = (fecha) => {
		let prefix = '';
		const diferencia = Math.round((new Date().getTime() - new Date(fecha).getTime())/60000)
		if (diferencia < 1) { // less than one minute ago
            prefix = 'justo ahora...';
        } else if(diferencia < 60 && diferencia >= 1){
			// Menos de 60 minutos
			prefix = `hace ${diferencia} minutos.`;
		} else if(diferencia < (24 * 60) && diferencia > 60){
			// Menos de 24 dias
			prefix = `hace ${Math.round(diferencia/60)} horas.`;
		} else if(diferencia < (31 * 24 * 60) && diferencia > (24 * 60)){ 
			// Menos de 7 dias
			prefix = `hace ${Math.round(diferencia/(60*24))} días.`;
		} else {
			prefix = `${new Date(fecha)}`;
		}
		return prefix;
	}

	cifradoCesar = (mensaje, mode) =>{
		const key = 13
		const ABC = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z']

		let translated = ''

		let message = mensaje.toUpperCase()

		for(let i = 0; i < message.length; i++){
			if(ABC.includes(message.charAt(i))){
				let num = ABC.indexOf(message.charAt(i))
				if(mode === 'encrypt'){
					num = num + key;
				} else if (mode === 'decrypt') {
					num = num - key;
				}

				if(num >= ABC.length){
					num = num - ABC.length
				} else if(num < 0) {
					num = num + ABC.length
				}

				translated = translated + ABC[num]
			} else {
				translated = translated + message.charAt(i)

			}
		}
		return translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase()
	}

	renderMensajes = (mensajes) => {
		const currentUser = this.props.username;
		return mensajes.map((mensaje, i, arr) => (
			<li 
				key={mensaje.id}
				style={{marginBottom: arr.length - 1 === i ? '300px' : '15px'}}
				className={mensaje.autor === currentUser ? 'sent' : 'replies'}>
				<img src="http://emilcarlsson.se/assets/harveyspecter.png" />
				<p>
					{this.cifradoCesar(mensaje.contenido, 'decrypt')} 
					<br />
					<small>
						{ this.renderTiempo(mensaje.fecha) }
					</small>
				</p>
			</li>
		));
	}

	scrollToBottom = () => {
		this.messagesEnd.scrollIntoView({ behavior: "smooth" });
	}
	
	componentDidMount() {
		this.scrollToBottom();
	}
	
	componentDidUpdate() {
		this.scrollToBottom();
	}

	componentDidMount() {
        InstanciaWebSocket.conectar();
    }

	componentWillReceiveProps(nuevasProp) {
		// console.log(nuevasProp)
		// this.inicializarChat();
		if(this.props.match.params.chatID !== nuevasProp.match.params.chatID) {
			InstanciaWebSocket.desconectar();
			this.esperarConexionSocket(() => {
				InstanciaWebSocket.obtenerMensajes(
					this.props.username,
					nuevasProp.match.params.chatID
				);
			});
			InstanciaWebSocket.conectar(nuevasProp.match.params.chatID);
		}
	}

	render() {
		const mensajes = this.state.mensajes;
		return (
			<Hoc>
				<div className="messages">
					<ul id="chat-log">
					{ 
						this.props.mensajes && 
						this.renderMensajes(this.props.mensajes) 
					}
					<div style={{ float:"left", clear: "both" }}
						ref={(el) => { this.messagesEnd = el; }}>
					</div>
					</ul>
				</div>
				<div className="message-input">
				<form onSubmit={this.manejadorMandarMensaje}>                    
					<div className="wrap">
						<input 
							onChange={this.manejadorMensajeCambio}
							value={this.state.mensaje}
							required 
							id="chat-message-input" 
							type="text" 
							placeholder="Escribe un mensaje..." />
						<i className="fa fa-paperclip attachment" aria-hidden="true"></i>
						<button id="chat-message-submit" className="submit">
							<i className="fa fa-paper-plane" aria-hidden="true"></i>
						</button>
					</div>
				</form>
				</div>
			</Hoc>
		)
	}
}

const mapEstadoAProp = (state) => {
    return {
		username: state.auth.username,
		mensajes: state.mensaje.mensajes
    }
}

export default connect(mapEstadoAProp)(Chat);
// import React from 'react'
// import Panel from './panelLateral/Panel'
// import InstanciaWebSocket from '../websocket';

// class Chat extends React.Component {

// 	constructor(props) {
// 		super(props)
// 		this.state = {}

// 		this.esperarConexionSocket(() => {
// 			InstanciaWebSocket.añadirLlamadas(
// 				this.colocarMensajes.bind(this),
// 				this.añadirMensaje.bind(this)
// 			);
// 			InstanciaWebSocket.obtenerMensajes(this.props.currentUser)
// 		})
// 	}

// 	esperarConexionSocket(llamada) {
// 		// El componente hace referncia a Chat
//         const componente = this;
//         setTimeout(
//             function () {
//                 if(InstanciaWebSocket.estado() === 1){
//                     console.log('Conexion asegurada!');
// 					llamada();
//                     return;
//                 }
//                 else {
//                     console.log('Esperando conexion...')
//                     componente.esperarConexionSocket(llamada);
//                 }
//             }, 100)
// 	}
	
// 	añadirMensaje(mensaje) {
// 		this.setState({
// 			mensajes: [ ...this.state.mensajes, mensaje ]
// 		})
// 	}

// 	colocarMensajes(mensajes) {
// 		this.setState({
// 			mensajes: mensajes
// 		});
// 	}

// 	manejadorMandarMensaje = (e) => {
// 		e.preventDefault();
// 		const objetoMensaje = {
// 			de: 'edgar',
// 			contenido: this.state.mensaje
// 		}
// 		InstanciaWebSocket.nuevoMensajeChat(objetoMensaje);
// 		this.setState({
// 			mensaje: ''
// 		})
// 	}

// 	manejadorMensajeCambio = (e) => {
// 		this.setState({
// 			mensaje: e.target.value
// 		});
// 	}

// 	renderMensajes = (mensajes) => {
// 		const currentUser = 'edgar';
// 		return mensajes.map(mensaje => (
// 			<li key={mensaje.id} className={mensaje.autor === currentUser ? 'sent' : 'replies'}>
// 				<img src="http://emilcarlsson.se/assets/harveyspecter.png" />
// 				<p>
// 					{mensaje.contenido} 
// 					<br />
// 					<small>
// 						{ new Date(mensaje.fecha).getHours() }:{ new Date(mensaje.fecha).getMinutes() }
// 					</small>
// 				</p>
// 			</li>
// 		));
// 	}

// 	render() {
// 		const mensajes = this.state.mensajes;
// 		return (
// 			<div id="frame">
//                 <Panel />
//                 <div className="content">
//                     <div className="contact-profile">
//                         <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
//                         <p>username</p>
//                         <div className="social-media">
//                         <i className="fa fa-facebook" aria-hidden="true"></i>
//                         <i className="fa fa-twitter" aria-hidden="true"></i>
//                         <i className="fa fa-instagram" aria-hidden="true"></i>
//                         </div>
//                     </div>
//                     <div className="messages">
//                         <ul id="chat-log">
//                         { 
//                             mensajes && 
//                             this.renderMensajes(mensajes) 
//                         }
//                         </ul>
//                     </div>
//                     <div className="message-input">
// 					<form onSubmit={this.manejadorMandarMensaje}>                    
//                         <div className="wrap">
//                             <input 
//                                 onChange={this.manejadorMensajeCambio}
// 								value={this.state.mensaje}
//                                 required 
//                                 id="chat-message-input" 
//                                 type="text" 
//                                 placeholder="Write your message..." />
//                             <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
//                             <button id="chat-message-submit" className="submit">
//                                 <i className="fa fa-paper-plane" aria-hidden="true"></i>
//                             </button>
//                         </div>
//                     </form>
//                     </div>
//                 </div>
//             </div>
// 		)
// 	}
// }

// export default Chat;
0