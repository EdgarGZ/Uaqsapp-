import * as actionTypes from "./actionTypes";

export const openAddChatPopup = () => {
  return {
    type: actionTypes.ABRIR_ANADIR_CHAT_MODAL
  };
};

export const closeAddChatPopup = () => {
  return {
    type: actionTypes.CERRAR_ANADIR_CHAT_MODAL
  };
};