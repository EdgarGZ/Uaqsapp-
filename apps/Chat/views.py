# Django
from django.shortcuts import render, get_object_or_404

# Modelos
from apps.Chat.models import Chat
from apps.Chat.models import Contacto
from django.contrib.auth.models import User



def obtener_ultimos_20_mensajes(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.mensajes.order_by('-fecha').all()[:20]

def obtener_contacto_user(username):
    user = get_object_or_404(User, username=username)
    return get_object_or_404(Contacto, user=user)

def obtener_chat(chatId):
    return get_object_or_404(Chat, id=chatId)

def cifradoCesar(mensaje, mode):
    key = 13
     
    ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'

    translated = ''

    message = mensaje.upper()

    for symbol in message:
        if symbol in ABC:
            num = ABC.find(symbol) 
            if mode == 'encrypt':
                num = num + key
            elif mode == 'decrypt':
                num = num - key
    
            # si num es mayor que el largo de
            # ABC o es menor que  0
            if num >= len(ABC):
                num = num - len(ABC)
            elif num < 0:
                num = num + len(ABC)
    
            # Agregamos el simbolo al mensaje final
            translated = translated + ABC[num]
    
        else:
            # Agregamos el simbolo
            translated = translated + symbol
    
    # Imprimimos el mensaje cifrado/descifrado
    return translated.lower()
# from django.utils.safestring import mark_safe
# from django.contrib.auth.decorators import login_required

# # Utilidades
# import json

# # Create your views here.
# def index(request):
#     return render(request, 'chat/index.html')

# @login_required
# def room(request, room_name):
#     return render(request, 'chat/room.html', {
#         'room_name_json': mark_safe(json.dumps(room_name)),
#         'username': mark_safe(json.dumps(request.user.username)),
#     })
