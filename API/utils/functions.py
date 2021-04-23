import hashlib


def hash_password(password):
    return hashlib.sha256(str.encode(password)).hexdigest()


def check_password_hash(password, hash):
    if hash_password(password) == hash:
        return True
    
    return False