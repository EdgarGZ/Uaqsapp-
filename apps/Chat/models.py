# Django
from django.db import models

# Modelos
from django.contrib.auth.models import User

# Create your models here.
class Contacto(models.Model):
	user = models.ForeignKey(User, related_name='amigos', on_delete=models.CASCADE)
	amigos = models.ManyToManyField('self', blank=True)

	def __str__(self):
		return self.user.username

class Mensaje(models.Model):
	contacto = models.ForeignKey(Contacto, related_name='mensajes', on_delete=models.CASCADE)
	contenido = models.TextField()
	fecha = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.contacto.user.username


class Chat(models.Model):
	participantes = models.ManyToManyField(Contacto, related_name='chats')
	mensajes = models.ManyToManyField(Mensaje, blank=True)

	def __str__(self):
		return '{}'.format(self.id)