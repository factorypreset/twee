#
# This builds an .exe out of Tweebox for use with OS X.
# Call this with this command line: buildapp.py py2app

from distutils.core import setup
import py2app

setup(app = ['app.py'])
