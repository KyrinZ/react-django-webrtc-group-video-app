from django.db import models


class Clients(models.Model):
    channel_name = models.CharField(max_length=255)
