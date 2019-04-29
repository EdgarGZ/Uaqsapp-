# Channels
from channels.generic.websocket import WebsocketConsumer

# Modelos
from apps.Chat.models import Mensaje
from apps.Chat.models import Chat
from apps.Chat.models import Contacto
from django.contrib.auth.models import User

# Vistas
from apps.Chat.views import obtener_ultimos_20_mensajes
from apps.Chat.views import obtener_contacto_user
from apps.Chat.views import obtener_chat
from apps.Chat.views import cifradoCesar

# Utilidades
import json
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):

    # fetch
    def recuperar_mensajes(self, data):
        print(data)
        mensajes = obtener_ultimos_20_mensajes(data['chatId'])
        contenido = {
            'accion': 'mensajes',
            'mensajes': self.mensajes_a_json(mensajes)
        }
        self.mandar_mensaje(contenido)

    # new
    def nuevo_mensaje(self, data):
        contacto_user = obtener_contacto_user(data['de'])
        message = cifradoCesar(data['contenido'], 'decrypt')
        # print(message)
        mensaje = Mensaje.objects.create(contacto=contacto_user, contenido=message)
        chat_actual = obtener_chat(data['chatId'])
        chat_actual.mensajes.add(mensaje)
        chat_actual.save()
        contenido = {
            'accion': 'nuevo',
            'mensaje': self.mensaje_a_json(mensaje)
        }
        return self.mandar_mensaje_chat(contenido)

    def mensajes_a_json(self, mensajes):
        lista = []
        for mensaje in mensajes:
            lista.append(self.mensaje_a_json(mensaje))

        return lista

    def mensaje_a_json(self, mensaje):
        message = cifradoCesar(mensaje.contenido, 'encrypt')
        # print(message)
        return {
            'id': mensaje.id,
            'autor': mensaje.contacto.user.username,
            'contenido': message,
            'fecha': str(mensaje.fecha)
        }

    # commands
    acciones = {
        'recuperar': recuperar_mensajes,
        'nuevo': nuevo_mensaje,
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.acciones[data['accion']](self, data)

    def mandar_mensaje_chat(self, mensaje):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'mensaje': mensaje
            }
        )

    def mandar_mensaje(self, mensaje):
        self.send(text_data=json.dumps(mensaje))

    # Receive message from room group
    def chat_message(self, event):
        mensaje = event['mensaje']

        # Send message to WebSocket
        self.send(text_data=json.dumps(mensaje))