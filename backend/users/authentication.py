from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from bson.errors import InvalidId

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        try:
            user_id = validated_token["user_id"]
        except KeyError:
            raise AuthenticationFailed("Token contained no recognizable user identification", code="token_not_valid")

        try:
            user = User.objects(id=user_id).first()
        except InvalidId:
            raise AuthenticationFailed("User not found", code="user_not_found")

        if not user:
            raise AuthenticationFailed('User not found', code='user_not_found')

        if not getattr(user, 'is_active', True):
            raise AuthenticationFailed('User account is deactivated', code='user_inactive')
            
        # Optional: DRF expects user.is_authenticated to be True
        user.is_authenticated = True
        return user
