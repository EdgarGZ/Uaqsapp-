import * as tipoAccion from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  showAddChatPopup: false
};

const openAddChatPopup = (state, action) => {
  return updateObject(state, { showAddChatPopup: true });
};

const closeAddChatPopup = (state, action) => {
  return updateObject(state, { showAddChatPopup: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case tipoAccion.ABRIR_ANADIR_CHAT_MODAL:
      return openAddChatPopup(state, action);
    case tipoAccion.CERRAR_ANADIR_CHAT_MODAL:
      return closeAddChatPopup(state, action);
    default:
      return state;
  }
};

export default reducer;