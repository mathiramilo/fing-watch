from  werkzeug.security import generate_password_hash

class User:
    def __init__(self, email, id = None):
        self.id = id
        self.email = email
        self.password = None
    
    def setId(self, id):
        self.id = id

    def setPassword(self, password):
        self.password = generate_password_hash(password)

    def toCollectionEntry(self):
        return {
            "id": self.id,
            "email": self.email,
            "password": self.password
        }
        