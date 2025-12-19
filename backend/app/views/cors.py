from pyramid.view import view_config

@view_config(route_name='cors_preflight', request_method='OPTIONS', renderer='json')
def cors_preflight(request):
    """Respond to CORS preflight (OPTIONS) requests for any /api/* path.

    This returns 200 with the necessary CORS headers. We echo the Origin
    header so browsers will accept credentialed requests from localhost.
    """
    origin = request.headers.get('Origin') or '*'
    request.response.headers.update({
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1728000',
    })
    request.response.status = 200
    return {}
