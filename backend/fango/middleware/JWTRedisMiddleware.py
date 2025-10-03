from fango.redis_client import redis_client

class JWTRedisMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_paths = ["/login", "/register"]

    def __call__(self, request):
        printf("Request path: {request.path}")
        printf("Request: {request}")
        # if request.path in self.exempt_paths:
        #     return self.get_response(request)

        # token = request.COOKIES.get("jwt")
        # if token:
        #     ...
        # else:
        #     request.user = None

        return self.get_response(request)