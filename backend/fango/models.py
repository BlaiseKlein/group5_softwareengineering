from django.db import models

# Create your models here.

class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

class User(models.Model):
    username = models.CharField(max_length=255, primary_key=True)
    password = model.CharField(max_length=255)
    email = models.CharField(max_length=255)
    