import * as tipoAccion from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  mensajes: [],
  chats: []
};

const addMessage = (state, action) => {
  return updateObject(state, {
    mensajes: [...state.mensajes, action.mensaje]
  });
};

const setMessages = (state, action) => {
  return updateObject(state, {
    mensajes: action.mensajes.reverse()
  });
};

const setChats = (state, action) => {
  return updateObject(state, {
    chats: action.chats
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case tipoAccion.ANADIR_MENSAJE:
      return addMessage(state, action);
    case tipoAccion.COLOCAR_MENSAJES:
      return setMessages(state, action);
    case tipoAccion.OBTENER_CHATS_EXITOSO:
      return setChats(state, action);
    default:
      return state;
  }
};

export default reducer;