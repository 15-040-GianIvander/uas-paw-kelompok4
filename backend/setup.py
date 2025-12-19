import os
from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))

def read_text(path):
    try:
        with open(path, encoding='utf-8') as f:
            return f.read()
    except OSError:
        return ''

README = read_text(os.path.join(here, '..', 'Readme.md'))
CHANGES = read_text(os.path.join(here, 'CHANGES.txt'))

runtime_requires = [
    'plaster_pastedeploy',
    'pyramid',
    'waitress',
    'alembic',
    'SQLAlchemy',
    'psycopg2-binary',
    'bcrypt',
    'PyJWT',
]

tests_require = [
    'WebTest',
    'pytest',
    'pytest-cov',
]

dev_requires = tests_require + [
    'pyramid_debugtoolbar',
]

setup(
    name='backend',
    version='0.0',
    description='event ticketing backend',
    long_description=README + ('\n\n' + CHANGES if CHANGES else ''),
    long_description_content_type='text/markdown',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='',
    author_email='',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(exclude=['tests']),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'testing': tests_require,
        'dev': dev_requires,
    },
    install_requires=runtime_requires,
    entry_points={
        'paste.app_factory': [
            'main = app:main',
        ],
    },
)
