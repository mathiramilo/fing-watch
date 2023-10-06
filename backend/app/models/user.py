from  werkzeug.security import generate_password_hash

class User:
    def __init__(self, username, name, id = None):
        self.id = id
        self.username = username
        self.name = name
        self.password = None
    
    def setId(self, id):
        self.id = id

    def setPassword(self, password):
        self.password = generate_password_hash(password)

    def toCollectionEntry(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "password": self.password
        }
        