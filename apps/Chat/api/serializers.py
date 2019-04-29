# Django
from django.db.models.query_utils import Q 

# Rest
from rest_framework import serializers

# Vistas
from apps.Chat.views import obtener_contacto_user

# Modelos
from apps.Chat.models import Chat
from apps.Chat.models import Contacto
from django.contrib.auth.models import User


class ContactoSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        print(value)
        return value

class ChatSerializer(serializers.ModelSerializer):
    participantes = ContactoSerializer(many=True)

    class Meta:
        model = Chat
        fields = ('id', 'mensajes', 'participantes')
        read_only = ('id')

    def create(self, validated_data):
        # print(validate_data)
        participantes = validated_data.pop('participantes')
        for p in participantes:
            user = User.objects.get(username=p)
            isContacto = Contacto.objects.filter(Q(user=user))
            if isContacto.exists():
                pass
            else:
                Contacto.objects.create(user=user)
        print(Contacto.objects.all())
        chat = Chat.objects.create()
        for username in participantes:
            contacto = obtener_contacto_user(username)
            chat.participantes.add(contacto)
        chat.save()
        return chat        

    