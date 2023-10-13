MONGODB_HOST = "localhost"
MONGODB_PORT = 27017
JWT_ENCODING_KEY = "a65a4s6a87qw4jhgf687bcv1k56jdfg7h9d8b1cv3gdfhdf6g87ghjcv51df"
# Validity in minutes
TOKEN_VALIDITY = 2


import os

GORSE_API = os.environ["GORSE_SERVICE"] + "/api"
MONGO_URI = os.environ["MONGO_DB"]
