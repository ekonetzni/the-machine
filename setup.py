try:
    from setuptools import setup
except:
    from distutils.core import setup
    
config = {
    'description':      'The Machine',
    'author':           'Elliot Konetzni',
    'url':              'http://konetzni.com',
    'download_url':     'git',
    'version':          '0.0',
    'install_requires': ['nose'],
    'packages':         [''],
    'scripts':          [],
    'name':             ''
}

setup(**config)