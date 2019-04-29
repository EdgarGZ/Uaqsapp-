# Django
from django.urls import path, re_path

from apps.Chat.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', ChatConsumer),
]