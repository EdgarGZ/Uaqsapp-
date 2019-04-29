class ServicioWebSocket{

    // Instancia para llamar dentro de la clase
    static intancia = null;
    llamadas = {};

    constructor() {
        // Referencia a nuestro socket
        this.refSocket = null;
    }

    static getInstancia() {
        // Si no existe una instancia la creamos
        if(!ServicioWebSocket.instancia) {
            ServicioWebSocket.intancia = new ServicioWebSocket();
        }

        return ServicioWebSocket.intancia;
    }

    conectar(URLChat) {
        const path = `ws://127.0.0.1:8000/ws/chat/${URLChat}/`;
        console.log(path)
        this.refSocket = new WebSocket(path);
        this.refSocket.onopen = () => {
            console.log('Websocket abierto!');
        }
        this.refSocket.onmessage = (e) => {
            // Mandar un mensaje
            this.socketNuevoMensaje(e.data);
        }
        this.refSocket.onerror = (e) => {
            console.error(e.message)
        }
        this.refSocket.onclose = () => {
            console.log('Websocket cerrado!');
            this.conectar();
        }
    }

    desconectar() {
        this.refSocket.close();
    }

    socketNuevoMensaje(data) {
        // Parseamos el JSON a un objeto
        const parseData = JSON.parse(data);
        const accion = parseData.accion;

        if(Object.keys(this.llamadas).length === 0){
            return
        }
        if(accion === 'mensajes'){
            this.llamadas[accion](parseData.mensajes)
        }
        if(accion === 'nuevo'){
            this.llamadas[accion](parseData.mensaje)
        }
    }

    obtenerMensajes(username, chatId) {
        this.mandarMensaje({
            accion: 'recuperar',
            username: username,
            chatId: chatId
        })
    }

    nuevoMensajeChat(mensaje) {
        this.mandarMensaje({
            accion: 'nuevo',
            de: mensaje.de,
            contenido: mensaje.contenido,
            chatId:  mensaje.chatId
        })
    }

    añadirLlamadas(llamadaMensajes, llamadaNuevoMensaje) {
        this.llamadas['mensajes'] = llamadaMensajes;
        this.llamadas['nuevo'] = llamadaNuevoMensaje;
    }

    mandarMensaje(data) {
        try {
            // Mandamos el mensaje con todos los parametros de objeto data( ...data )
            this.refSocket.send(JSON.stringify({ ...data }))
        } catch (error) {
            console.error(error.message)
        }
    }

    estado(){
        return this.refSocket.readyState;
    }

    // Esta funcion nos asegura que el metodo esta continuamente llamandose asi mismo
    // gracias al setTimeout hasta que nos conectemos. Cuando el estado del socket es 1
    // se detiene el metodo 
    esperarConexionSocket(llamada) {
        const socket = this.refSocket;
        const recursion  = this.esperarConexionSocket;
        setTimeout(
            function () {
                if(socket.readyState === 1){
                    console.log('Conexion asegurada!');
                    if(llamada != null) {
                        llamada();
                    }
                    return;
                }
                else {
                    console.log('Esperando conexion...')
                    recursion(llamada);
                }
            }, 1)
    }
}

const InstanciaWebSocket = ServicioWebSocket.getInstancia();

export default InstanciaWebSocket;