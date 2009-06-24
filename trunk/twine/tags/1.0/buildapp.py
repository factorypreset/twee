#
# This builds an .app out of Twine for use with OS X.
# Call this with this command line: buildapp.py py2app

from distutils.core import setup
import py2app

setup(app = ['app.py'], options = dict(py2app = dict(plist = dict( \
                                       CFBundleShortVersionString = 'beta 2', \
                                       CFBundleName = 'Twine'))))
