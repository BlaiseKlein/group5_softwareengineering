from rest_framework import serializers
from .models import Person, User

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User