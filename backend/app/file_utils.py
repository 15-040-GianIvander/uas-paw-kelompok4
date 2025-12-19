import os
import uuid
import shutil

def get_image_url(request, filename):
    if not filename:
        return None
    return request.static_url(f'app:static/uploads/{filename}')

def save_uploaded_file(request, file_input):
    filename = file_input.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.gif']:
        raise Exception("Invalid image format. Only JPG, PNG, and GIF allowed.")

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    
    upload_dir = request.registry.settings['upload_dir']
    file_path = os.path.join(upload_dir, unique_filename)

    with open(file_path, 'wb') as output_file:
        shutil.copyfileobj(file_input.file, output_file)

    return unique_filename

def delete_image_file(request, filename):
    if not filename:
        return
    upload_dir = request.registry.settings['upload_dir']
    file_path = os.path.join(upload_dir, filename)
    if os.path.exists(file_path):
        os.remove(file_path)