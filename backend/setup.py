from setuptools import setup, find_packages

requires = [
    'plaster_pastedeploy',
    'pyramid',
    'waitress',
    'alembic',
    'sqlalchemy',
    'psycopg2-binary',
]

setup(
    name='backend',
    version='0.0',
    packages=find_packages(),
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = app:main',
        ],
    },
)