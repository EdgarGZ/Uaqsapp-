# Django
from django.urls import path, re_path

# Vistas
from apps.Chat.views import index
# from apps.Chat.views import room

app_name='chat'
urlpatterns = [
    # path('', index, name='index'),
    # re_path(r'^(?P<room_name>[^/]+)/$', room, name='room')
]