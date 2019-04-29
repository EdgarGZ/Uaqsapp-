import axios from 'axios';
import * as tipoAccion from './actionTypes';

export const añadirMensaje = (mensaje) => {
    return {
        type: tipoAccion.ANADIR_MENSAJE,
        mensaje: mensaje
    }
}

export const colocarMensajes = (mensajes) => {
    return {
        type: tipoAccion.COLOCAR_MENSAJES,
        mensajes: mensajes
    }
}

export const obtenerChatsUsuarioExitoso = (chats) => {
    return {
        type: tipoAccion.OBTENER_CHATS_EXITOSO,
        chats: chats
    }
}

export const obtenerChatsUsuario = (username, token) => {
    return (envio) => {
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      };
      axios.get(`http://127.0.0.1:8000/api/v1.0/chat/?username=${username}`)
        .then((response) => {
            envio(obtenerChatsUsuarioExitoso(response.data))
        });
    };
  };