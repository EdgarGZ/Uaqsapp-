# Django
from django.contrib import admin

# Modelos
from apps.Chat.models import Chat
from apps.Chat.models import Contacto
from apps.Chat.models import Mensaje

# Register your models here.
admin.site.register(Chat)
admin.site.register(Contacto)
admin.site.register(Mensaje)