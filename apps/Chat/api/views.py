# Django
from django.shortcuts import get_object_or_404

# Rest
from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView

# Modelos
from apps.Chat.models import Chat, Contacto
from django.contrib.auth.models import User

# Serializadores
from apps.Chat.api.serializers import ChatSerializer

def obtener_contactos_usuario(username):
    user = get_object_or_404(User, username=username)
    contacto = get_object_or_404(Contacto, user=user)
    return contacto

class VistaListaChat(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = Chat.objects.all()
        # username = self.request.GET.get('username', None)
        username = self.request.query_params.get('username', None)
        if username is not None:
            contacto = obtener_contactos_usuario(username)
            queryset = contacto.chats.all()
        return queryset

class VistaDetalleChat(RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

class VistaCrearChat(CreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

class VistaActualizarChat(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

class VistaEliminarChat(DestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)