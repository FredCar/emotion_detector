import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.functions import hash_password, check_password_hash


PASSWORD = "password"


def test_hash_password():
    result = hash_password(PASSWORD)
    assert result != PASSWORD


def test_check_password_hash():
    result = check_password_hash(PASSWORD, hash_password(PASSWORD))
    assert result == True