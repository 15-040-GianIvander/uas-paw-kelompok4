from pyramid.view import view_config
from app.models import User
from app.views.auth import get_user_from_request
from app.security import hash_password

# Helper untuk validasi Superadmin
def check_superadmin(request):
    user_data, error = get_user_from_request(request)
    if error: return None, error
    if user_data['role'] != 'superadmin':
        return None, 'Forbidden: Superadmin access required'
    return user_data, None

# 1. LIHAT SEMUA USER (User & Admin)
@view_config(route_name='manage_users', renderer='json', request_method='GET')
def get_all_users(request):
    try:
        user_data, error = check_superadmin(request)
        if error:
            # Distinguish between auth error (401) and insufficient role (403)
            if 'Missing' in str(error) or 'Invalid' in str(error):
                request.response.status = 401
            else:
                request.response.status = 403
            return {'message': error}

        users = request.dbsession.query(User).order_by(User.role.asc(), User.name.asc()).all()
        
        return [{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role, # Penting untuk tahu siapa Admin siapa User
            'created_at': u.created_at.isoformat() if u.created_at else None
        } for u in users]

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# 2. TAMBAH USER/ADMIN BARU (Langsung by Superadmin)
@view_config(route_name='manage_users', renderer='json', request_method='POST')
def create_user_by_superadmin(request):
    try:
        _, error = check_superadmin(request)
        if error:
            if 'Missing' in str(error) or 'Invalid' in str(error):
                request.response.status = 401
            else:
                request.response.status = 403
            return {'message': error}

        data = request.json_body
        
        # Validasi sederhana
        if request.dbsession.query(User).filter_by(email=data['email']).first():
            request.response.status = 400
            return {'message': 'Email already exists'}

        # Role bisa dipilih: 'user' atau 'admin'
        target_role = data.get('role', 'user')
        if target_role not in ['user', 'admin', 'superadmin']:
             return {'message': 'Invalid role'}

        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hash_password(data['password']),
            role=target_role
        )
        
        request.dbsession.add(new_user)
        request.dbsession.flush()
        
        return {'message': f'New {target_role} created successfully', 'id': new_user.id}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# 3. UBAH ROLE (Promote/Demote)
@view_config(route_name='manage_user_detail', renderer='json', request_method='PUT')
def update_user_role(request):
    try:
        # Cek Superadmin
        _, error = check_superadmin(request)
        if error:
            if 'Missing' in str(error) or 'Invalid' in str(error):
                request.response.status = 401
            else:
                request.response.status = 403
            return {'message': error}

        target_id = request.matchdict['id']
        data = request.json_body
        new_role = data.get('role') # 'admin' atau 'user'

        if new_role not in ['admin', 'user', 'superadmin']:
            request.response.status = 400
            return {'message': 'Invalid role. Use "admin" or "user".'}

        user = request.dbsession.query(User).get(target_id)
        if not user:
            request.response.status = 404
            return {'message': 'User not found'}

        # Update Role
        user.role = new_role
        request.dbsession.flush()

        return {'message': f'User {user.email} is now a {new_role}'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# 4. HAPUS USER/ADMIN
@view_config(route_name='manage_user_detail', renderer='json', request_method='DELETE')
def delete_user(request):
    try:
        me, error = check_superadmin(request)
        if error: 
            request.response.status = 403
            return {'message': error}

        target_id = request.matchdict['id']
        
        # Jangan hapus diri sendiri!
        if target_id == me['sub']:
            request.response.status = 400
            return {'message': 'You cannot delete yourself!'}

        user = request.dbsession.query(User).get(target_id)
        if not user:
            request.response.status = 404
            return {'message': 'User not found'}

        # Hapus User (Booking & Event terkait akan error jika tidak ada cascade delete,
        # tapi asumsi kita SQLAlchemy relation sudah oke atau kita hapus manual jika perlu.
        # Untuk sekarang kita delete user-nya saja)
        request.dbsession.delete(user)
        
        return {'message': 'User deleted successfully'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}