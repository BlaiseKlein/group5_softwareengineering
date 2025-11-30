import os
from .models import AppUser, UserHistory, Language, Word, Translation, UserHistory, Quiz, QuizWord
from .views import LoginView, LogoutView
from .redis_client import redis_client
from unittest.mock import patch
from django.urls import reverse
from django.utils import timezone
from django.test import TestCase
from django.test import override_settings
from rest_framework.test import APIClient
from django.conf import settings
import jwt
import datetime
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image
from fango.redis_client import redis_client
import json

SECRET_KEY = os.getenv('TOKEN_SECRET', 'secret')

class ImageTranslationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.lang = Language.objects.create(code="fr", lang="French")

        self.user = AppUser.objects.create_user(
            email="test@test.com",
            password="123",
            name="Tester",
            default_lang_id=self.lang
        )

        payload = {
            "id": self.user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }

        self.token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        self.client.cookies["jwt"] = self.token
        self.url = reverse("image-translate")

    def mock_redis_user(self, mock_hgetall):
        mock_hgetall.return_value = {
        "id": str(self.user.id),
        "email": self.user.email,
        "jwt": self.token
        }

    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_image_translate_success(self, mock_hgetall, mock_translate):

        self.mock_redis_user(mock_hgetall)

        mock_translate.return_value = {
            "english": "apple",
            "meaning": "a fruit",
            "translated": "pomme",
            "translated-sentence-easy": "Je mange une pomme.",
            "english-sentence-easy": "I eat an apple.",
            "translated-sentence-med": "Il achète une pomme.",
            "english-sentence-med": "He buys an apple.",
            "translated-sentence-hard": "Elle prépare une tarte aux pommes.",
            "english-sentence-hard": "She is making an apple pie."
        }

        fake_img = Image.new("RGB", (100, 100), color="red")
        buf = io.BytesIO()
        fake_img.save(buf, format="JPEG")
        buf.seek(0)

        uploaded = SimpleUploadedFile("test.jpg", buf.read(), content_type="image/jpeg")

        url = reverse("image-translate")

        response = self.client.post(
            url,
            {
                "file":uploaded,
                "target_lang": "french",
                "target_lang_code":"fr"
            },
            format="multipart"
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("user_history_id", response.data)

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_missing_file(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)

        response = self.client.post(
            self.url,
            {
                "target_lang": "french",
                "target_lang_code": "fr"
            },
            format="multipart"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "No file uploaded")

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_file_not_image(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)

        not_image = SimpleUploadedFile("test.txt", b"Not an image", content_type="text/plain")

        response = self.client.post(
            self.url,
            {
                "file": not_image,
                "target_lang": "french",
                "target_lang_code": "fr"
            },
            format="multipart"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Uploaded file is not an image")

    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_openai_service_failure(self, mock_hgetall, mock_translate):
        self.mock_redis_user(mock_hgetall)
        mock_translate.side_effect = Exception("OpenAI API error")
        fake_img = SimpleUploadedFile("test.jpg", b"fakeimage", content_type="image/jpeg")
        response = self.client.post(
            self.url,
            {"file": fake_img, "target_lang": "french", "target_lang_code": "fr"},
            format="multipart"
        )
        self.assertEqual(response.status_code, 500)
        self.assertIn("Failed to get translation", response.data["error"])

    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_translation_missing_keys(self, mock_hgetall, mock_translate):
        self.mock_redis_user(mock_hgetall)
        mock_translate.return_value = {"english": "apple"}
        fake_img = Image.new("RGB", (100, 100), color="red")
        buf = io.BytesIO()
        fake_img.save(buf, format="JPEG")
        buf.seek(0)
        uploaded = SimpleUploadedFile("test.jpg", buf.read(), content_type="image/jpeg")
        response = self.client.post(
            self.url,
            {"file": uploaded, "target_lang": "french", "target_lang_code": "fr"},
            format="multipart"
        )
        self.assertEqual(response.status_code, 500)
        self.assertIn("Missing data keys", response.data["error"])

    @patch("image_handling.views.get_translation")
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_db_save_failure(self, mock_hgetall, mock_translate):
        self.mock_redis_user(mock_hgetall)
        mock_translate.return_value = {
            "english": "apple",
            "meaning": "fruit",
            "translated": "pomme",
            "translated-sentence-easy": "Easy",
            "english-sentence-easy": "Easy",
            "translated-sentence-med": "Med",
            "english-sentence-med": "Med",
            "translated-sentence-hard": "Hard",
            "english-sentence-hard": "Hard"
        }
        with patch("fango.models.Word.objects.create") as mock_word:
            mock_word.side_effect = Exception("DB error")
            fake_img = SimpleUploadedFile("test.jpg", b"fakeimage", content_type="image/jpeg")
            response = self.client.post(
                self.url,
                {"file": fake_img, "target_lang": "french", "target_lang_code": "fr"},
                format="multipart"
            )
            self.assertEqual(response.status_code, 500)
            self.assertIn("Failed to save translation", response.data["error"])

    # ServeImage endpoint
    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_serve_image_success(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)
        save_folder = os.path.join(settings.MEDIA_ROOT, "images")
        os.makedirs(save_folder, exist_ok=True)
        file_path = os.path.join(save_folder, "test.jpg")
        with open(file_path, "wb") as f:
            f.write(b"fakeimagecontent")

        url = f"/api/media/images/test.jpg"
        response = self.client.get(url)

        content_bytes = b"".join(response.streaming_content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(content_bytes, b"fakeimagecontent")

    @patch("fango.middleware.JWTRedisMiddleware.redis_client.hgetall")
    def test_serve_image_not_found(self, mock_hgetall):
        self.mock_redis_user(mock_hgetall)

        url = f"/api/media/images/nonexistent.jpg"
        response = self.client.get(url)

        self.assertEqual(response.status_code, 404)

        data = json.loads(response.content.decode())
        self.assertEqual(data["error"], "File not found")