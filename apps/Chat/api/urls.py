# Django
from django.urls import path

# Vistas
from apps.Chat.api.views import VistaListaChat
from apps.Chat.api.views import VistaDetalleChat
from apps.Chat.api.views import VistaCrearChat
from apps.Chat.api.views import VistaActualizarChat
from apps.Chat.api.views import VistaEliminarChat

app_name='chat'
urlpatterns = [
    path('', VistaListaChat.as_view()),
    path('create/', VistaCrearChat.as_view()),
    path('<id>/', VistaDetalleChat.as_view()),
    path('<id>/actualizar/', VistaActualizarChat.as_view()),
    path('<id>/aliminar/', VistaEliminarChat.as_view()),
]
