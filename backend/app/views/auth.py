from pyramid.view import view_config
from app.models import User
from app.security import check_password, hash_password, create_token, verify_token
from datetime import datetime, timedelta
import random
import string
from sqlalchemy import or_  # Import untuk logika OR

# --- HELPER FUNCTION ---
def get_user_from_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, "Missing Token"
    
    payload = verify_token(auth_header)
    if not payload:
        return None, "Invalid or Expired Token"
        
    return payload, None

# --- AUTHENTICATION VIEWS ---

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        
        # 1. VALIDASI FORMAT EMAIL (UPDATED)
        # Sekarang menerima Gmail DAN Email Student ITERA
        email_input = data['email'].strip().lower()
        allowed_domains = ('@gmail.com', '@student.itera.ac.id')
        
        if not email_input.endswith(allowed_domains):
            request.response.status = 400
            return {'message': 'Registration failed. Please use a valid Gmail or ITERA student email address.'}

        # 2. VALIDASI ROLE
        input_role = data.get('role', '').lower()
        if input_role not in ['admin', 'user']:
            request.response.status = 400
            return {'message': 'Invalid role. Choose "admin" or "user"'}

        # 3. CEK DUPLIKAT EMAIL
        if request.dbsession.query(User).filter_by(email=email_input).first():
            request.response.status = 400
            return {'message': 'Email already exists'}
        
        # 4. CEK DUPLIKAT USERNAME/NAME
        if request.dbsession.query(User).filter_by(name=data['name']).first():
            request.response.status = 400
            return {'message': 'Username already taken. Please choose another one.'}

        new_user = User(
            name=data['name'],
            email=email_input,
            password=hash_password(data['password']),
            role=input_role
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
        
        # Ambil input login (bisa berisi email ATAU nama)
        login_input = data.get('email') or data.get('identifier') or data.get('username')
        
        if not login_input:
            request.response.status = 400
            return {'message': 'Please provide email or username'}

        # Cari user berdasarkan Email ATAU Nama
        # Catatan: login_input otomatis dicocokkan, jadi tidak perlu ubah logika domain disini
        user = request.dbsession.query(User).filter(
            or_(
                User.email == login_input, 
                User.name == login_input
            )
        ).first()
        
        if user and check_password(data['password'], user.password):
            token = create_token(user.id, user.role)
            return {
                'message': 'Login success',
                'token': token,
                'user_id': user.id,
                'role': user.role,
                'name': user.name
            }
        
        request.response.status = 401
        return {'message': 'Invalid username/email or password'}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# --- FORGOT PASSWORD FEATURES ---

@view_config(route_name='forgot_password', renderer='json', request_method='POST')
def forgot_password(request):
    try:
        data = request.json_body
        email = data.get('email')
        
        user = request.dbsession.query(User).filter_by(email=email).first()
        
        if not user:
            request.response.status = 404
            return {'message': 'Email not found'}

        # Generate Token
        chars = string.ascii_uppercase + string.digits
        token = ''.join(random.choices(chars, k=6))
        
        user.reset_token = token
        user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)
        
        request.dbsession.flush()
        
        # Kirim Email
        from app.email_utils import send_reset_token_email
        send_reset_token_email(user.email, token)
        
        return {'message': 'Reset token sent to your email'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='reset_password', renderer='json', request_method='POST')
def reset_password(request):
    try:
        data = request.json_body
        email = data.get('email')
        token = data.get('token')
        new_password = data.get('new_password')
        
        user = request.dbsession.query(User).filter_by(email=email).first()
        if not user:
            request.response.status = 404
            return {'message': 'User not found'}
            
        if user.reset_token != token:
            request.response.status = 400
            return {'message': 'Invalid token'}
            
        if not user.reset_token_expiry or datetime.utcnow() > user.reset_token_expiry:
            request.response.status = 400
            return {'message': 'Token has expired. Please request a new one.'}
            
        user.password = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        
        request.dbsession.flush()
        
        return {'message': 'Password has been reset successfully. Please login.'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# --- ADMIN USER LIST ---

@view_config(route_name='users_list', renderer='json', request_method='GET')
def get_all_users(request):
    try:
        admin_id = request.params.get('admin_id')

        if not admin_id:
            request.response.status = 401
            return {'message': 'Unauthorized: Please provide admin_id'}

        admin = request.dbsession.query(User).get(admin_id)
        if not admin or admin.role != 'admin':
            request.response.status = 403
            return {'message': 'Access Denied: Only Admins can view user list'}

        users = request.dbsession.query(User).all()
        return [{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at.isoformat() if u.created_at else None
        } for u in users]

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}