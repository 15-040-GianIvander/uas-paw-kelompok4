import bcrypt
import jwt
import datetime

# KUNCI RAHASIA (Jangan disebar! Idealnya taruh di environment variable)
SECRET_KEY = "ini_rahasia_banget_jangan_kasih_tau_siapapun"

def hash_password(pw):
    pwhash = bcrypt.hashpw(pw.encode('utf8'), bcrypt.gensalt())
    return pwhash.decode('utf8')

def check_password(pw, hashed_pw):
    expected_hash = hashed_pw.encode('utf8')
    return bcrypt.checkpw(pw.encode('utf8'), expected_hash)

# --- FUNGSI BARU UNTUK JWT ---

def create_token(user_id, role):
    # Token akan kadaluarsa dalam 24 jam
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    payload = {
        'sub': user_id,  # Subject (ID User)
        'role': role,    # Role User
        'exp': expiration
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def verify_token(token):
    try:
        # Hapus prefix 'Bearer ' jika ada
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
            
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload # Mengembalikan {'sub': '...', 'role': '...'}
    except jwt.ExpiredSignatureError:
        return None # Token kadaluarsa
    except jwt.InvalidTokenError:
        return None # Token palsu