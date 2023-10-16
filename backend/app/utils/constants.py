import os

GORSE_API = os.environ["GORSE_SERVICE"] + "/api"
MONGO_URI = os.environ["MONGO_DB"]
JWT_ENCODING_KEY = os.environ["JWT_ENCODING_KEY"]
TOKEN_VALIDITY = os.environ["TOKEN_VALIDITY"]       # Validity in minutes

# Users database configs
USERS_DB = os.environ["USERS_DB"]
USERS_COLLECTION = os.environ["USERS_COLLECTION"]