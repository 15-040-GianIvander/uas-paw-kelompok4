from pyramid.view import view_config
from app.models import User
from app.views.auth import get_user_from_request
from app.file_utils import save_uploaded_file, delete_image_file, get_image_url

# 1. GET PROFILE (Untuk mengisi Form saat halaman dibuka)
@view_config(route_name='profile', renderer='json', request_method='GET')
def get_profile(request):
    try:
        # Ambil user dari Token
        user_data, error = get_user_from_request(request)
        if error: 
            request.response.status = 401
            return {'message': error}

        user = request.dbsession.query(User).get(user_data['sub'])
        if not user:
            request.response.status = 404
            return {'message': 'User not found'}

        # Return data lengkap untuk ditampilkan di UI
        return {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'bio': user.bio,
            'phone_number': user.phone_number,
            'location': user.location,
            'profile_picture_url': get_image_url(request, user.profile_picture),
            'role': user.role
        }
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# 2. UPDATE PROFILE (Simpan Perubahan)
@view_config(route_name='profile', renderer='json', request_method='POST')
def update_profile(request):
    try:
        # Cek Auth
        user_data, error = get_user_from_request(request)
        if error: 
            request.response.status = 401
            return {'message': error}

        user = request.dbsession.query(User).get(user_data['sub'])
        
        # Gunakan request.POST karena ada Upload File (Multipart)
        data = request.POST

        # Update Text Fields
        if 'name' in data and data['name']: 
            user.name = data['name']
        if 'bio' in data: 
            user.bio = data['bio']
        if 'phone_number' in data: 
            user.phone_number = data['phone_number']
        if 'location' in data: 
            user.location = data['location']
        
        # Update Email (Opsional - Perlu validasi duplikat jika diubah)
        # Jika email diubah, kita harus cek apakah email baru sudah dipakai orang lain
        if 'email' in data and data['email'] != user.email:
             existing_email = request.dbsession.query(User).filter_by(email=data['email']).first()
             if existing_email:
                 request.response.status = 400
                 return {'message': 'Email already in use by another account'}
             user.email = data['email']

        # Update Foto Profil
        if 'profile_picture' in request.POST:
            image_input = request.POST['profile_picture']
            # Cek apakah inputnya benar-benar file
            if hasattr(image_input, 'filename'):
                # Hapus foto lama jika ada
                if user.profile_picture:
                    delete_image_file(request, user.profile_picture)
                
                # Simpan foto baru
                new_filename = save_uploaded_file(request, image_input)
                user.profile_picture = new_filename

        request.dbsession.flush()

        return {
            'message': 'Profile updated successfully',
            'profile_picture_url': get_image_url(request, user.profile_picture)
        }

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}