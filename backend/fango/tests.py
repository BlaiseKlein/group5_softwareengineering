import os
from django.test import TestCase
from .views import LoginView
from .models import AppUser
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime
from django.utils import timezone

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

class TestLoginUser(TestCase):
    def setUp(self):
        self.service = LoginView()

        self.user = AppUser.objects.create_user(
            email="test@example.com",
            password="correctpassword",
            status="active",
            name="John Doe",
            role="user",
            country="CA",
            difficulty="medium",
        )

        self.banned_user = AppUser.objects.create_user(
            email="banned@example.com",
            password="somepassword",
            status="banned"
        )

    def test_jwt_id(self):
        token = self.service.generate_JWT(self.user)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        self.assertEqual(decoded['id'], self.user.id)

    def test_user_not_found(self):
        with self.assertRaisesMessage(AuthenticationFailed, 'User not found!'):
            self.service.authenticate_user("doesnotexist@example.com", "password")

    def test_successful_authentication(self):
        user = self.service.authenticate_user("test@example.com", "correctpassword")
        self.assertEqual(user.email, "test@example.com")

    def test_incorrect_password(self):
        with self.assertRaisesMessage(AuthenticationFailed, 'Incorrect Password'):
            self.service.authenticate_user("test@example.com", "notpassword")

    def test_banned_user(self):
        with self.assertRaisesMessage(AuthenticationFailed, "User account inactive or banned"):
             self.service.authenticate_user("banned@example.com", "somepassword")


# class TestUpdateUserInfo(TestCase):
