from pyramid.view import view_config

@view_config(route_name='home', renderer='json', request_method='GET')
def home(request):
    return {'message': 'UAS-PAW-KELOMPOK4'}
