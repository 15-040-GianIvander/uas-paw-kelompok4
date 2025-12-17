from pyramid.view import view_config
from app.models import User
from app.security import check_password, hash_password, create_token, verify_token

# --- HELPER FUNCTION (Digunakan oleh file lain untuk cek token) ---
def get_user_from_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, "Missing Token"
    
    payload = verify_token(auth_header)
    if not payload:
        return None, "Invalid or Expired Token"
        
    return payload, None # payload berisi {'sub': user_id, 'role': role}

# --- AUTHENTICATION VIEWS ---

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        
        # 1. VALIDASI ROLE (Hanya 'admin' atau 'user')
        input_role = data.get('role', '').lower() # Ubah ke huruf kecil semua
        if input_role not in ['admin', 'user']:
            request.response.status = 400
            return {'message': 'Invalid role. Choose "admin" or "user"'}

        # Cek email duplikat
        if request.dbsession.query(User).filter_by(email=data['email']).first():
            request.response.status = 400
            return {'message': 'Email already exists'}

        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hash_password(data['password']),
            role=input_role # Simpan yang sudah di-lowercase
        )
        
        request.dbsession.add(new_user)
        request.dbsession.flush()
        
        return {'message': 'User created successfully', 'id': new_user.id}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    try:
        data = request.json_body
        user = request.dbsession.query(User).filter_by(email=data['email']).first()
        
        if user and check_password(data['password'], user.password):
            # GENERATE JWT TOKEN
            token = create_token(user.id, user.role)
            
            return {
                'message': 'Login success',
                'token': token,  # <-- Kirim Token ke User
                'user_id': user.id,
                'role': user.role,
                'name': user.name
            }
        
        request.response.status = 401
        return {'message': 'Invalid email or password'}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# --- ADMIN FEATURE (MONITORING USERS) ---
# Saya masukkan fitur ini di auth.py karena berhubungan dengan User Management

@view_config(route_name='users_list', renderer='json', request_method='GET')
def get_all_users(request):
    try:
        # 1. Cek Siapa yang Request? (Sementara pakai query param admin_id)
        # Nanti bisa diupgrade pakai Token juga biar lebih aman
        admin_id = request.params.get('admin_id')

        if not admin_id:
            request.response.status = 401
            return {'message': 'Unauthorized: Please provide admin_id'}

        # 2. Cek di Database: Apakah ID ini beneran Admin?
        admin = request.dbsession.query(User).get(admin_id)
        if not admin or admin.role != 'admin':
            request.response.status = 403 # Forbidden
            return {'message': 'Access Denied: Only Admins can view user list'}

        # 3. Jika Lolos, Tampilkan Semua User
        users = request.dbsession.query(User).all()
        return [{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at.isoformat()
        } for u in users]

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}