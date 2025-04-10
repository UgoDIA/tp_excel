from django.test import TestCase
from django.contrib.auth import get_user_model


class AuthTest(TestCase):
    # def setUp(self):
    #     User = get_user_model()
    #     self.user = User.objects.create_user(
    #         username='testuser', password='testpass')

    def test_home_page_authenticated(self):
        self.client.login(username='testuser', password='testpass')
        response = self.client.get('/tp_excel/tp1/')
        self.assertEqual(response.status_code, 200)
